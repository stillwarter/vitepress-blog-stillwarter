<template>
  <!-- <div class="main">
    <div class="drawbox">
      <div
        class="commonpixel"
        v-for="(item, index) in num"
        @mousedown="renderpixel(index)"
        @mouseover="mouseover(index)"
        @mouseup="mouseup(index)"
      ></div>
    </div>

    <mycolorpicker />

    <div class="log">
      {{ log }}
    </div>

    <div class="tempshow">
      <button class="btn" @click="savafrmae">保存</button>
      <button class="btn" @click="removepoints">擦除</button>
      <button class="btn" @click="clearbar">清空</button>
    </div>
    <div class="tempshow">
      <div class="frame" v-for="(item, index) in framelist" :key="index">
        {{ item.name }}{{ item.id }}
      </div>
    </div>

    <button class="btn" @click="drawdemo">渲染</button>

    <button class="btn" @click="export2Excel">导出动画</button>

    <canvas id="pixel" width="1000" height="500"></canvas>
  </div> -->

  <div class="st-drawbox">
    <div class="shadow" ref="shadow">
      <div class="main" ref="mainbox">
        <div class="drwastart" v-if="startbtnstatus">
          <div class="btn" @click="startdraw">开始绘制</div>
          <div class="btn" @click="toinfopage">查看演示</div>
          <div class="btn">数据导入？</div>

          <div class="tips">tips: 这个玩意暂时就这些内容，如果有机会，会再完善下去。此外，请在pc端使用本功能，移动端并未进行ui适配。</div>
        </div>

        <div class="drawboxs" ref="drawboxs" v-if="drawboxstatus">
          <div
            class="pixel"
            ref="pixels"
            v-for="(item, index) in pixelsnum"
            @mousedown="setcolorforpixel(index)"
            @mouseover="movesetcolorforpixel(index)"
            @mouseup="upsetcolorforpixel(index)"
            :key="index"
          ></div>
        </div>
      </div>
      <div class="leftmeun" v-if="drawboxstatus">
        <mycolorpicker />

        <div class="funcbox">
          <div class="item">
            <p v-if="eraserflag" @click="changeraserstatus">橡皮（开启）</p>
            <p v-else @click="changeraserstatus">橡皮（关闭）</p>
            <p v-if="!savelastframeflag" @click="changelastframestatus">
              保留上一帧绘制路径（否）
            </p>
            <p v-else @click="changelastframestatus">
              保留上一帧绘制路径（是）
            </p>
          </div>
        </div>

        <div class="frame">
          <div
            class="item"
            v-for="(item, index) in framelist"
            :key="index"
            @click="choseframe(index)"
          >
            <p v-if="framekey == index" style="color: red">当前帧</p>
            <p v-else>第{{ index + 1 }}帧</p>
          </div>
        </div>
        <div class="addframebtn">
          <p style="margin-right: 12px" @click="addframe">增加帧</p>
          <p
            style="margin-right: 12px"
            @click="insertframe"
            v-if="framekey != framelist.length - 1"
          >
            插入帧
          </p>
          <p @click="delframe">删除当前帧</p>
        </div>

        <div class="render">
          <p style="margin-right: 12px" @click="openpreviewcanvas">绘制预览</p>
          <p style="margin-right: 12px" @click="export2Excel">绘制导出</p>
          <p>数据导出？</p>
        </div>
      </div>
    </div>



    <!-- chosesize弹框 -->
    <div class="chosesize" ref="chosesize">
      <p>选择绘制尺寸</p>
      
      <div class="tips">tips: 目前仅支持5px和30*30像素空间，自定义未支持捏</div>
      <div class="pixelnum" style="display: flex">
        选择像素尺寸
        <p
          v-for="(item, index) in [2, 3, 4, 5]"
          :key="index"
          @click="chosepixelsize(item)"
        >
          {{ item }}px
        </p>

        <p>当前选择尺寸：{{ pixelsize }}px</p>
      </div>
      <div class="presets">
        <p
          v-for="(item, index) in predrawsize"
          :key="index"
          @click="createdrawbox(index)"
        >
          {{ item }}
        </p>
      </div>

      <div class="your">
        <p class="lable">row:</p>
        <input
          type="text"
          placeholder="自定义行数(x轴)"
          name="title"
          style="margin-right: 10px"
        />

        <p class="lable">col:</p>
        <input type="text" placeholder="自定义列数(y轴)" name="title" />
      </div>
    </div>

    <!-- 预览弹框 -->
    <div class="previewbox" ref="previewcanvas">
      绘制预览
      <canvas id="pixel" ref="pixelbox"></canvas>
      <div class="btnbox">
        <p style="margin-right: 12px"  @click="export2Excel">导出</p>
        <p @click="closepreviewcanvas">关闭</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, getCurrentInstance } from "vue";
import { setscode } from "./components/defaultexport.js";

// export default defineComponent({
//   components: { ColorPicker },
// });

/*
 * 参数说明
 * shadow 全局模糊参数
 * predrawsize 绘制尺寸预设
 * startbtnstatus 是否显示初始btn
 * drawboxstatus 是否显示drwabox
 * pixelsize 像素尺寸 默认为5
 * pixelist 像素list
 * drawbox drawbox dom
 * mainbox mian dom
 * pixels pixels dom
 * eraserflag eraser状态 默认关闭
 * framekey 当前关键帧
 * frame 绘制帧
 * framelist 帧表 默认为一帧
 * previewcanvas previewcanvas dom
 * pixelbox pixelbox dom
 * savelastframeflag 是否保存上一帧 默认为否
 */
const startbtnstatus = ref(1);
const drawboxstatus = ref(0);
const pixelsize = ref(5);
const pixelsnum = ref(null);
const mainbox = ref(null);
const pixels = ref(null);
const predrawsize = ref([
  "30*30（头像）",
]);
const eraserflag = ref(false);

const drawboxs = ref(null);

const framekey = ref(0);
const frame = {
  name: "关键帧",
  point: [],
};

const framelist = ref([frame]);
const previewcanvas = ref(null);
const pixelbox = ref(null);
const savelastframeflag = ref(false);

/* 进入绘制状态（那么封装一个弹出栏的js函数库吧） */
/*
 * 进入绘制状态需要完成的事件：
 * 0.全局模糊
 * 1.弹出绘制选择栏
 * 2.全局清晰，关闭选择栏
 * 3.隐藏初始按钮
 * 4.生成对应的绘制窗体
 */

const shadow = ref(null);
function startdraw() {
  mainvague(shadow);
  openchosesize();
}

/* 打开全局模糊 */
function mainvague(vdom) {
  vdom.value.style.zIndex = 0;
}

/* 关闭全局模糊 */
function closemainvague(vdom) {
  vdom.value.style.zIndex = 10;
}

const chosesize = ref(null);
/* 打开chosesize窗口 */
function openchosesize() {
  chosesize.value.style.transform = "scale(1)";
}

/* 打开previewcanvas窗口 绘制结预览 */
function openpreviewcanvas() {
  rendercanvasflag = 1;
  mainvague(shadow);
  previewcanvas.value.style.transform = "scale(1)";

  setTimeout(() => {
    setcanvasize();
    rendercavans();
  }, 100);
}

/* 设置canvas大小 */
function setcanvasize() {
  // pixelbox.value.style.width=drawboxs.value.style.width
  // pixelbox.value.style.height=drawboxs.value.style.height
  pixelbox.value.width = 300;
  pixelbox.value.height = 300;
  // const pixeldom=document.querySelector("#pixel")
  // pixeldom.width=300
  // console.dir(pixel);
}

/* 打开后进行绘制render */
let drawdemoindex = 0;
let drawdemoindexdelay = 1;
let rendercanvasflag = 1;
function rendercavans() {
  // clearcanvas();
  // drawframe();
  // drawdemoindex++;
  // requestAnimationFrame(rendercavans);
  if (
    drawdemoindex <= framelist.value.length - 1 &&
    drawdemoindexdelay % 20 == 0
  ) {
    clearcanvas();
    drawframe();
    drawdemoindex++;
    requestAnimationFrame(rendercavans);
  } else if (drawdemoindexdelay % 20 == 0) {
    drawdemoindex = 0;

    clearcanvas();
    drawframe();
    requestAnimationFrame(rendercavans);
  } else if (!rendercanvasflag) {
    return;
  } else {
    requestAnimationFrame(rendercavans);
  }

  drawdemoindexdelay++;
}

/* 关闭chosesize窗口 */
function closechosesize() {
  chosesize.value.style.transform = "scale(0)";
}

/* 关闭previewcanvas窗口 */
function closepreviewcanvas() {
  previewcanvas.value.style.transform = "scale(0)";
  closemainvague(shadow);
  rendercanvasflag = 0;
}

/* 选择像素尺寸 */
function chosepixelsize(size) {
  pixelsize.value = size;
}

/* 生成绘制窗体并关闭当前弹窗 */
function createdrawbox(index) {
  startbtnstatus.value = 0;
  closechosesize();
  closemainvague(shadow);
  opendrawbox(index);
}

/*
 * 1.绘制窗体需要固定大小吗？
 *   可以，刚好缩放的时候可以更好操作画笔
 * 2.如何添加这个可操作dom
 *   预设这个dom吧，其大小如何控制？
 *     先不管，先做一个
 *     index=0的情况下，做一个30*30的
 * 3.像素的大小是否要固定呢？
 *     可以做一个范围出来，最大值为5吧，先这样做
 *     所以30*30的是 150*150
 * 4.在创建前 获取当前视口的大小，再对绘图区域进行处理
 *
 */
/* 打开绘制窗体 */
function opendrawbox(index) {
  drawboxstatus.value = 1;

  const farthwidth = mainbox.value;
  console.log(farthwidth.offsetHeight, farthwidth.offsetWidth);

  if (index == 0) {
    pixelsnum.value = 901;
    setTimeout(() => {
      // console.log(drawboxs.value, shadow.value, drawboxstatus.value);
      // drawboxs.value.style.width = "310px";
      // drawboxs.value.style.height = "290px";
      setdrawboxsize();
    }, 10);
  }


}

/* 设置绘制窗体，像素的大小 */
function setdrawboxsize() {
  const farth = mainbox.value;

  const farthwidth = farth.offsetWidth;
  const farthheight = farth.offsetHeight;

  console.log(pixelsnum.value, pixelsize.value);

  if (pixelsnum.value == 901) {
    const stand = 30 * 5 * 2;
    const width = stand + 10;
    const height = stand - 10;
    drawboxs.value.style.width = `${width}px`;
    drawboxs.value.style.height = `${height}px`;
    drawboxs.value.style.transform = "scale(2.5)";
  }
}

/* 鼠标移动flag */
let setcolorflag = 0;
/* 画笔（点击上色） */
function setcolorforpixel(index) {
  const thepixeldom = pixels.value;
  // console.log(thepixeldom[index]);
  const color = sessionStorage.getItem("endcolor");
  if (eraserflag.value) {
    thepixeldom[index].style = `background:null`;
  } else {
    thepixeldom[index].style = `background:${color}`;
  }
  setcolorflag = 1;
  getpointpositions(index);
}

/* 鼠标移动上色 */
function movesetcolorforpixel(index) {
  if (setcolorflag) {
    setcolorforpixel(index);
  }
}

/* 鼠标停止移动 */
function upsetcolorforpixel() {
  setcolorflag = 0;
}

/* 改变橡皮状态 */
function changeraserstatus() {
  eraserflag.value = !eraserflag.value;
  if (eraserflag.value) {
    sessionStorage.setItem("endcolor", "null");
  } else {
    sessionStorage.setItem("endcolor", "rgb(255, 0, 0)");
  }
}

/* 改变绘制保存上一帧状态 */
function changelastframestatus() {
  savelastframeflag.value = !savelastframeflag.value;
}

/*
 * 收集绘制的像素点
 * 根据当前像素的index值，结合绘制窗体的长宽，计算出当前的x，y值
 * 将坐标值存储到framelist里
 *
 * 需要考虑到当前录入是否需要将前一帧的数据录入到下一帧
 * 所以增加一个index值对应绘制框是哪一个像素dom
 */
function getpointpositions(index) {
  const thepixeldom = pixels.value;
  const width = parseInt(drawboxs.value.style.width);
  const height = parseInt(drawboxs.value.style.height);
  const stand = width / parseInt(thepixeldom[index].offsetHeight);
  // console.log(thepixeldom[index].offsetHeight);

  const point = { x: 0, y: 0 };
  point.x = parseInt(index % stand);
  point.y = parseInt(index / stand);
  point.color = sessionStorage.getItem("endcolor");
  point.sort = index;
  // console.log(point);
  /* 采用unshift是为了配合去重函数 */
  framelist.value[framekey.value].point.unshift(point);
  console.log(framelist.value[framekey.value].point);
}

/*
 * 增加帧
 * 注意增加帧的时候 是否保留当前数据到下一帧
 */
function addframe() {
  if (framelist.value[framekey.value].point.length == 0) {
    alert("请先绘制图案");
    return;
  }
  const frame = {
    name: "关键帧",
    point: [],
  };

  framelist.value.push(frame);
  framekey.value = framelist.value.length - 1;

  if (!savelastframeflag.value) {
    clearframepixel();
  }
}

/* 清空绘制窗口像素 */
function clearframepixel() {
  const thepixeldom = pixels.value;

  for (const item of thepixeldom) {
    item.style = `background:null`;
  }
}

/*
 * 渲染绘制窗口像素
 * 我需要对每一帧的画进行渲染
 * 但是我只有一个绘制窗口，如何对不同的绘制数据进行渲染呢？
 *
 * 可以先清空，然后走一下颜色渲染，在点击帧的时候，触发本事件
 */
function setframepixel() {
  clearframepixel();

  const list = framelist.value[framekey.value];
  const thepixeldom = pixels.value;

  for (const item of list.point) {
    thepixeldom[item.sort].style = `background:${item.color}`;
  }
}

/* 插入帧 */
function insertframe() {
  if (framelist.value[framekey.value].point.length == 0) {
    alert("请先绘制图案");
    return;
  }

  if (!savelastframeflag.value) {
    clearframepixel();
  }

  if (framelist.value[framekey.value + 1].point.length != 0) {
    const frame = {
      name: "关键帧",
      point: [],
    };
    framelist.value.splice(framekey.value + 1, 0, frame);
    framekey.value += 1;
  } else {
    framekey.value = framelist.value.length - 1;
  }
}

/*
 * 选择帧
 * 如果当前的关键帧等于传入的参数，那么就不进行渲染函数
 */
function choseframe(index) {
  if (framekey.value == index) {
    return;
  } else {
    framekey.value = index;
    setTimeout(() => {
      setframepixel();
    }, 10);
  }
}

/* 删除当前帧 */
function delframe() {
  if (framelist.value.length == 1) {
    alert("必选保留一个帧");
    return;
  } else {
    framelist.value.splice(framekey.value, 1);
    // console.log( framelist.value);
    
    framekey.value = 0;
    setframepixel(0)
  }
}

/* 绘制结果导出 */
function htmlendexport() {}

  /* 跳转到介绍页面 */
function toinfopage(){
  window.open("https://stillwarter.github.io/posts/pixeltool.html") 
}


const thecolor = ref("red");

let num = ref(1);

let mouseflag = ref(0);

let frmaeindex = 0;

let log = ref("玩玩画板吧");

const pixelist = [frame];

let renderindex = 0;
let renderdelay = 1;

num.value = getbasebox();

// 根据当前视口情况生成绘图板
// row col 分别对应行和列
function getbasebox() {
  const width = parseInt(window.innerWidth / 2);
  const height = parseInt(window.innerHeight / 2) - 50;

  const row = parseInt(width / 10);
  const col = parseInt(height / 10);

  return row * col;
}

//
function renderpixel(index) {
  const dom = document.querySelectorAll(".commonpixel")[index];
  // const color = thecolor.value;
  // console.log(thecolor.value);
  const color = sessionStorage.getItem("endcolor");
  dom.style = `background:${color}`;
  if (removepointsflag) {
    dom.style = "";
  }
  getpointposition(index);
  mouseflag.value = 1;
}

// 鼠标按下
function mouseup(index) {
  const dom = document.querySelectorAll(".commonpixel");
  mouseflag.value = 0;
}

// 鼠标按下移动事件
function mouseover(index) {
  if (mouseflag.value) {
    const dom = document.querySelectorAll(".commonpixel")[index];
    const color = sessionStorage.getItem("endcolor");
    dom.style = `background:${color}`;
    if (removepointsflag) {
      log.value = "正在擦除像素点...";
      dom.style = "";
    } else {
      log.value = "正在绘制中...";
    }
    getpointposition(index);
  }
}

//
function savafrmae() {
  // log
  log.value = "已保存当前关键帧";
  // 改变当前关键帧
  frmaeindex++;
  const id = frmaeindex + 1;

  // 插入新关键帧
  const newf = {
    id,
    name: "关键帧",
    point: [],
  };

  // 储存上一帧点集合
  // newf.point.join()
  const prepointlist = framelist.value[frmaeindex - 1].point;
  for (const key in prepointlist) {
    // console.log(prepointlist[key]);
    newf.point.push(prepointlist[key]);
  }
  // console.log(framelist.value[frmaeindex-1].point);

  framelist.value.push(newf);

  // 清空绘制板
  // num.value = 1;
  // setTimeout(() => {
  //   num.value = getbasebox();
  // }, 100);

  //
}

// 清空画板
function clearbar() {
  log.value = "已清空画板";
  num.value = 1;
  setTimeout(() => {
    num.value = getbasebox();
  }, 100);
}

// 清空canvas
function clearcanvas() {
  setcanvasize();
}

// 获取坐标点 生成绘制集合
function getpointposition(index) {
  const width = parseInt(window.innerWidth / 2);
  const height = parseInt(window.innerHeight / 2) - 50;

  const rowmax = parseInt(width / 10);

  const point = { x: 0, y: 0 };
  point.x = parseInt(index % rowmax);
  point.y = parseInt(index / rowmax);
  point.color = sessionStorage.getItem("endcolor");

  // framelist.value[0].points.push(point);
  // console.log(framelist.value[frmaeindex].point.push(point));
  framelist.value[frmaeindex].point.push(point);
}

// 生成canvas
// function drawdemo() {
//   const mypixel = document.getElementById("pixel");

//   let tools = mypixel.getContext("2d");
//   tools.fillStyle = "red";

//   console.log(pixelist[renderindex]);
//   if (renderdelay % 5 == 0) {
//     tools.fillRect(
//       pixelist[renderindex].x * 5,
//       pixelist[renderindex].y * 5,
//       5,
//       5
//     );

//     renderdelay++;
//     renderindex++;
//     requestAnimationFrame(drawdemo);
//   } else {
//     renderdelay++;
//     requestAnimationFrame(drawdemo);
//   }
// }

// let drawdemoindex = 0;
// let drawdemoindexdelay = 1;
// 动画生成
function drawdemo() {
  log.value = "渲染关键帧...";

  if (
    drawdemoindex <= framelist.value.length - 1 &&
    drawdemoindexdelay % 20 == 0
  ) {
    clearcanvas();
    drawframe();
    drawdemoindex++;
    requestAnimationFrame(drawdemo);
  } else if (drawdemoindexdelay % 20 == 0) {
    drawdemoindex = 0;

    clearcanvas();
    drawframe();
    requestAnimationFrame(drawdemo);
  } else {
    requestAnimationFrame(drawdemo);
  }

  drawdemoindexdelay++;

  // requestAnimationFrame(drawdemo);
}

/* 像素数据去重 */
function uniqueFunc(arr, uniId) {
  const res = new Map();
  return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1));
}

// 预览
function drawframe() {
  const mypixel = document.getElementById("pixel");
  let tools = mypixel.getContext("2d");
  // console.log(mypixel);

  // tools.fillStyle = "red";

  const list = JSON.parse(JSON.stringify(framelist.value[drawdemoindex].point));
  const endlist = uniqueFunc(list, "sort");
  // const endlist=list
  console.log(list);
  

  // const list = framelist.value[0].point;

  for (const index in endlist) {
    tools.fillStyle = endlist[index].color;

    tools.fillRect(endlist[index].x * 10, endlist[index].y * 10, 10, 10);
  }
}

// 擦除像素点
let removepointsflag = 0;
function removepoints() {
  if (!removepointsflag) {
    log.value = "擦除状态下，可以去除像素点";
    removepointsflag = 1;
  } else {
    log.value = "已退出擦除状态";
    removepointsflag = 0;
  }
}

// onMounted
onMounted(() => {
  /* 跳转到介绍页面 */
function toinfopage(){
  window.open("https://stillwarter.github.io/posts/pixeltool.html") 
}
  // const mypixel = document.getElementById("pixel");
  // let tools = mypixel.getContext("2d");
  // const width = parseInt(window.innerWidth / 2);
  // const height = parseInt(window.innerHeight / 2) - 50;
  // mypixel.width = width;
  // mypixel.height = height;
  // const max = parseInt(width / 5);
  // for (let i = 1; i < max; i++) {
  //   tools.moveTo(0, 5 * i + 0.5);
  //   tools.lineTo(width, 5 * i + 0.5);
  //   tools.moveTo(5 * i + 0.5, 0);
  //   tools.lineTo(5 * i + 0.5, height);
  // }
  // tools.strokeStyle = "white";
  // tools.stroke();
});

// 导出网页的canvas
const gethtml = (title) => {  
  let sccode = setscode(title);
  let html = `<!DOCTYPE html>

  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="author" content="stillwarter">
      <meta name="source" content="用的这位的code做canvas导出" codesrc="https://juejin.cn/post/7101981953213071373">
      <title>your canvas</title>
      <style>
        body{
          width:100vw;
          height: 100vh;
          display:flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
      </style>

      ${sccode}
    </head>

    <canvas id="pixel" width="1000" height="500">

    </canvas>

  </html>`;
  return html;
};

function export2Excel() {
  let code = framelist.value;
  // 生成html字符串
  const html = gethtml(code);
  // 创建一个a标签
  var a = document.createElement("a");
  // 创建一个包含blob对象的url
  var url = window.URL.createObjectURL(
    new Blob([html], {
      type: "",
    })
  );
  a.href = url;
  a.download = "drwatool-v1.0.0-catool.html";
  a.click();
  window.URL.revokeObjectURL(url);
}
</script>

<style lang="less" scoped>
.main {
  width: 100vw;
  height: 100vh;
}

.drawbox {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  width: 50vw;
  height: calc(50vh - 50px);
  margin: 10px;
  border-radius: 10px;
}

.commonpixel {
  width: 10px;
  height: 10px;
  background: #fff;
  border-radius: 0px;
}

.commonpixel:nth-child(even) {
  background: #bebebe;
}

.btn {
  background: #fff;
  margin: 10px;
  padding: 10px;
  display: flex;
  align-content: center;
  border-radius: 10px;
}

#pixel {
  background: #000;
  border-radius: 0px;
  position: relative;
  margin-top: 12px;
}

.tempshow {
  display: flex;
  flex-wrap: wrap;
  .frame {
    background: #fff;
    margin: 10px;
    padding: 10px;
    display: flex;
    align-content: center;
    border-radius: 10px;
  }
}
.log {
  padding-left: 10px;
  color: #999;
  font-size: 14px;
  font-family: "catbite";
}

/* - 二次样式 - */
.st-drawbox {
  display: flex;
  background-color: var(--vp-c-bg);
  justify-content: center;
  align-items: center;
  font-family: "catbite";
  .leftmeun {
    width: 340px;
    height: 100vh;
    background: #fff;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .funcbox {
      width: 100%;
      margin-top: 12px;
      display: flex;
      flex-wrap: wrap;
      margin-left: 12px;
      .item {
        cursor: pointer;
        margin-right: 12px;
      }
      .itemchose {
        color: red;
      }
    }
    .frame {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      margin-top: 12px;
      margin-left: 12px;
      .item {
        cursor: point;
        margin-right: 12px;
        cursor: pointer;
      }
    }
    .addframebtn {
      width: 100%;
      display: flex;
      margin-left: 12px;
      margin-top: 12px;
      p {
        cursor: pointer;
      }
    }
    .render {
      width: 100%;
      display: flex;
      margin-left: 12px;
      margin-top: 12px;
      p {
        cursor: pointer;
      }
    }
  }
  .main {
    width: calc(100vw - 340px);
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    .drwastart {
      padding: 50px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .btn {
        width: 200px;
        margin-bottom: 16px;
        font-size: 18px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 8px;
        box-shadow: 3px 3px 8px 1px rgba(203, 203, 203, 0.39);
        padding: 6px;
        display: flex;
        justify-content: center;
        cursor: pointer;
        transition: all 0.5s linear;
        border: 10px solid;
        border-image: linear-gradient(45deg, #a3dff1, #e22abd) 1;
        clip-path: inset(0px round 10px);
      }
      .btn:hover {
        animation: drwabtn 4s linear infinite;
        width: 240px;
      }
    }
    .drawboxs {
      display: flex;
      flex-wrap: wrap;
      overflow: hidden;
      opacity: 0;
      animation: renderdrawboxs 1.2s linear forwards;
      .pixel {
        width: 10px;
        height: 10px;
        border-radius: 2px;
        border: 1px solid #8b8b8b;
        background: rgba(216, 214, 214, 0.986);
      }
      .pixel:nth-child(2n) {
        background: #fff;
      }
    }
  }

  .chosesize {
    transition: all 0.3s linear;
    transform: scale(0);
    position: fixed;
    z-index: 20;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 8px;
    box-shadow: 3px 3px 8px 1px rgba(203, 203, 203, 0.39);
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    padding: 24px;
    .pixelnum {
      width: 100%;
      display: flex;
      padding: 12px;
      justify-content: space-between;
      p {
        margin-right: 12px;
        cursor: pointer;
      }
      p:last-child {
        margin: 0;
      }
      p:first-child {
        margin-left: 12px;
      }
    }
    .presets {
      padding: 12px;
      display: flex;
      p {
        margin-right: 24px;
        cursor: pointer;
      }
      p:last-child {
        margin: 0;
      }
    }
    .your {
      width: 100%;
      display: flex;
      padding: 12px;
    }
  }

  .previewbox {
    transition: all 0.3s linear;
    transform: scale(0);
    position: fixed;
    z-index: 20;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 8px;
    box-shadow: 3px 3px 8px 1px rgba(203, 203, 203, 0.39);
    transition: all 0.3s linear;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    padding: 24px;
    .btnbox {
      margin-top: 12px;
      display: flex;
      p {
        cursor: pointer;
      }
    }
  }
}

@keyframes drwabtn {
  0% {
    filter: hue-rotate(0deg);
  }
  100% {
    filter: hue-rotate(360deg);
  }
}

.shadow {
  position: relative;
  z-index: 10;
  display: flex;
}

.st-drawbox::after {
  content: "";
  display: block;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
}

input {
  background: rgb(255, 255, 255);
  border-radius: 4px;
  color: #000;
  font-family: "catbite";
  padding: 6px;
}

@keyframes renderdrawboxs {
  to {
    opacity: 1;
  }
}
</style>
