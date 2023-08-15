<template>
  <div class="home">
    <!-- <img src="../../../posts/img/catdemo.png" /> -->
    <!-- <img class="hometopimg" src="../../../posts/img/homeimg/2.webp" />
    <div ></div> -->

    <div class="mainbox">
      <div class="words">
        <img class="img" src="/public/catear.gif" />
        <p>stillwarter 摸鱼达人 & 搬砖菜鸟 & 逐光者 & 弃梦人。</p>
      </div>

      <div class="canvasbox">
        <div class="contain">
          <div class="poop">{{ thewords }}</div>
          <canvas id="pixelcanvas" width="400" height="400"></canvas>
        </div>
      </div>

      <div class="books">
        书架筹备中...
      </div>

      <div class="box"></div>
    </div>

    <p class="temp1">计划筹建组件库... 收集函数中... 还需要学习很多捏...</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, getCurrentInstance } from "vue";

import { catoutline } from "../mycomponents/pixelmode/cat.js";
import { nonsense } from "./data/nonsense.js";

let thewords = ref("你好，这里是stillwarter的博客");
let i = ref(0);
let fps = 0;
let catrenderdelay = 0;
// thewords = nonsense[i.value];
// console.log(thewords);

setInterval(() => {
  const index = Number(i.value);
  thewords.value = nonsense[index];
  i.value++;

  if (i.value >= nonsense.length) {
    i.value = 0;
  }
}, 20000);

var then = Date.now();
var count = 0;

// 帧率检测
function nextFrame() {
  requestAnimationFrame(function () {
    count++;
    if (count % 20 === 0) {
      var time = (Date.now() - then) / count;
      var ms = Math.round(time * 1000) / 1000;
      fps = Math.round(100000 / ms) / 100;
      // console.log(`count: ${count}\t${ms}ms/frame\t${fps}fps`);
    }
    nextFrame();
  });
}
nextFrame();

if (fps.value > 60) {
  catrenderdelay = 20;
} else {
  catrenderdelay = 5;
}

function resizeCanvas(dom) {
  // dom.width = window.innerWidth;

  // 配合首页动画 取消响应样式
  dom.width = 750;
}

function setbaseline(tools, aimlen) {
  // 画底线需要根据当前canvas宽度和需求的宽高
  const canvaswidth = window.innerWidth;

  const icount = parseInt(window.innerWidth / aimlen);
  const ycount = parseInt(400 / aimlen);

  // 绘制纵坐标 （对应横着的线）
  for (let i = 1; i < ycount; i++) {
    tools.moveTo(0, aimlen * i + 0.5);
    tools.lineTo(canvaswidth, aimlen * i + 0.5);
  }

  // 绘制横坐标  （对应竖着的线）
  for (let i = 1; i < icount; i++) {
    tools.moveTo(aimlen * i + 0.5, 0);
    tools.lineTo(aimlen * i + 0.5, canvaswidth);
  }
  tools.strokeStyle = "white";

  tools.stroke();

  return { icount, ycount };
}

// 绘制catdemo

function drawfcat(
  tools,
  catoutline,
  frame,
  renderindex,
  shiftx = 3,
  shifty = 0
) {
  const shift = { shiftx, shifty };

  clearcanvas(tools);
  if (frame == 8) {
    frame = 1;
  }
  renderpoints(tools, catoutline.catbody, shift);
  renderpoints(tools, catoutline["catfoot" + frame], shift);

  renderpoints(tools, catoutline.catear, shift);
  if (frame % 2 == 0) {
    renderpoints(tools, catoutline.catail, shift);
  } else {
    renderpoints(tools, catoutline.catail2, shift);
  }
  if (shifty <= 50) {
    renderpoints(tools, catoutline.cateyes, shift);
  } else {
    renderpoints(tools, catoutline.cateyes2, shift);
  }
  renderpoints(tools, catoutline.catface, shift);
  renderindex++;
  // if (shifty < 130) {
  //   shifty += 0.5;
  // } else {
  //   shifty = -40;
  // }

  // aaa()

  let delay = 0;
  if (fps > 160) {
    delay = 20;
  } else if (fps > 120) {
    delay = 15;
  } else if (fps > 90) {
    delay = 10;
  } else {
    delay = 5;
  }

  if (renderindex % delay == 0) {
    frame++;
    requestAnimationFrame(function () {
      drawfcat(tools, catoutline, frame, renderindex, shiftx, shifty);
    });
  } else {
    requestAnimationFrame(function () {
      drawfcat(tools, catoutline, frame, renderindex, shiftx, shifty);
    });
  }
}

/* 渲染点阵 */

function renderpoints(tools, part, shift) {
  const startx = part.startx;
  const starty = part.starty;
  // horizontally模式下，从上往下，从左往右渲染，所以x轴数据就是每个具体值，y轴数据就是数组排序
  if (part.pointstype == "horizontally") {
    for (const key in part.points) {
      for (const thepoint of part.points[key]) {
        const nowx = startx + thepoint + shift.shifty;
        const nowy = starty + Number(key) + shift.shiftx;

        // console.log({nowx,nowy});

        tools.fillStyle = catoutline.catbody.outlinecolor;
        if (part.partcolor) {
          tools.fillStyle = part.partcolor;
        }
        tools.fillRect(nowx * 15, nowy * 15, 15, 15);
      }
    }
  }

  // vertically模式下，从左往右，从上往下渲染，所以y轴数据就是每个具体值，x轴数据就是数组排序
  if (part.pointstype == "vertically") {
    for (const key in part.points) {
      for (const thepoint of part.points[key]) {
        const nowy = starty + thepoint + shift.shiftx;
        const nowx = startx + Number(key) + shift.shifty;

        // console.log({nowx,nowy});

        tools.fillStyle = catoutline.catbody.outlinecolor;
        tools.fillRect(nowx * 15, nowy * 15, 15, 15);
      }
    }
  }

  addinnercolorpart(tools, part, shift);
}

/* 增加内色 */
function addinnercolorpart(tools, part, shift) {
  if (part.pointstype == "vertically") {
    for (const key in part.points) {
      const len = part.points[key].length;
      const themin = Math.min(...part.points[key]);
      const themax = Math.max(...part.points[key]);
      const slen = themax - themin + 1;
      if (slen == len) {
        continue;
      } else {
        addcolor(tools, part.points[key], shift, slen, key);
      }
    }
  } else if (part.pointstype == "horizontally" && !part.pointsrule) {
    for (const key in part.points) {
      const len = part.points[key].length;
      const themin = Math.min(...part.points[key]);
      const themax = Math.max(...part.points[key]);
      const slen = themax - themin + 1;
      if (slen == len) {
        return;
      } else {
        addcolortwo(tools, part.points[key], shift, slen, key);
      }
    }
  } else {
    if (part.pointsrule) {
      for (const i in part.pointsrule) {
        if (part.pointsrule[i]) {
          addcolorthree(tools, part.pointsrule[i], shift, i);
        }
      }
    }
  }

  function addcolor(tools, item, shift, slen, key) {
    // console.log(item, slen);
    const aimarr = [];
    const startx = part.startx;
    const starty = part.starty;
    for (let i = 0; i < slen; i++) {
      aimarr.push(i + item[0]);
    }
    // console.log(aimarr);

    let newArray = aimarr.filter(function (i) {
      return item.indexOf(i) == -1;
    });

    for (const item of newArray) {
      tools.fillStyle = catoutline.catbody.innercolor;
      const nowy = starty + item + shift.shiftx;
      const nowx = startx + Number(key) + shift.shifty;
      tools.fillRect(nowx * 15, nowy * 15, 15, 15);
    }
  }

  function addcolortwo(tools, item, shift, slen, key) {
    const aimarr = [];
    const startx = part.startx;
    const starty = part.starty;
    for (let i = 0; i < slen; i++) {
      aimarr.push(i + item[0]);
    }
    let newArray = aimarr.filter(function (i) {
      return item.indexOf(i) == -1;
    });
    for (const item of newArray) {
      tools.fillStyle = catoutline.catbody.innercolor;
      const nowx = startx + item + shift.shifty;
      const nowy = starty + Number(key) + shift.shiftx;
      tools.fillRect(nowx * 15, nowy * 15, 15, 15);
    }
  }

  function addcolorthree(tools, pointsrule, shift, key) {
    for (const i of pointsrule) {
      for (let s = i.s + 1; s < i.e; s++) {
        const nowx = s + shift.shifty + part.startx;
        const nowy = Number(key) + shift.shiftx + part.starty;
        tools.fillStyle = catoutline.catbody.innercolor;
        tools.fillRect(nowx * 15, nowy * 15, 15, 15);
      }
    }
  }
}

/* 画布清除 */
function clearcanvas(tools) {
  resizeCanvas(tools.canvas);
  // const { icount, ycount } = setbaseline(tools, 15);
}

onMounted(() => {
  const pixelcanvas = document.getElementById("pixelcanvas");

  const tools = pixelcanvas.getContext("2d");

  resizeCanvas(pixelcanvas);

  // const { icount, ycount } = setbaseline(tools, 15);

  // drawfcat(tools, catoutline);

  requestAnimationFrame(function () {
    drawfcat(tools, catoutline, 1, 1);
  });
});
</script>

<style lang="less" scoped>
.home {
  display: flex;
  width: 100vw;
  min-height: 100vh;
  flex-direction: column;
  align-items: center;
  position: relative;

  .hometopimg {
    width: 50%;
    object-fit: cover;
  }

  .mainbox {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    position: relative;
    .words {
      width: 100%;
      font-size: 18px;
      font-family: "catbite";
      display: flex;
      margin: 20px 0;
      position: relative;
      justify-content: center;
      align-items: center;
      p {
        width: 1350px;
      }
      .img {
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }
    }
    .canvasbox {
      width: 750px;
      height: 445px;
      background: url(../../../posts/img/homeimg/2.webp);
      background-size: contain;
      justify-content: center;
      background-repeat: no-repeat;
      position: relative;
      display: flex;
      border-radius: 12px;

      overflow: hidden;
      .contain {
        width: 100%;
        position: relative;
        animation: catmove 20s ease-in-out infinite;
        .poop {
          padding: 0 20px;
          height: 30px;
          position: absolute;
          top: 330px;
          left: 55px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #fff;
          font-family: "catbite";
          opacity: 0;
          animation: words 20s ease-in-out infinite;
        }

        .poop::after {
          content: "";
          width: 0;
          height: 0;
          border: 10px solid;
          position: absolute;
          bottom: -22px;
          left: 20px;
          border-color: rgba(255, 255, 255, 0.2) transparent transparent;
        }
        #pixelcanvas {
          background: rgba(0, 0, 0, 0);
          transform: scale(0.2);
          position: relative;
          left: -300px;
          top: 210px;
        }
      }
    }

    .books {
      width: 500px;
      height: 445px;
      background: rgba(255, 255, 255, 0.5);
      margin-left: 120px;
      border-radius: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: "catbite";
      margin-bottom: 40px;
    }

    .box {
      width: 1370px;
      height: 400px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 12px;
      margin-bottom: 40px;
    }
  }

  @keyframes catmove {
    0% {
      left: -150px;
    }
    100% {
      left: 800px;
    }
  }

  @keyframes words {
    20% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    80% {
      opacity: 0.5;
    }
  }
}

.temp {
  font-size: 16px;
  font-family: "catbite";
  margin-top: 100px;
}

.temp1 {
  font-size: 16px;
  font-family: "catbite";
}

@media screen and (min-width: 1024px) and (max-width: 1440px) {
  .home {
    .mainbox {
      .canvasbox {
        width: 550px;
        height: 326px;
        .contain {
          .poop {
            top: 220px;
          }
          #pixelcanvas {
            background: rgba(0, 0, 0, 0);
            transform: scale(0.2);
            position: relative;
            left: -300px;
            top: 100px;
          }
        }
      }
      .books {
        width: 402px;
        height: 326px;
        margin-left: 60px;
      }
      .words {
        p {
          width: 980px;
        }
      }
    }
  }
}

@media screen and (min-width: 750px) and (max-width: 1024px) {
  .home {
    .mainbox {
      .canvasbox {
        width: 400px;
        height: 237px;

        .contain {
          .poop {
            top: 170px;
            left: 45px;
            transform: scale(0.5);
          }
          #pixelcanvas {
            background: rgba(0, 0, 0, 0);
            transform: scale(0.1);
            position: relative;
            left: -260px;
            top: 20px;
          }
        }
      }
      .books {
        width: 293px;
        height: 237px;
        margin-left: 30px;
      }
      .words {
        p {
          width: 670px;
        }
      }
    }
  }
}

@media screen and (min-width: 280px) and (max-width: 750px) {
  .home {
    min-height: 100vh;
    .mainbox {
      .canvasbox {
        width: 90%;
        height: calc(100vw * 0.9 / (750 / 445));
        .contain {
          .poop {
            top: 140px;
            left: 55px;
            transform: scale(0.5);
          }
          #pixelcanvas {
            background: rgba(0, 0, 0, 0);
            transform: scale(0.1);
            position: relative;
            left: -260px;
            top: -10px;
          }
        }
      }
      .books {
        width: 90%;
        height: calc(100vw * 0.9 / (750 / 445));
        margin-top: 30px;
        margin-left: 0;
      }
      .words {
        p {
          width: 320px;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
