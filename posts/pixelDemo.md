---
title: 像素初探
date: 2023-06-12
outline: deep
tags:
  - Stu
  - 探索
  - 荒野
  - 整点没用的
  - 半成品
---

# 整点没用的 -- canvas and pixel

展示一种绘制像素画的方式，简单的使用canvas api + js 就可以实现逐帧动画。我的内容里可能有许多描述错误或不严谨的地方，请见谅，若有错误可以在[鱼排](https://fishpi.cn/member/stillwarter)指出！

## 前言

游戏和动漫确实占据了我大部分的青春，对于我这样不善言辞的社交败类，游戏和动漫是低门槛的娱乐方式。我最早有印象的动画就是宫崎骏的《猫的报恩》，真的当时那个环境下，这样的画质是真的令人印象深刻。所以说长大后更喜欢猫是有原因的；我真的很喜欢美丽的图像，理想来说我应该去画画的，但初中上画画的时候，看着自己的作品，果断放弃了这个念想。

后来上大学看到别人写网页写的好好看，于是加入了这行，自己逐渐尝试构建好看的页面，或许回首望去我会后悔，但对我来说，当下哪有那么多选择呢？

ogay，题外话结束，我慢慢熟悉一些绘图方法后，就产生了自己写动画的想法，并不是使用css或js去操纵dom实现动画，而是实实在在的画图，然后绘制逐帧动画。

## 1.探索阶段

在进行正式的开发之前，我需要考虑canvas+js是否能完成我想要达到的渲染效果，所以我先做了一个简单的渲染demo--

<pixelDemo/>

### 1.1 探索实现方式

作为一个玩浏览器的人来说，最简单的动画进行方式就是将画好帧进行更换，不过由于帧率更新很快，所以一般的图片加载速度是跟不上的，而且我不是搞画画的，完全没有可行性。

有没有一种方便绘制，方便加载，易于更新的手段来进行绘制呢？

有，早年的游戏都是像素游戏，像素画相对好临摹，而且是一个一个大的连续的像素点，这意味着是可以控制建模的；就像3d建模一样，我也可以简单的给像素画的内小元素进行建模，然后绘制。

### 1.2 探索绘图方式

ogay，敲定了研究方向，那么我先想想如何去处理一张像素图？最简单就是手绘，你自己画就行了；有能力的也可以使用canvas去生成像素画（我试着去分析图像，但给的数据量很大，我还是放弃了这种做法，决定先做简单的）。

然后我这里使用的是make8bit那个在线像素画板，你也可以用pixilart那个，我只是喜欢前者更简洁（因为我只需要收集像素点信息）。

### 1.3 探索建模方式

2d图像有建模这个概念嘛？我不是很清楚，只是我要对图像相似的地方进行处理，统一渲染。以马里奥为例，他的帽子可以作为一个部分，我建立这个帽子的点集数据，由于点击是横向数据更连续，所以我这样声明：
```js
const cap = [
  {
    start: [7, 0],
    len: 5,
    transparent: false,
  },
  {
    start: [6, 1],
    len: 8,
    transparent: false,
  },
];
```
cap数组就包含了我需要的信息，每个数据元素都对应该部分从上到下每一行的数据，比如cap的第一个数据元，就是马里奥帽子的第一行点集合，起始点是7，0，该行长度为5，不透明；

对于不连续的点我是这样声明的：
```js
const beardhair = [
  {
    point: [6, 7, 8],
    row: 2,
  },
  {
    point: [5, 8],
    row: 3,
  },
  {
    point: [5, 7, 8, 9],
    row: 4,
  },
  {
    point: [5, 6, 11, 12, 13, 14],
    row: 5,
  },
];
```
（不解释辣，很好懂得）

依次类推，我可以收集所有点的数据。

### 1.4 探索渲染方式

现在我已经有了图，有了像素点信息，我得想办法将它渲染出来。

我是玩浏览器的，并不是专业的绘图手和渲染师，所以我用我的方式来制作。起始最初想到是dom进行渲染，绘制一个个小方块还是挺方便的，也有能力去操纵，但是如果像素点很多呢；（我还是有点想法的，希望这个手段能成为前端绘图的一种方案。）所以决定使用canvas来进行渲染。

不过我canvas玩的很少，就大学稍稍看了一个Anthony Fu的树生成动画，基本没怎么研究过，算是从头开始了。

#### 1.4.1 像素网渲染

为了方便我收集像素点坐标，首先我需要生成网状图，也就是一个一个的透明格子，这个我好去看对应像素点的坐标。

绘制网格也很简单，只需要根据canvas大小和你设定的像素点大小去画线就行。

```js
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
```
有了网格后，我只需要向网格填充像素点就可以了，使用canvas api就可以绘制方块，非常方便。不过在正式填充前，我需要收集像素点信息，按照一定方式去渲染，若是一个一个填充会显得很傻，我可以按行或者按列，将图像分成各个部分，去渲染。



#### 1.4.2 点数据转换

我需要将记录下的点集合转换为方便渲染的数据集合，以马里奥胡子和帽子数据为例：

```js
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

```


#### 1.4.3 坐标点绘制

当所有点信息准备好后，就可以开始绘制了，这里我使用requestanimationframe函数，配合递归的方式进行动画的绘制

```js
function drawbody() {
    tools.fillStyle = color; // 颜色自定义，或者可以事先加入道点集合对象里。

    if (i >= a.length) {
      console.log("躯体绘制结束");
      renderframerate = 0; // 帧率控制
      requestAnimationFrame(drawcap); // 开始绘制帽子
    } else if (renderframerate % 5 == 0) {
      tools.fillRect(a[i][0] * 25, a[i][1] * 25, 25, 25); // 像素点填充
      i++;
      renderframerate++;
      requestAnimationFrame(drawbody);
    } else {
      renderframerate++;
      requestAnimationFrame(drawbody);
    }
  }

 function drawbearhair(){...}
 function drawupclothing(){...}
 ...

 drawbody() // 马里奥绘制 启动！
```
ogay，至此我就得到了一组马里奥生成动画。这意味着我可以通过这种方式根据声明点集合，使用不同的函数去得到点集合坐标，然后递归绘制每一个点，每一幅图画；不仅仅是生成动画，逐帧动画也是可以实现的。


## 2.动画绘制

有了探索阶段打下的基础，我可以尝试去做一组真正的动画。

### 2.1 绘图准备

首先你需要画好一组动画，由于是简单的像素动画，这里我准备了七张画，是一只猫的走路动画（只有脚部分动画）

### 2.2 数据声明

```js
const catoutline = {
  info: {
    name: "catdemo",
    isoutline: true,
    type: "animal",
    length: 32,
    height: 19,
    pointsize: 15,
    innercolor: "#fed9d0",
  },

  catail: {
    name: "catail",
    length: 8,
    height: 8,
    startx: 0,
    starty: 4,
    pointstype: "vertically",
    points: [
      [2, 3, 4, 5],
      [1, 6],
      [1, 6],
      [1, 7],
      [2, 7],
      [3, 8],
      [3, 8],
      [4, 8],
    ],
    join: "catbody",
    outlinecolor: "#835e1d",
    innercolor: "#fed9d0",
  },

  catfoot1: {
    name: "catfoot1",
    length: 19,
    height: 3,
    startx: 8,
    starty: 15,
    pointstype: "horizontally",
    pointsrule: [
      [
        { s: 0, e: 7 },
        { s: 12, e: 16 },
        { s: 16, e: 18 },
      ],
      [
        { s: 0, e: 2 },
        { s: 3, e: 6 },
        { s: 12, e: 15 },
        { s: 15, e: 18 },
      ],
      [
        { s: 0, e: 3 },
        { s: 3, e: 6 },
        { s: 12, e: 15 },
        { s: 15, e: 18 },
      ],
    ],
    points: [
      [0, 7, 8, 9, 10, 11, 12, 16, 18],
      [0, 2, 3, 6, 12, 15, 18],
      [0, 3, 6, 12, 15, 18],
      [1, 2, 4, 5, 13, 14, 16, 17],
    ],
    join: "catbody",
    outlinecolor: "#835e1d",
    innercolor: "#fed9d0",
  },

  catbody: {
    name: "catbody",
    length: 24,
    height: 14,
    startx: 8,
    starty: 2,
    pointstype: "horizontally",
    pointsrule: 0,
    points: [
      [15, 20, 21],
      [15, 22],
      [14, 23],
      [6, 7, 8, 9, 10, 11, 12, 13, 23],
      [2, 3, 4, 5, 23],
      [1, 23],
      [0, 22],
      [0, 21],
      [0, 20],
      [0, 20],
      [0, 20],
      [1, 19],
      [1, 18],
      // [1, 8, 9, 10, 11, 12, 13],
    ],
    join: ["catail", "catfoot", "catear"],
    outlinecolor: "#835e1d",
    innercolor: "#fed9d0",
  },

  ...
}
```

解释一下，由于我临摹的猫像素画带有外轮廓，且有大部分同色点，所以我针对这种图像使用先渲染外轮廓，后填充内色的方式进行渲染，实现手法相对复杂一些，不过我会好好说明的！

#### 2.2.1 数据说明

如catoutline所示，我偷懒没有分开而是写入一个对象内（怎么写都可以，只要你最后得到点集合数据，方便渲染，收集方便，减少心智负担就可以）；info对象是整个数据集合的一个综合说明，实际没有任何作用（只是给我看的，你看这个集合是catdemo，说明猫的，isoutline，外轮廓绘制手法，type动物，这个图像长32个点，高19个点，每个点都是15px，填充颜色为#fed9d0）；

然后就是对给个部分的声明，比如catail；同样的有一些信息说明该对象，比如catail长8，宽8，x轴起始点为0，y轴起始点为4（起始点是很重要的信息，控制图像的位置），绘制方式是vertically，竖直方向绘制，也就是从上到下，从左到右这样绘制。points记录尾部的轮廓线信息，和pointstype对应，所以该数组记录的是y轴上的点位信息，从上到下，从左到右的y轴点位信息。

此外绘制方式是horizontally就说明是水平绘制，从左到右，从上到下记录x轴点集合信息，这里就不过多赘述。

是使用vertically，还是horizontally绘制方法，取决于该部分哪种绘制复杂度更高，理论上统一也可以，只是我当时考虑的时候是，某某部分使用xxx记录方式更方便（不用动脑子）。


#### 2.2.2 数据转换

记录不用动脑的下场是转换的时候吃亏，由于我有两种记录方式，相对的我要写两种不同的转换方式，将记录的点集合转换为对应的坐标点。

因为是外轮廓的原因，只用渲染外轮廓的点的话，就没必要去转换点，所以我直接进行绘图。


#### 2.2.3 前图清除

在绘制下一帧的时候，需要将上一帧的图像给清除，所以先准备好清除函数（清除画布自行百度）。这里我采用重设canvas
元素宽度的方式进行清除。

```js
/* 画布清除 */
function clearcanvas(tools) {
  resizeCanvas(tools.canvas);
  // const { icount, ycount } = setbaseline(tools, 15);
}
```

#### 2.2.3 轮廓绘制

我使用renderpoints来渲染外轮廓。

```js
/* 渲染点阵 */
/**
 * params 
 * @tools canvas context
 * @part catdemo的部分
 * @shift 图像偏移量
*/
function renderpoints(tools, part, shift) {
  const startx = part.startx;
  const starty = part.starty;
  // horizontally模式下，从上往下，从左往右渲染，所以x轴数据就是每个具体值，y轴数据就是数组排序
  if (part.pointstype == "horizontally") {
    for (const key in part.points) {
      for (const thepoint of part.points[key]) {
        const nowx = startx + thepoint + shift.shifty;
        const nowy = starty + Number(key) + shift.shiftx;

        tools.fillStyle = catoutline.catbody.outlinecolor;
        if (part.partcolor) {
          tools.fillStyle = part.partcolor;
        }
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
  }else ...
}
```
这里展示一部分渲染函数，renderpoints的核心思想就是遍历声明好的点集合，记录当前的点集合对应的坐标nowx,nowy，计算好偏移量和该部分对应的初始坐标，就可以完成对该轮廓点的绘制。

addinnercolorpart的思想就是，对于纵向部分的轮廓来说，只需要考虑其中间的空余点，去掉点集合中的最大和最小，就是需要渲染填充的部分，对于连续的轮廓，只需要剔除就可以。



#### 2.2.4 动画循环

```js
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
  // 脚部动画
  renderpoints(tools, catoutline["catfoot" + frame], shift);

  renderpoints(tools, catoutline.catear, shift);
  // 尾部抖动
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


  // 帧率检测，根据不同设备帧率做出不同延迟
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
```
drawfcat是一个递归函数，其参数都是一些必要的信息，tools是canvas上下文，catouline就是数据集，frame记录当前帧，renderindex是帧计数器，用于实现渲染延迟，不让动画跑的太快。shiftx，shifty是偏移量。

后续的renderpoints渲染每个身体部分，所有身体渲染玩就是对应的图，也就是我最开始绘制的像素画。

至此，我们得到一只走动的猫猫动画，可以在首页查看。



## 3.总结

这期有花去一个月时间，断断续续的完了编码，其实实现的东西很少很简单，任何一款动画软件都比我这个要好得多，可能只是为了实现我做画的一个执念吧。

这个手法是很笨拙的方式，就像小孩子手工做的纸玩具，所以这个系列是“整点没用的”；记录点集合的效率低下，绘图也是比较难的，这个真没有优化方法。

所以要拓展的话，需要从像素画的生产角度入手，在画好时就可以导出不同类型的数据，这样就快的多辣，不过我还没有这个思路去做这个，像素画生产工具，emmm我似乎还没达到这个能力去做...

其实这个动画本身还存在问题，比如偏移时候的绘制会出现奇怪的竖线，看着非常不舒服，而且我一时间也没想到如何处理...

不过还是很有意义的，这是我作为一名菜鸟独立探索code荒野的方式，就像开荒的勇士一样，探索未知的地域，令我担忧的是我还能有多少这样的日子可以给我去探索...



## 附录

引用链接和资料查询：

- <a style="cursor: pointer;" href="https://juejin.cn/post/6995372234688692232"> canvas如何绘制像素风 </a>

- <a style="cursor: pointer;" href="https://make8bitart.com/"> make8bitart像素在线画板 </a>

