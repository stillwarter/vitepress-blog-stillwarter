---
title: 像素画生成器
date: 2023-07-30
outline: deep
tags:
  - Stu
  - 探索
  - 荒野
  - tool
  - 半成品
---

# 像素画生成器

之前我做过一个像素动画：（像素初探）https://stillwarter.github.io/posts/pixelDemo.html

当时做的时候，是先在像素的绘图工具上绘图，然后再手动录入坐标数据实现的，非常愚蠢！所以我一直打算做一个像素动画的生成器。

从八月初，断断续续的到国庆前夕，我才勉强完成这个东西，不是说已经完成了，严格意义来讲它是个半成品，不过没有用户与点击量，倒也无所谓。只是在code的过程中，我渐渐失去了将其变得完美的信念，我发现，当我完成它所有函数实现的那一刻，其实我就已经懈怠了；这其实有些恐怖，就像高中时候刷题，看一眼觉得会了，懒得动手去写了。这非常不好，所以我最后还是撑着国庆前两天，用工作时间，勉强做完它。

年后要是有机会，我会完善这个东西，很奇妙，这算是我的第一个能有点用的工具？

若是有任何问题，欢迎在[鱼排](https://fishpi.cn/member/stillwarter)（我发布的贴子里）提出，非常感谢！

工具体验：https://stillwarter.github.io/posts/pixeltoolshow.html
 
## 前言

动画是非常有意思的，等同于音乐和游戏，都是我感兴趣的事物。之前做前端3d渲染的时候，其实就有这样的想法：我能不能用代码，实现一段动画呢？所以我挤出时间去实践。

不过3d渲染是一个很复杂的过程，无论是threejs还是webgpu去做的话，都需要大量的前置知识去铺垫。所以我感觉，先做做简单的2d，可能更友好点。

在实现pxielDemo后，我十分兴奋，因为这意味着直接做一个像素画渲染工具是可行的！

## 1.工具预想

在最开始的预想里，我还做了一些功能的预设文案，比如绘制模式预设，渐变颜色功能，绘制日志功能等等；呵呵，到最后砍掉了大部分，只完成了最基本的：

* 基础的ui界面
* 基础的绘制设置
* 画笔颜色选择
* 基本的绘制功能
* 可以预览与导出
* 还算流程的体验

## 2.工具实现

我并没有做非常详尽的计划，算的上是想到哪儿做哪儿，不过我都是根据我所想的绘制流程去做功能的。

### 2.1 生成绘制画板

想要绘制画面，首先的有一个可以上色的画板。

这里有2个方向可以选择，canvas或者dom，我选择的是后者，因为我canvas用的并不多，不会，用dom会更快，更方便实现，而且实现提取像素等功能，会很方便（我想用canvas可能没那么方便具体到某一个像素点）。

实现方式：

#### 2.1.1 设置画板大小

设置一块未固定大小的flex块元素，在用户设置完绘制板的信息后，生成对应大小的块元素和对应数目的pixel元素，比如预设里的30乘30，就是900个像素点，占据大概300px乘300px的固定空间。

#### 2.1.2 设置画板监听事件

我们需要可以对画板进行上色操作，这里我们刚好可以使用mouse三剑客，mousedown，mouseover，mouseup这三个事件完成画板的上色

```js
/*
* 参数说明：
* setcolorflag 鼠标移动flag
* thepixeldom 鼠标选中的pixeldom元素
* color 当前缓存的色彩值
* getpointpositions 其他功能函数
*/

let setcolorflag = 0;
/* 画笔（点击上色） */
function setcolorforpixel(index) {
  const thepixeldom = pixels.value;
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
```

同理，我们可以设置颜色擦除事件，基本和上述操作一致。

然后，我们就得到一块可以上色的画板了。

### 2.2 颜色选择器

这部分其实直接用已有的颜色选择器插件就行了，比如vue-color的颜色选择器插件（百度一下，具体名字忘了）非常好看且支持渐变色提取。不过我在打包的过程中使用这个插件会报错，所以很烦，自己手动撸了一个简单的，要low一点，将就用了。

这部分有很多可以参考的插件和轮子，就不赘述了。

### 2.3 动画帧功能实现

我们实现动画，要绘制的不是一张画，而是一组画。所以需要有对应的绘制帧功能。

功能实现：

```js
/* 
* 参数说明
* framelist 像素点集合
* framekey 当前关键帧
* savelastframeflag 是否保存上一帧的绘制数据 默认为否
*/

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
```

大概就是这样，可以增加，插入，删除对应关键帧，在点击帧后，可以渲染处对应的像素数据。

至于保留上一帧绘制路径 这个参数，并没有做好，它只是一个辅助，比如你想保留上一帧的绘制路径，就开启它（有时间优先优化这个）。

### 2.4 动画导出

```js
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
```

导出功能的核心就是这个代码，我也是copy的别人的，详情请移步：https://juejin.cn/post/7101981953213071373

## 3.使用介绍

* 点击开始绘制
* 点击30*30（头像）选项
* 绘制你的图像
* 绘制完成后可以点击绘制预览查看绘制结果
* 点击绘制导出可以导出绘制文件（html）

## 4.问题复盘

* 画板的相间颜色实现？

最开始确实有些问题，有些情况下是成列的同色像素，非常不好看，所以为了实现相间色彩，必须实现奇数个像素颜色，然后限定绘制画板的大小。

* 组件通信？

我的颜色选择器是单独写的一个组件，为了方便，我直接使用sessionstorage去存储色彩值。

* 保留上一帧数据

这个没做好，是否保留上一帧的数据，应该判断直接写入下一帧的数据里，而当前是未做处理（这个后面优先处理）。

* proxy代理的解除

代理的话，好像是无法使用forof去迭代的，所以我用json的两个办法将其转换为普通对象数据了。

* 移动端提醒

未做移动端无法使用提醒。


