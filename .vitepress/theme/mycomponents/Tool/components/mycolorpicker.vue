<template>
  <div class="mycolorpicker">
    <div
      class="maincolorbox"
      @mousedown="getcolor('down', $event)"
      @mousemove="getcolor('move', $event)"
      @mouseup="getcolor('up', $event)"
      @mouseleave="getcolor('leave', $event)"
    >
      <div class="showcolorbox"></div>
      <div class="blackcolorbox"></div>
      <div class="chosepoint"></div>
    </div>

    <div
      class="colorline"
      @mousedown="getheight('down', $event)"
      @mousemove="getheight('move', $event)"
      @mouseup="getheight('up', $event)"
      @mouseleave="getheight('leave', $event)"
    >
      <div class="linepicker"></div>
    </div>

    <div class="numshow">
      {{ endcolor }}
    </div>

    <div class="endcolor"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
let chosecolor = ref("rgba(255,0,0,1)");
let endcolor=ref("rgba(255,0,0,1)")
// let endcolor = ref("");
let linepickerflag = 0;

// 颜色初始化
sessionStorage.setItem("endcolor", "rgba(255,0,0,1)");

function getheight(state, e) {
  const dom = document.querySelector(".colorline");
  if (state == "down") {
    linepickerflag = 1;
    return;
  }
  if (linepickerflag && state == "move") {
    const position = parseInt(dom.getBoundingClientRect().top);
    console.log();
    if (e.clientY - position >= 180) {
      setcolorline(180);
      return;
    } else {
      setcolorline(e.clientY - position);
      return;
    }

    return;
  }
  if (state == "up") {
    linepickerflag = 0;
    return;
  }
  if (state == "leave") {
    linepickerflag = 0;
    return;
  }
}
function setcolorline(y) {
  const dom = document.querySelector(".linepicker");
  // console.log(dom.offsetTop);
  dom.style = `top:${y}px`;

  setmaincolor(y);
}

/* 色域设置 */
let standrgb;
function setmaincolor(y) {
  const count = parseInt(y / 30);
  const colornum = y % 30;

  const dom = document.querySelector(".maincolorbox");
  let rgba_r = 255;
  let rgba_g = 0;
  let rgba_b = 0;
  let rgba_a = 1;

  if (count == 0) {
    rgba_r = 255;
    rgba_g = 0;
    rgba_b = parseInt(255 / 30) * colornum;
    standrgb = "b";
  }
  if (count == 1) {
    rgba_r = 255 - parseInt(255 / 30) * colornum;
    rgba_g = 0;
    rgba_b = 255;
    standrgb = "r";
  }
  if (count == 2) {
    rgba_r = 0;
    rgba_g = parseInt(255 / 30) * colornum;
    rgba_b = 255;
    standrgb = "g";
  }
  if (count == 3) {
    rgba_r = 0;
    rgba_g = 255;
    rgba_b = 255 - parseInt(255 / 30) * colornum;
    standrgb = "b";
  }
  if (count == 4) {
    rgba_r = parseInt(255 / 30) * colornum;
    rgba_g = 255;
    rgba_b = 0;
    standrgb = "r";
  }
  if (count == 5) {
    rgba_r = 255;
    rgba_g = 255 - parseInt(255 / 30) * colornum;
    rgba_b = 0;
    standrgb = "g";
  }

  const rgba = `rgba(${rgba_r},${rgba_g},${rgba_b},1)`;
  chosecolor.value = rgba;
  dom.style = `background:${rgba}`;
}

/* 获取坐标并得到颜色值 */
let getcolorflag = 0;
function getcolor(state, e) {
  const dom = document.querySelector(".maincolorbox");

  if (state == "down") {
    getcolorflag = 1;
    setpoint(e.offsetX, e.offsetY);
    return;
  }
  if (state == "move" && getcolorflag) {
    // 使用settimeout阻止异常渲染的出现
    setTimeout(() => {
      setpoint(e.offsetX, e.offsetY);
    }, 40);
    return;
  }
  if (state == "up" && getcolorflag) {
    // setpoint(e.offsetX, e.offsetY);
    getcolorflag = 0;
    return;
  }
  if (state == "leave") {
    linepickerflag = 0;
    return;
  }
}

/* 设置选择点位置 */
function setpoint(x, y) {
  const dom = document.querySelector(".chosepoint");
  dom.style = `left:${x}px;top:${y}px; opacity: 1;`;
  setTimeout(() => {
    countcolor(x, y);
  }, 10);
}

/* 根据坐标计算颜色值 */
function countcolor(x, y) {
  // console.log(x, y, chosecolor.value.split(","));
  const value = [...chosecolor.value];
  
  const index = [];
  for (const i in value) {
    if (value[i] == "(") {
      const e = parseInt(i) + 1;
      index.push(e);
    }
    if (value[i] == ")") {
      const e = parseInt(i) - 1;
      index.push(e);
    }
  }
  // console.log(index);
  const rgba = [...chosecolor.value]
    .slice(index[0], index[1])
    .join("")
    .split(",");
  // console.log([...chosecolor.value].slice(0, 1).tostring());

  // console.log(rgbr.split(','));
  // let deviationx=280-x;
  // let deviationy=180-y

  // console.log(deviationx,deviationy);
  // return;

  /*
    而当前得到的rgba是终点值
    颜色计算的起点是0，0；传入值x，y值都会改变颜色
    当x值越大，需要增加standrgb值
    当y值越大，越接近黑色，需要增加减少所有值

    对于x变量而言，越大是越接近终点值
  */
  let unitxprice_r = ((255 - rgba[0]) / 280).toFixed(3);
  let unitxprice_g = ((255 - rgba[1]) / 280).toFixed(3);
  let unitxprice_b = ((255 - rgba[2]) / 280).toFixed(3);

  let unityprice_r = (255 / 180).toFixed(3);
  let unityprice_g = (255 / 180).toFixed(3);
  let unityprice_b = (255 / 180).toFixed(3);

  // console.log(unitxprice_r, unitxprice_g, unitxprice_b);

  let end_r = 255 - Math.round(x * unitxprice_r + y * unityprice_r);

  let end_g = 255 - Math.round(x * unitxprice_g + y * unityprice_g);

  let end_b = 255 - Math.round(x * unitxprice_b + y * unityprice_b);
  // console.log(end_g < 0);

  end_r < 0 ? (end_r = 0) : end_r;
  end_g < 0 ? (end_g = 0) : end_g;
  end_b < 0 ? (end_b = 0) : end_b;

  end_r > 255 ? (end_r = 255) : end_r;
  end_g > 255 ? (end_g = 255) : end_g;
  end_b > 255 ? (end_b = 255) : end_b;

  // const end_r = 255 - unitxprice_r * x;

  const end_rgba = `rgba(${end_r},${end_g},${end_b},1)`;
  // console.log(end_rgba);
  // chosecolor.value=end_rgba;

  endcolor.value = end_rgba;
  sessionStorage.setItem("endcolor", end_rgba);

  const domendcolor = document.querySelector(".endcolor");
  domendcolor.style = `background:${end_rgba}`;

  return;
}
</script>

<style lang="less" scoped>
.mycolorpicker {
  display: flex;
  flex-wrap: wrap;
  width: 300px;
  padding: 6px;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-sizing: content-box;
  position: relative;
  align-items: baseline;
  .maincolorbox {
    width: 280px;
    height: 180px;
    position: relative;
    background: rgb(255, 0, 0);
    margin-right: 8px;
    cursor: pointer;
    .showcolorbox {
      position: absolute;
      width: 280px;
      height: 180px;
      background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0));
    }
    .blackcolorbox {
      position: absolute;
      width: 280px;
      height: 180px;
      background: linear-gradient(to top, #000, rgba(0, 0, 0, 0));
    }
    .chosepoint {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      border: 1px solid black;
      position: absolute;
      top: -2px;
      left: -2px;
    }
  }

  .colorline {
    width: 12px;
    height: 180px;
    position: relative;
    background: -webkit-linear-gradient(
      top,
      rgb(255, 0, 0) 0%,
      rgb(255, 0, 255) 17%,
      rgb(0, 0, 255) 34%,
      rgb(0, 255, 255) 50%,
      rgb(0, 255, 0) 67%,
      rgb(255, 255, 0) 84%,
      rgb(255, 0, 0) 100%
    );
    .linepicker {
      position: absolute;
      cursor: pointer;
      box-sizing: border-box;
      left: 0;
      top: 0px;
      width: 100%;
      height: 4px;
      border-radius: 1px;
      background: #fff;
      border: 1px solid #f0f0f0;
      -webkit-box-shadow: 0 0 2px rgb(0 0 0 / 60%);
      box-shadow: 0 0 2px rgb(0 0 0 / 60%);
      z-index: 1;
    }
  }

  .numshow {
    height: 24px;
    line-height: 24px;
    border-radius: 5px;
    background-color: #fff;
    background-image: none;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    outline: none;
    padding: 0 15px;
    border: 1px solid #dcdfe6;
    margin-top: 10px;
    font-size: 12px;
    color: #000;
  }
  .endcolor {
    width: 14px;
    height: 14px;
    background: #000;
    margin-left: 10px;
    border-radius: 3px;
  }
}
</style>
