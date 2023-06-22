---
title: tensorflow.js Demo
date: 2023-04-17
outline: deep
tags:
  - tfjs
  - Stu
  - Demo
---

# tensorflow.js Demo

一个 tensorflowjs 的 demo，你会了解到如何使用它去构建一个模型，用这个模型去对未知的数据进行预测。

## 前言

在我还在上大学的时候，接触到一个叫 handsfreejs 的库（现在好像没有了），这个库可以实时解析用户的手势，并且可以直接用你的双手或者面部操作鼠标，当时感觉这个真的很厉害（没办法我是土猫），虽然会清晰的感知到操作延迟，但它不需要任何其他设备的支持（摄像头还是要的），这个库里就提到了 tfjs。

但由于当时自己学业压力和技术力低下，连入门的文档都看不懂...直到工作之后，才慢慢明白，该如何去学习。

当我看这些如海水一般的 js 库时，虽然什么也不懂，但这种了解未知的过程却是让人欣喜的！很多时候了解未知需要依靠别人的讲解，所以很感谢那些传道者，希望有朝一日我能像这些优秀的前辈一样。

我的内容里可能有许多描述错误或不严谨的地方，请见谅，若有错误可以在[鱼排](https://fishpi.cn/article/1681667244789)指出！

## 示例

<tensorflowDemo/>

源码会在后续更新

<!-- 源码：<a style="cursor: pointer;" href="https://github.com/stillwarter/vitepress-blog-stillwarter/blob/master/.vitepress/theme/mycomponents/Demo/threeDemo.vue">sir，this way</a> -->

## 实现

### 0.环境准备

```js
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
```

这是了解 tfjs 需要提前准备好的包，若你嫌麻烦，也可以向注释那样使用 tfjs。这里包含了我们需要的方法以及 tfvis，配合 tfvis 的可视化工具。

### 1.概念理解

在开始之前先了解一些概念：

##### 1.1 tfjs

tfjs--tensorflow.js，由 tensorflow 衍生，tensorflow 有 google 团队开发的深度学习框架之一，完全基于 python 语言设计，它结合计算代数的优化技术，可应用许多场景比如图像识别，自然语言处理，音频处理等。

##### 1.2 tensor

tensorflow 这个词由 tensor 和 flow 组成，也是最基础的要素。tensor 代表张量，可以理解为数据（其表现形式是一个多维数组），flow 代表流动，代表计算与映射，用于操作我们的数据流。

在数学里，张量是一种数学性质对象，张量是描述爱因斯坦广义相对论的曲率的基本语言，它根据空间的基向量的改变而发生特殊的变形。

简单说来，你可以理解为 tensorflow 中声明数据的一种方式。

##### 1.3 线性回归和线性回归模型

（在这个 demo 里构建的就是线性回归模型）

这是一个广阔的问题，线性回归是工业界使用的最广泛的模型，涉及线性，一元线性回归，多元线性回归，距离判别，最小二乘法，正态分布，矩阵运算，梯度下降等等。

[【从入门到放弃】线性回归 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/147297924)

- 1.3.1 什么是线性回归？

理解这个问题需要理解机器学习背后的统计学是基于什么样的假设，试图解决什么问题。

在二十二世纪基于传统牛顿力学相对论等理论的成功，**认为世界是由因果规律支配的，一切事物都严格遵守因果律和自然法则**。

而到二十世纪二十年代，开创量子力学的哥本哈根学派科学家波尔，海森伯则认为 **世界上一切事物的发生都是不确定的，只能由概率去描述事物的运动规律。也就是说世间一切的事儿都符合某种概率分布而不是因果，可以用概率模型来表示一切规律。**

机器学习就是希望通过历史数据来找到事物背后的模式（pattern），而线性模型就是描述事物背后规律的一种方法，同时大部分的问题也是可以用线性模型来表示的。

- 1.3.2 什么是线性？

很多时候我们会根据字面意思将线性简单的理解成预测的模型是一条线，或者在分类任务中用一条线将数据分开。然而线性模型也可以通过基函数的方式画出曲线分类线，线性限制的是 parameter（参数）而不是 feature（自变量）。

从定义上看：线性回归分析是确定两种或两种以上变量间相互依赖的定量关系的一种统计分析方法。本质上说这种变量间依赖关系就是一种线性相关性，线性相关性是线性回归模型的理论基础。

比如：

身高：由父母的身高，家庭收入，地区等因素决定

房价：由地段，面积，周围环境，时间等因素决定

线性回归首先要做的就是找到一个数学公式能相对完美的把所有自变量组合（加减乘除）起来，得到的结果和目标接近。

所以线性的定义是：自变量之间只存在线性关系，即自变量只能通过加减进行组合。

##### 1.4 归一化处理

简单说，使用归一化是为了减弱特殊样本（奇异样本）数据导致的不良影响。特殊样本存在会引起训练时间增大，同时也可能无法收敛，所以对数据进行归一化处理可以减弱这种影响。

##### 1.5 如何使用 tensorflow 对线性回归问题进行建模？

- 我们的图层模型由多个图层组成，通常按顺序排列，其中每个图层都包含一个编号。这是基于人工神经网络的思想，但事实证明线性回归是可以使用 layers api 创建的最简单的模型之一。它并不是有多个层，我们将其简化到一层，并且将节点简化为单个节点。
- 所以我们有一个单一的层和一个节点。
- 前面有神经网络节点的图片。

  节点具有多个输入，我们可以对输入进行加权，让后根据输入求和（进行函数运算），然后这个结果通过激活函数传递，这个激活函数得接受到足够强的信号才会发射。

  早期得人工神经网络使用阶跃函数，其中阈值将决定是否存在输出。没有就是 0 或 1。但并不是很有效。所以后来得人工神经网络得激活函数通常更平滑。

- 回归都简单得线性回归问题中。

  我们将只有一个输入，所以求和函数也可以不用了。但考虑到偏差，所以我们将其调整到加权输入中。而由于简单得特性，我们将激活函数调整为线性得，也就是说输入即输出。实际上可以理解为没有激活功能。

- 得到的剑魔方程就是 y=mx+c

  m 就是权重，c 是偏差。用 tfjs 表示就是：

  ```js
  function createModel() {
    const model = tf.sequential();

    model.add(
      tf.layers.dense({
        units: 1,
        useBias: true,
        activation: "linear",
        inputDim: 1,
      })
    );

    return model;
  }
  ```

  我们使用 dense 来创建图层，units 代表这个图层有多少节点，我们只需要一个。useBias 可以更加好配合训练（就是使用偏差量），activation 表示激活方式，这里使用线性激活；模型的输入将是一个张量，该张量可以具有任意数量的尺寸和任何形状，通常由两个维度；沿着一个维度是每个数据点，沿着另一个维度是我们正在使用的每个功能？所以在这样一个简单的模型里，我们只有一个特征，我们将有一个二维张量，有两种方法可以指定输入形状。首先，我们可以指定输入张量的尺寸和形状，其次对于最常见的情况可以指定一个匹配的数字。

在使用模型进行训练或测试之前，需要在模型上调用编译。这里的编译就好像一个优化过程。

[[模型编译]model.compile 使用 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/467342861)

有两个用于编译的强制参数，一个是优化器，一个是损失，可选的是 metrics 度量。
损失函数定义了我们如何评估模型，这意味着我们对某些数据集评估模型中的预测。
优化器用于在训练过程中最小化损失。

### 2.加载 csv 数据

构建模型的前提是准备好训练需要用的数据，这里我们使用的数据来自 kaggle 的 kc_house_data.csv。

```js
const housedata=data.csv({
  "/csv/kc_house_data.mp3"
  //"https://attachment.0sm.com/node0/2023/04/86434431EA805A03-fb7b9f9426927d4e.mp3
})
```

data.csv 是 tfjs 封装好的数据请求方法，本质上是一个 fetch，这里的相对路径是我本地使用的，当我打包上传时需要用到后面的链接（不这么做 vitepress 打包会报错，这个报错折腾了我一天呜呜呜）

### 3.对 csv 数据进行预处理

kc_house_data 数据量很多，我们只正对其某些特征进行训练，所以我们需要将数据转换为 tensorflow 要求的 tensor 数据。

```js
// 提取x，y值并捕获数据集用于绘制
const pointsDataset = housedata.map((record) => ({
  x: record.sqft_living,
  y: record.price,
}));
points = await pointsDataset.toArray();
//console.log(points);

if (points.length % 2 !== 0) {
  points.pop();
}
util.shuffle(points);
plot(points, "Square Feet");

// 提取特征并将其存储在张量里
// 输入的张量 对应x轴
const featureValues = points.map((p) => p.x);
const featureTensor = tensor2d(featureValues, [featureValues.length, 1]);

// 输出的张量 对应y轴
const labelValues = points.map((p) => p.y);
const labelTensor = tensor2d(labelValues, [labelValues.length, 1]);
// 打印
// featureTensor.print();
// labelTensor.print();

// 对tensor进行归一化处理
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
```

首先对 housedata 进行处理，将 csv 数据中的 sqft_living,price 两个字段的数据进行提取并转换为数组。

然后对数据进行单复数判断，因为要将数据分为训练和测试两部分，util.shuffle(points)是打乱数据的方法。

featureTensor.dispose()，会对 tensor 使用的内存进行优化，在我们训练模型时，若训练时间很长或数据流太大是会使 devtool 内核崩溃的，我自己训练过程中，最大占据的内存高达 4G。

后续将数据转变为张量供 tfjs 使用。

### 4.使用 tfjs-vis 渲染数据

现在我们有了数据，可以使用 tfjs-vis 对我们的数据进行可视化渲染。

```js
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
```

### 5.创建模型

tfjs 本身有 squential 这个方法来帮助我们构建模型，这个方法可以增加一个 layer，我的理解就是一个神经网络的层，而在这个 demo 里，我们只需要一个输入（input），一个权重（weights），一个激活函数（activation function），最后由这个激活函数给出 output。

简单来说我们将用 squential 构建一个简单的神经元来对我们的问题进行预测。

```js
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
```

### 6.训练模型

模型创建好了，可以使用数据对其进行训练了！tfjs 配合 tfjs-vis 可以将训练过程可视化，tfjs.model.fit 方法可以自动训练我们的数据。

```js
// 训练模型函数 拟合(带vis)
async function trainModel(model, trainingFeatureTensor, trainingLabelTensor) {
  const { onBatchEnd, onEpochEnd } = tfvis.show.fitCallbacks(
    { name: "训练表现" },
    ["loss"]
  );

  // 进行拟合
  return model.fit(trainingFeatureTensor, trainingLabelTensor, {
    batchSize: 32, // 梯度更新的样本数
    epochs: 100, // 训练迭代次数
    validationSplit: 0.2, // 验证拆分
    /**
     * 0 到 1 之间的浮点数：训练数据的一部分 用作验证数据。该模型将区分这部分 训练数据，不会对其进行训练，并将评估损失和 每个纪元结束时此数据的任何模型指标。 在随机播放之前，从提供的 x 和 y 数据中的最后一个样本中选择验证数据。
     */
    callbacks: {
      //训练回调
      onEpochEnd,
      onEpochBegin: async function () {
        await plotPredictionLine();
        const layer = mymodel.getLayer(undefined, 0);
        tfvis.show.layer({ name: "图层 1" }, layer);
      },
    },
  });
}

async function htrain() {
  // 创建模型
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

  // 预测线
  await plotPredictionLine();

  // 数据拟合
  const result = await trainModel(
    model,
    trainingFeatureTensor,
    trainingLabelTensor
  );
  // await trainModelwithoutvis(model, trainingFeatureTensor, trainingLabelTensor)

  // 训练损失
  const trainingloss = result.history.loss.pop();
  console.log(trainingloss);

  // 平均损失
  const validationloss = result.history.val_loss.pop();
  console.log(validationloss);

  const losstensor = model.evaluate(testingFeatureTensor, testingLabelTensor);

  // 测试损失
  const loss = await losstensor.dataSync();
  console.log(loss[0]);
}
```

### 7.预测线渲染

在训练数据的时候，可以从大量的点上渲染一条预测函数出来。

```js
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
```

### 8.数据预测

当我们训练完成后，就可以使用这个模型来进行预测了。redictionInput 就是输入，最后会输出模型得到的答案。

```js
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
    console.log(outputValue);
  });
}
```

## 其他

很惭愧，我只是搬运工，对机器学习，人工智能的认知为 0，这上述的知识你都可以在这里找到：
[使用 TensorFlow.js 在 JavaScript 中进行机器学习](https://www.bilibili.com/video/BV18q4y1z7uy?p=1&vd_source=6e8d0cd78fe3eb2103b38abe81966907)，以及其他的模型可以在 tfjs 中文官网找到栗子。

此外 tfjs 还提供很多其他的功能，请在官网查看。

不过我大概明白如何通过大量数据去对未知数据进行简单预测的过程，然后在这个基础上不断增加变量（feature），最后构建一个网络来解决问题。感觉有些暴力，用数据去回答数据，用概率去描述概率。

希望我能利用这些做到更有趣的事情吧。
