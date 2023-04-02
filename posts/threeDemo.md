---
title: three.js Demo
outline: deep
tags:
  - three.js
  - Stu
  - Demo
---

# 一个简单 threejs Demo

## 示例

<threeDemo />

<a style="cursor: pointer;" href="">sir，this way</a>

## 实现

### 0.环境准备

```js
import { onMounted } from "vue";

import * as three from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";
```

这是我们需要提前导入的模块，onMounted 用于解决 vite 编译时出现的 window 未定义报错（我渲染的动画需要放在 onMounted 周期内）。

需要提前导入 three 和 OrbitControls（轨道控制器）。

为了方便控制动画的渲染导入 gasp，这个包商用是收费的嗷。

### 1.创建 threejs 场景

threejs 的场景只有 1 种，用 THREE.Scene 来表示。场景是用于保存画布上所有元素信息的容器，比如可以保存对象，光源，物体等信息。

```js
const scene = new three.Scene();
```

Scene 有一些方法和属性来控制场景内的元素的显示。

由于 threejs 中的大部分类都继承自基类 Object3D，属性和方法都比较多，所以这里我们就不再依次介绍每个类的属性和方法，有兴趣可以自己看官网的示例

### 2.创建相机

场景创建完成之后，我们需要使用一种投影模式来渲染我们的图形，为了追求真实性，我们使用模拟人眼的 PerspectiveCamera 来创建相机，它是 3D 场景的渲染中使用得最普遍得投影模式。

threejs 的相机有一个抽象基类 Camera，而我们在构建新相机时，应该始终继承此类。意思是这个类不用于实例化哦，而是在我们创建一个新的相机类的时候应该继承它。

```js
const camera = new three.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
```

构造的参数分别是：摄像机锥体垂直视野角度（最小值 0，最大值 180，默认 50，一般用的是 45，睁眼的角度接近 45），摄像机锥体长宽比（默认为 1，实际项目使用的是屏幕的宽高比），摄像机锥体近端面和远端面（默认是 0.1 和 2000，实际项目的近端值一般是 1）。

这样说可能比较抽象，那么请发挥你的想象，将透视摄像机想象为一个眼睛，角度就是我们视角的角度范围，摄像头的比例就是我们视角的比例，摄像机的近端和远端就是我们视角的距离范围。

实际上我们看到的物体还和摄像机的三维坐标位置有关，在物体超出我们视角或者不在视角内时，可能会出现黑屏的问题。

```js
camera.position.set(0, 0, 10);
scene.add(camera);
```

在设置完成 camera 后需要调整位置（默认是原点也就是 0，0，0），调整完后将相机加入场景中。

### 3.添加物体

demo 里的物体时三角形群，实际上是使用循环一个个渲染出来的。

```js
for (let i = 0; i < 50; i++) {
  const gemo = new three.BufferGeometry();
  const positionArray = new Float32Array(9);
  for (let j = 0; j < 9; j++) {
    positionArray[j] = Math.random() * 4 - 2;
  }
  gemo.setAttribute("position", new three.BufferAttribute(positionArray, 3));
  let color = new three.Color(Math.random(), Math.random(), Math.random());

  const buffermaterial = new three.LineBasicMaterial({
    color,
    linewidth: 1,
    linecap: "round",
    linejoin: "round",
  });

  const buffermesh = new three.Mesh(gemo, buffermaterial);

  gasp.to(buffermesh.rotation, {
    y: 2 * Math.PI,
    duration: 3,
    repeat: -1,
    yoyo: true,
  });

  scene.add(buffermesh);
}
```

#### 3.1 BufferGeometry

这里在循环内，实例化 BufferGeometry，BufferGeometry 是面，线或者几何体的描述。包括顶点位置，面索引，法向量等属性。使用这个类可以有效减小向 GPU 传输上述数据所需要的开销。官方文档有详细的栗子，有兴趣可以看一看。

#### 3.2 BufferGeometry

这个类用于存储与 BufferGeometry 相关联的 attribute（比如顶点位置向量，面索引，颜色值等）。

若构造一个 BufferGeometry 实例，必须要传入两个变量---一个数组，一个 itemSize。

```js
new three.BufferAttribute(positionArray, 3);
```

这里 positionArray 存储的就是坐标信息，渲染器会根据这些坐标去渲染图形；参数 3 指的是数组内每三个元素构成一个坐标点。

#### 3.3 LineBasicMaterial

LineBasicMaterial，基础线条材质，一种用于绘制线框样式几何体的材质。该类继承自 Material。

Material，材质的抽象基类。材质描述对象的外观，它们的定义方式与渲染器无关，换句话说不同的渲染器在材质上的表现大体是相同的。

```js
const buffermaterial = new three.LineBasicMaterial({
  color,
  linewidth: 1,
  linecap: "round",
  linejoin: "round",
});
```

在实例化 buffermaterial（物体材质）时，我们传入了四个参数，color 是指线的颜色，linewidth 指的是线的宽度，linecap 是指顶点间的线段端点如何显示（默认是 round），linejoin 是线的连接处如何显示（默认是 round）。不过后两者在 webGLrenderer 里的效果不是很好，即使修改这两个属性或许也无法很好的看到不一样的地方。

#### 3.4 Mesh

Mesh，网格，表示基于以三角形为多边形网格的物体的类。

```js
new three.Mesh(gemo, buffermaterial);
```

我们使用 Mesh 类来实例化我们的图案，这里的 gemo 就是我们事先准备好的 bufferGeometry 的实例，后者是我们实现的材质的实例。

#### 3.5 gsap

gsap，一个动画库，主要是方便我们实现动画效果。

```js
gsap.to(buffermesh.rotation, {
  y: 2 * Math.PI,
  duration: 3,
  repeat: -1,
  yoyo: true,
});
```

这段代码主要就是告诉 gsap 该如何对 buffermesh，也就是我们实例化的图案，进行旋转的动画操作。buffermesh.rotation 就是图案的旋转属性，而后续的配置将告诉 gsap 如何对 buffermesh 进行旋转操作。

y 属性代表对图形绕 y 轴进行旋转，旋转 180 度，duration 表示动画持续时间，repeat 表示重复次数，-1 代表东动画循环，yoyo 表示每隔一个重复，将有一个反向的补间动画。

### 4.初始化渲染器

在准备好后我们就可以着手初步的渲染了，虽然我们往场景里增加了相机和物体，但实际上我们还需要渲染器将其渲染出现。

threejs 里内置了不少的渲染类，我们这里使用 WebGLRenderer，有关 WebGL 相关的内容，我会在后续更新。

```js
const renderer = new three.WebGLRenderer({ antialias: true });
```

这里我在实例化的时候提供了 antialias 这个参数，意思是抗锯齿（默认是 false），为了是让渲染出的图形更好看，当然会增加渲染的负担。

### 5.增加轨道控制器

虽然我得到了渲染出来的图像，但我无法控制视角，也就是说我们想通过鼠标来拖动视角移动的话，需要创建轨道控制器来实现。

OrbitControls，轨道控制器，可以使相机围绕目标进行轨道运动。使用这个功能必须提前导入。

```js
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
```

实例化轨道控制器必须得传入 camrea 参数，也就是说这个类必须知道你想要对哪个相机实现轨道控制。第二个参数非必须，默认值就是 body，整个窗口都会被轨道控制器监听，若你想缩小控制范围，可以将具体得渲染类对应得节点作为参数传入。

为了得到更真实得操作体验，可以将 enableDamping 这个属性改为 true（默认为 false），还有更多得属性和方法，请移步官网。

### 6.使用 requestAnimationFrame 配和渲染器进行渲染

在 requestAnimationFrame 之前，是使用 setTimeout 来做简单得动画帧渲染的，reuqestAnimationFrame 的作用就是替代 setTimeout 做更高性能的动画和解决定时器动画间隔不稳定的问题。

这里自定义一个 render 函数来做整合。

```js
function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
```

在我们调用这个 render 函数时，requestAnimationFrame 会根据显示器的刷新率来递归调用 render 函数，这样我们就能得到正在不断渲染的图形动画，而不是一张静态的照片。

### 7.绑定节点

在我们做好一切前置工作后，需要将渲染器绑定到 dom 节点上。

```js
const threeshow = document.querySelector(".threeshow");
threeshow.appendChild(renderer.domElement);
```

## 其他

除此之外，其实还有很多属性方法没有说到。three 是一个庞大的三维框架，想要真正用好还有很多功课需要做，或许在真正深入之前还需要了解图形化知识，webgl 和浏览器渲染模式等内容。
