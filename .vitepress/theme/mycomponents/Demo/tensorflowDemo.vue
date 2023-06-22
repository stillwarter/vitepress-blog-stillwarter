<template>
  <div class="tfjstu">
    <h1>tfjs-vis控制盘</h1>
    <strong>数据状态:{{ statusdata }}</strong>
    <strong>训练状态: {{ statustrain }}</strong>
    <span
      >注：输入是房子的平方英尺，不是平方米，输出是房子的价格（美国），请先进行数据加载。</span
    >
    <div>
      <button @click="tfvishow">vis展开</button>
      <button @click="handrun">1.数据加载</button>
      <button ref="trian" @click="handtrainModel">2.模型训练</button>
      <!-- <button @click="save">save</button>
    <button @click="load">load</button> -->
      <input style="width:150px" @keydown.enter="predata($event)" :value="uservalue" />
      <button @click="predict">3.进行预测</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from "vue";

// import * as tf from "@tensorflow/tfjs";
import {
  sequential,
  layers,
  train,
  data,
  util,
  tensor2d,
  tensor1d,
  split,
  io,
  loadLayersModel,
  tidy,
  linspace,
} from "@tensorflow/tfjs";

import * as tfvis from "@tensorflow/tfjs-vis";

let points;
let normalisedFeature, normalisedLabel;
let trainingFeatureTensor,
  testingFeatureTensor,
  trainingLabelTensor,
  testingLabelTensor;
let themodel = reactive({});
let statusdata = ref("当前没有数据");
let statustrain = ref("模型未创建");
let uservalue = ref("预测数据输入（回车键确认）");
let mymodel = reactive({});

watch(
  () => uservalue.value,
  (n, a) => {
    if (n < 40) {
      alert("输入值不能小于40");
      uservalue.value = 40;
    }
  }
);

// 键盘回车 提供predict
function predata(e) {
  if (isNaN(e.target.value)) {
    alert("请输入一个合理的数字");
  }
  uservalue.value = e.target.value;
}
// 手动打开渲染弹框
async function tfvishow() {
  tfvis.visor().toggle();
}

// 手动训练模型
async function handtrainModel() {
  statustrain.value = "模型训练中...（请耐心等待，估计在五分钟左右）";
  htrain().then(() => {
    statustrain.value = "模型训练完成！";
  });
}

// 手动加载数据
async function handrun() {
  statusdata.value = "数据加载中...（数据量较大请请耐心等待）";
  run().then(() => {
    statusdata.value = "数据加载完成！";
  });
}

// 存储模型
const storageID = "kc_house_price_regerssion";
const path = `savedResults.modelArtifactsInfo.dateSaved`;
async function save() {
  const saveResults = await mymodel.save(`localstorage://${storageID}`);
}

// 加载模型
async function load() {
  const storageKey = `localstorage://${storageID}`;
  const models = await io.listModels();
  const modelinfo = models[storageKey];
  let oldmodel;
  if (modelinfo) {
    oldmodel = await loadLayersModel(storageKey);

    tfvis.show.modelSummary({ name: "模型摘要" }, oldmodel);
    const layer = oldmodel.getLayer(undefined, 0);
    tfvis.show.layer({ name: "图层 1" }, layer);

    await plotPredictionLine();
  }
}

// 数据预测
async function predict() {
  const predictionInput = parseInt(uservalue.value);

  tidy(() => {
    const inputTensor = tensor1d([predictionInput]);
    const normaliseInput = normalise(
      inputTensor,
      normalisedFeature.min,
      normalisedFeature.max
    );
    const normaliseOutputTensor = mymodel.predict(normaliseInput.tensor);
    const outputTensor = denormalise(
      normaliseOutputTensor,
      normalisedLabel.min,
      normalisedLabel.max
    );
    const outputValue = outputTensor.dataSync()[0];
    alert('预测价格是：'+outputValue);
  });
}

// 预测线
async function plotPredictionLine() {
  const [xs, ys] = tidy(() => {
    const normalisedXs = linspace(0, 1, 100);
    const normalisedYs = mymodel.predict(normalisedXs.reshape([100, 1]));

    const xs = denormalise(
      normalisedXs,
      normalisedFeature.min,
      normalisedFeature.max
    );
    const ys = denormalise(
      normalisedYs,
      normalisedLabel.min,
      normalisedLabel.max
    );

    return [xs.dataSync(), ys.dataSync()];
  });

  const predictedpoints = Array.from(xs).map((val, index) => {
    return { x: val, y: ys[index] };
  });

  await plot(points, "square feet", predictedpoints);
}

async function htrain() {
  // 5.创建模型
  const model = createModel();
  mymodel = model;
  // 打印model信息
  // model.summary();

  // tfvis渲染model.summary信息
  tfvis.show.modelSummary({ name: "模型摘要" }, model);

  // 获取模型图层
  const layer = model.getLayer(undefined, 0);

  // 渲染图层信息
  tfvis.show.layer({ name: "图层 1" }, layer);

  //
  await plotPredictionLine();

  //
  const result = await trainModel(
    model,
    trainingFeatureTensor,
    trainingLabelTensor
  );
  // await trainModelwithoutvis(model, trainingFeatureTensor, trainingLabelTensor)

  const trainingloss = result.history.loss.pop();
  console.log(trainingloss);

  const validationloss = result.history.val_loss.pop();
  console.log(validationloss);

  const losstensor = model.evaluate(testingFeatureTensor, testingLabelTensor);
  const loss = await losstensor.dataSync();
  console.log(loss[0]);
}

// 归一化处理
function normalise(tensor, previousMin = null, previousMax = null) {
  const min = previousMin || tensor.min();
  const max = previousMax || tensor.max();
  const normalisedTensor = tensor.sub(min).div(max.sub(min));
  return { tensor: normalisedTensor, min, max };
}

// 逆归一化处理
function denormalise(tensor, min, max) {
  const denormalisedTensor = tensor.mul(max.sub(min)).add(min);
  return denormalisedTensor;
}

// 创建模型（最简单的线性回归模型，单图层，单个输入，伪激活函数）
function createModel() {
  // 创建模型
  const model = sequential();
  // 增加图层
  model.add(
    layers.dense({
      units: 1,
      useBias: true,
      activation: "sigmoid",
      inputDim: 1,
    })
  );
  // 模型编译优化
  // const optimizer = train.sgd(0.1);
  const optimizer = train.adam();
  model.compile({
    loss: "meanSquaredError",
    optimizer,
  });
  return model;
}

// 训练模型函数 拟合(带vis)
async function trainModel(model, trainingFeatureTensor, trainingLabelTensor) {
  const { onBatchEnd, onEpochEnd } = tfvis.show.fitCallbacks(
    { name: "训练表现" },
    ["loss"]
  );

  // 进行拟合
  return model.fit(trainingFeatureTensor, trainingLabelTensor, {
    batchSize: 32,
    epochs: 100,
    validationSplit: 0.2,
    callbacks: {
      onEpochEnd,
      onEpochBegin: async function () {
        await plotPredictionLine();
        const layer = mymodel.getLayer(undefined, 0);
        tfvis.show.layer({ name: "图层 1" }, layer);
      },
    },
  });
}

//
async function trainModelwithoutvis(
  model,
  trainingFeatureTensor,
  trainingLabelTensor
) {
  model.fit(trainingFeatureTensor, trainingLabelTensor, {
    epochs: 10000,
    callbacks: {
      onEpochEnd: (epoch, log) =>
        console.log(`epoch ${epoch}:loss=${log.loss}`),
    },
  });
}

// tfjs-vis渲染
async function plot(pointsarray, featurename, predictedpointsarray = null) {
  // const values = [pointsarray.slice(0, 1000)];
  const values = [pointsarray];
  const series = ["original"];
  if (Array.isArray(predictedpointsarray)) {
    values.push(predictedpointsarray);
    series.push("predict");
  }

  tfvis.render.scatterplot(
    { name: `${featurename} vs 房价` },
    { values, series },
    {
      xLabel: featurename,
      yLabel: "价格",
    }
  );
}

// run
async function run() {
  // 1.导入csv文件
  const da = data.csv(
    // "http://rsvoy3vft.hn-bkt.clouddn.com/kc_house_data.csv"
    "/csv/kc_house_data.mp3"
    // "https://attachment.0sm.com/node0/2023/04/86434431EA805A03-fb7b9f9426927d4e.mp3"
  );

  // const da=[]
  // const sda = da.take(10);
  // const darray = await sda.toArray();
  // console.log(await da.toArray());
  // let e = await da.toArray();
  // e.map((record) => {
  //   record.High = parseInt(record.High.replace(",", ""));
  //   record.Low = parseInt(record.Low.replace(",", ""));
  // });
  // await da.toArray().map((record) => {
  //   record.High = Math.ceil(record.High);
  // });

  // const points = e.map((record) => ({
  //   x: record.High,
  //   y: record.Low,
  // }));

  // 2.提取x，y值并捕获数据集用于绘制
  const pointsDataset = da.map((record) => ({
    x: record.sqft_living,
    y: record.price,
  }));
  points = await pointsDataset.toArray();
  console.log(points);

  // const points=[]
  if (points.length % 2 !== 0) {
    points.pop();
  }
  util.shuffle(points);
  plot(points, "Square Feet");

  // 3.提取特征并将其存储在张量里
  // 输入的张量 对应x轴
  const featureValues = points.map((p) => p.x);
  const featureTensor = tensor2d(featureValues, [featureValues.length, 1]);

  // 输出的张量 对应y轴
  const labelValues = points.map((p) => p.y);
  const labelTensor = tensor2d(labelValues, [labelValues.length, 1]);
  // 打印
  // featureTensor.print();
  // labelTensor.print();

  // 4.对tensor进行归一化处理
  normalisedFeature = normalise(featureTensor);
  normalisedLabel = normalise(labelTensor);
  // 内存管理
  featureTensor.dispose();
  labelTensor.dispose();

  // 打印
  normalisedFeature.tensor.print();
  // normalisedLabel.tensor.print();

  // 逆归一化处理打印
  // denormalise(normalisedFeature.tensor,normalisedFeature.min,normalisedFeature.max).print()

  // 数据拆分为训练和测试两块
  [trainingFeatureTensor, testingFeatureTensor] = split(
    normalisedFeature.tensor,
    2
  );
  [trainingLabelTensor, testingLabelTensor] = split(normalisedLabel.tensor, 2);
  trainingFeatureTensor.print(true);
}

onMounted(() => {
  tfvishow();

  setTimeout(() => {
    const tfvis = document.getElementById("tfjs-visor-container");
    const ch = tfvis.firstChild;
    ch.style.cssText = "height:80%;margin-top:100px;z-index;100";
  }, 0);
});
</script>

<style lang="less" scoped>
.tfjstu {
  min-height: 10vh;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-content: flex-start;
  align-items: flex-start;
}
button {
  width: 100px;
  height: 50px;
  background: linear-gradient(65deg, #23fad2, #08f);
  box-shadow: 0 8px 16px rgba(32, 41, 50, 0.32);
  border-radius: 8px;
  margin: 10px;
}

input {
  width: 100px;
  height: 50px;
  background: linear-gradient(15deg, #23fad2, #08f);
  box-shadow: 1px 8px 16px rgba(32, 41, 50, 0.5);
  border-radius: 8px;
  margin: 10px;
}
</style>
