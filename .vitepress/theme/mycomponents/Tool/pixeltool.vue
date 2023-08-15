<template>
  <div class="main">
    <div class="drawbox">
      <div
        class="commonpixel"
        v-for="(item, index) in num"
        @mousedown="renderpixel(index)"
        @mouseover="mouseover(index)"
        @mouseup="mouseup(index)"
      ></div>
    </div>

    <button class="btn" @click="drawdemo">save</button>
    <div class="tempshow">
      <div class="frame" v-for="(item,index) in framelist">
          11
      </div>
    </div>

    <canvas id="pixel" width="500" height="500"></canvas>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, getCurrentInstance } from "vue";

let num = ref(1);

let mouseflag = ref(0);
let framelist=ref([{}])
let statedraw=ref(1)
let statesave=ref(2)

const pixelist = [];
let renderindex = 0;
let renderdelay = 1;

num.value = getbasebox();

// 根据当前视口情况生成绘图板
// row col 分别对应行和列
function getbasebox() {
  const width = parseInt(window.innerWidth / 2);
  const height = parseInt(window.innerHeight / 2) - 50;

  const row = parseInt(width / 5);
  const col = parseInt(height / 5);
  console.log(row, col);

  return row * col;
}

//
function renderpixel(index) {
  const dom = document.querySelectorAll(".commonpixel")[index];
  console.log(dom);
  dom.style = "background:red";
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
    dom.style = "background:red";
    getpointposition(index);
    console.log(dom);
  }
}

// 获取坐标点 生成绘制集合
function getpointposition(index) {
  const width = parseInt(window.innerWidth / 2);
  const height = parseInt(window.innerHeight / 2) - 50;

  const rowmax = parseInt(width / 5);

  const point = { x: 0, y: 0 };
  point.x = parseInt(index % rowmax);
  point.y = parseInt(index / rowmax);

  pixelist.push(point);
  console.log(pixelist);
}

// 生成canvas
function drawdemo() {
  const mypixel = document.getElementById("pixel");

  let tools = mypixel.getContext("2d");
  tools.fillStyle = "red";

  console.log(pixelist[renderindex]);
  if (renderdelay % 5 == 0) {
    tools.fillRect(
      pixelist[renderindex].x * 5,
      pixelist[renderindex].y * 5,
      5,
      5
    );

    renderdelay++;
    renderindex++;
    requestAnimationFrame(drawdemo);
  } else {
    renderdelay++;
    requestAnimationFrame(drawdemo);
  }
}

// onMounted
onMounted(() => {
  const mypixel = document.getElementById("pixel");

  let tools = mypixel.getContext("2d");

  const width = parseInt(window.innerWidth / 2);
  const height = parseInt(window.innerHeight / 2) - 50;
  mypixel.width = width;
  mypixel.height = height;

  const max = parseInt(width / 5);

  // for (let i = 1; i < max; i++) {
  //   tools.moveTo(0, 5 * i + 0.5);
  //   tools.lineTo(width, 5 * i + 0.5);

  //   tools.moveTo(5 * i + 0.5, 0);
  //   tools.lineTo(5 * i + 0.5, height);
  // }

  // tools.strokeStyle = "white";

  // tools.stroke();
});
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
  width: 5px;
  height: 5px;
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
  margin-top: 10px;
  margin-left: 10px;
  position: relative;
  border-radius: 10px;
}

.tempshow {
  display: flex;
  .frame {
    background: #fff;
    margin: 10px;
    padding: 10px;
    display: flex;
    align-content: center;
    border-radius: 10px;
  }
}
</style>
