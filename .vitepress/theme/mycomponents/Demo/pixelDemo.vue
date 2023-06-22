<template>
  <div class="main">
    <div>
      <canvas id="pixel" width="500" height="500"></canvas>

      <!-- <div class='coordinatex'></div>
    <div class='coordinatey'></div> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
// import { useData, withBase } from "vitepress";

import {
  bodypixel,
  cap,
  eyes,
  beardhair,
  upclothing,
  straps,
  shoes,
} from "../pixelmode/marry.js";

const aim = bodypixel;
const capaim = cap;
const beardhairaim = beardhair;
const upclothingaim = upclothing;
const strapsaim = straps;
const shoesaim = shoes;
const eyesaim = eyes;

let a = [];
let capixel = [];
let beardhairpixel = [];
let upclothingpixel = [];
let strapspixel = [];
let shoespixel = [];
let eyespixel = [];

function setsinglepixel() {
  for (const key in aim) {
    const s = aim[key].start[0];
    const l = aim[key].len;
    const end = s + l;

    for (let i = aim[key].start[0]; i <= end; i++) {
      a.push([i, Number(key)]);
      if (aim[key].transparent) {
        const dmax = aim[key].transparent.start[0] + aim[key].transparent.len;
        const dmin = aim[key].transparent.start[0];
        if (i >= dmin && i <= dmax) {
          a.pop();
        }
      }
    }
  }
}

function setcappixel() {
  for (const key in capaim) {
    const s = capaim[key].start[0];
    const l = capaim[key].len;
    const end = s + l;

    for (let i = capaim[key].start[0]; i <= end; i++) {
      capixel.push([i, Number(key)]);
      if (capaim[key].transparent) {
        const dmax =
          capaim[key].transparent.start[0] + capaim[key].transparent.len;
        const dmin = capaim[key].transparent.start[0];
        if (i >= dmin && i <= dmax) {
          capixel.pop();
        }
      }
    }
  }
}

function setbeardhairpixel() {
  for (const key in beardhairaim) {
    for (const item of beardhairaim[key].point) {
      beardhairpixel.push([Number(item), beardhairaim[key].row]);
    }
  }
}

function setupclothingpixel() {
  const tempshift = 7;
  for (const key in upclothingaim) {
    const s = upclothingaim[key].start[0];
    const l = upclothingaim[key].len;
    const end = s + l;

    for (let i = upclothingaim[key].start[0]; i <= end; i++) {
      upclothingpixel.push([i, Number(key) + tempshift]);
      // if (upclothingaim[key].transparent) {
      //   const dmax =
      //     upclothingaim[key].transparent.start[0] +
      //     upclothingaim[key].transparent.len;
      //   const dmin = upclothingaim[key].transparent.start[0];
      //   if (i >= dmin && i <= dmax) {
      //     upclothingpixel.pop();
      //   }
      // }
    }
  }
}

function setstrapspixel() {
  for (const key in strapsaim) {
    for (const item of strapsaim[key].point) {
      strapspixel.push([Number(item), strapsaim[key].row]);
    }
  }
}

function setshoespixel() {
  const tempshift = 14;
  for (const key in shoesaim) {
    const s = shoesaim[key].start[0];
    const l = shoesaim[key].len;
    const end = s + l;

    for (let i = shoesaim[key].start[0]; i <= end; i++) {
      shoespixel.push([i, Number(key) + tempshift]);
      if (shoesaim[key].transparent) {
        const dmax =
          shoesaim[key].transparent.start[0] + shoesaim[key].transparent.len;
        const dmin = shoesaim[key].transparent.start[0];
        if (i >= dmin && i <= dmax) {
          shoespixel.pop();
        }
      }
    }
  }
}

function seteyespixel() {
  for (const key in eyesaim) {
    for (const item of eyesaim[key].point) {
      eyespixel.push([Number(item), eyesaim[key].row]);
    }
  }
}

setsinglepixel();
setcappixel();
setbeardhairpixel();
setupclothingpixel();
setstrapspixel();
setshoespixel();
seteyespixel();



onMounted(() => {
  const mypixel = document.getElementById("pixel");

  let tools = mypixel.getContext("2d");

  // tools.moveTo(100, 100);
  // tools.lineTo(200, 100);

  // tools.moveTo(100, 120.5);
  // tools.lineTo(200, 120.5);

  // tools.moveTo(100.5, 10);
  // tools.lineTo(100.5, 110);

  /*
   这两条线宽度不一样，前者是2像素，后者是1像素。为什么呢？
   实际canvas在划线的时候，是以当前坐标为中心轴，分别向上向下延申去画线。问题是电脑屏幕显示最小单位就是1像素，所以就直接画2像素；
   并且为了看起来是1像素，它还调低了颜色，所以前者线条看起来淡一些。

   解决方式是将坐标设置为.5，因为中轴在像素的中心点，所以显示的就是1像素。

   若绘制水平方向的1像素的线条，就让y左边变为.5,若绘制竖直方向1像素的线条，则让x坐标变为.5
  */

  /*
   当前宽高都是500px,我做一个20*20的格子底，线之间的距离为25px；第一条线起点是（0，25）
   当前宽高都是500px,我做一个50*50的格子底，线之间的距离为10px；第一条线起点是（0，10）
  */
  for (let i = 1; i < 30; i++) {
    tools.moveTo(0, 25 * i + 0.5);
    tools.lineTo(500, 25 * i + 0.5);

    tools.moveTo(25 * i + 0.5, 0);
    tools.lineTo(25 * i + 0.5, 500);
  }

  tools.strokeStyle = "white";

  tools.stroke();

  let i = 0;
  let j = 0;
  let color = "#fbda41";
  let rendercapi = 0;
  let renderbearhairi = 0;
  let renderupclothingi = 0;
  let renderstrapsi = 0;
  let rendershoesi = 0;
  let rendereyesi = 0;

  let renderframerate = 1;
  // function renderbody() {
  //   tools.fillStyle = color;
  //   tools.fillRect(a[i][0] * 25, a[i][1] * 25, 25, 25);
  //   i++;
  //   if (i >= a.length) {
  //     console.log("躯体绘制结束");
  //     return;
  //   } else {
  //     renderbody();
  //   }
  // }

  // renderbody();

  function drawbody() {
    tools.fillStyle = color;

    if (i >= a.length) {
      console.log("躯体绘制结束");
      renderframerate = 0;
      requestAnimationFrame(drawcap);
    } else if (renderframerate % 5 == 0) {
      tools.fillRect(a[i][0] * 25, a[i][1] * 25, 25, 25);
      i++;
      renderframerate++;
      requestAnimationFrame(drawbody);
    } else {
      renderframerate++;
      requestAnimationFrame(drawbody);
    }
  }

  function drawcap() {
    tools.fillStyle = "red";

    if (rendercapi >= beardhairpixel.length) {
      console.log("帽子绘制结束");
      renderframerate = 0;
      requestAnimationFrame(drawbearhair);
    } else if (renderframerate % 5 == 0) {
      tools.fillRect(
        capixel[rendercapi][0] * 25,
        capixel[rendercapi][1] * 25,
        25,
        25
      );
      rendercapi++;
      renderframerate++;
      requestAnimationFrame(drawcap);
    } else {
      renderframerate++;
      requestAnimationFrame(drawcap);
    }
  }
  function drawbearhair() {
    tools.fillStyle = "#5e5314";
    if (renderbearhairi >= beardhairpixel.length) {
      console.log("头发胡须绘制结束");
      renderframerate = 0;
      requestAnimationFrame(drawupclothing);
    } else if (renderframerate % 5 == 0) {
      tools.fillRect(
        beardhairpixel[renderbearhairi][0] * 25,
        beardhairpixel[renderbearhairi][1] * 25,
        25,
        25
      );
      renderbearhairi++;
      renderframerate++;
      requestAnimationFrame(drawbearhair);
    } else {
      renderframerate++;
      requestAnimationFrame(drawbearhair);
    }
  }
  function drawupclothing() {
    tools.fillStyle = "#5e5314";

    if (renderupclothingi >= upclothingpixel.length) {
      console.log("上衣绘制结束");
      renderframerate = 0;
      requestAnimationFrame(drawstraps);
    } else if (renderframerate % 5 == 0) {
      tools.fillRect(
        upclothingpixel[renderupclothingi][0] * 25,
        upclothingpixel[renderupclothingi][1] * 25,
        25,
        25
      );
      renderupclothingi++;
      renderframerate++;
      requestAnimationFrame(drawupclothing);
    } else {
      renderframerate++;
      requestAnimationFrame(drawupclothing);
    }
  }
  function drawstraps() {
    tools.fillStyle = "red";

    if (renderstrapsi >= strapspixel.length) {
      console.log("工装裤绘制结束");
      renderframerate = 0;
      requestAnimationFrame(drawshoes);
    } else if (renderframerate % 5 == 0) {
      tools.fillRect(
        strapspixel[renderstrapsi][0] * 25,
        strapspixel[renderstrapsi][1] * 25,
        25,
        25
      );
      renderstrapsi++;
      renderframerate++;
      requestAnimationFrame(drawstraps);
    } else {
      renderframerate++;
      requestAnimationFrame(drawstraps);
    }
  }
  function drawshoes() {
    tools.fillStyle = "#584717";

    if (rendershoesi >= shoespixel.length) {
      console.log("鞋子绘制结束");
      requestAnimationFrame(draweyes);
      return;
    } else if (renderframerate % 5 == 0) {
      tools.fillRect(
        shoespixel[rendershoesi][0] * 25,
        shoespixel[rendershoesi][1] * 25,
        25,
        25
      );
      rendershoesi++;
      renderframerate++;
      requestAnimationFrame(drawshoes);
    } else {
      renderframerate++;
      requestAnimationFrame(drawshoes);
    }
  }
  function draweyes() {
    tools.fillStyle = "#5dbe8a";

    if (rendereyesi >= eyespixel.length) {
      console.log("画龙点睛！");
      rendereyesi=0
      renderframerate = 0;
      requestAnimationFrame(closeyes);
    } else if (renderframerate % 15 == 0) {
      tools.fillRect(
        eyespixel[rendereyesi][0] * 25,
        eyespixel[rendereyesi][1] * 25,
        25,
        25
      );
      rendereyesi++;
      renderframerate++;
      requestAnimationFrame(draweyes);
    } else {
      renderframerate++;
      requestAnimationFrame(draweyes);
    }
  }

  function closeyes(){
    tools.fillStyle = "#fbda41";
    if (rendereyesi >= eyespixel.length) {
      console.log("画龙点睛！");
      rendereyesi=0
      renderframerate = 0;
      requestAnimationFrame(draweyes);
      return;
    } else if (renderframerate % 15 == 0) {
      tools.fillRect(
        eyespixel[rendereyesi][0] * 25,
        eyespixel[rendereyesi][1] * 25,
        25,
        25
      );
      rendereyesi++;
      renderframerate++;
      requestAnimationFrame(closeyes);
    } else {
      renderframerate++;
      requestAnimationFrame(closeyes);
    }
  }

  requestAnimationFrame(drawbody);
});
</script>

<style lang="less" scoped>
.main {
  width: 100vw;

  #pixel {
    background: #000;
    border-radius: 0px;
    margin-top: 20px;
    margin-left: 20px;
    position: relative;
  }

  .coordinatex {
    width: 500px;
    height: 1px;
    position: absolute;
    top: -20px;
    left: 20px;
    background: #000;
  }

  .coordinatey {
    width: 1px;
    height: 500px;
    position: absolute;
    top: 0px;
    left: 0px;
    background: #000;
  }
}
</style>
