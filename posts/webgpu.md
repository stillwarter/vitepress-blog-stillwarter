---
title: webgpuDemo
outline: deep
date: 2023-06-04
tags:
  - WebGPU
  - Stu
  - 荒野
  - 半成品
---

# webgpu 初探

展示一个原生的webgpu渲染demo，和一个使用orillusion的渲染demo，然后做了一点简单的介绍，并未涉及系统的图形学知识，严格来说这篇介绍只是一个半成品，后续有机会进行补充和完善。

我的内容里可能有许多描述错误或不严谨的地方，请见谅，若有错误可以在[鱼排](https://fishpi.cn/member/stillwarter)指出！

源码会在后续完善后进行更新。

## 前言

2023年4月下旬，碰巧看到了webgpu可以在google浏览器金丝雀版上使用。刚好正准备看看webgl3d渲染相关的文档，反正都不会，就直接看webgpu了。主要是想了解一些浏览器是如何进行3d渲染的，当然有关3d渲染还是十分复杂的，若是没有良好的图形学知识进行支撑，那就当图一乐了。

这仅仅是一个开始，希望在后面能有所收获。

## webgpu示例

这是使用原生的webgpu的demo：

<basictriangle />

## orillusion示例

这是使用orillusion框架的demo：

<webgpudemo/>

## 实现

### 0.和webgpu有关的小历史

一些前置信息，不感兴趣可以直接看下面。

##### 0.1 webgl的发展史

在叙述webgpu之前先看看现在浏览器3d渲染的老大哥webgl。webgl1.0标准发布在2011年，它其实是opengl es2.0在web上的一个实现，而opengl es2.0其实只是opengl2.0在移动端的一个具体实现，而opengl2.0标准是在2004年发布的。

所以webgl1.0实际上使用的是04年的一套东西，而webgl2.0同样对标的是2009年发布的opengl3.2，所以可以说，现在浏览器上的有关3d渲染的方式都采用的是近10年前的标准。

所以在某些方面，webgl无法满足现代gpu架构以及高性能的计算渲染需求。

在2015前后，苹果，微软和khronos分别推出了基于全新gpu架构的metal，d3d12和vulkan，这三个可以称为是现代图形学api。

截至2022年3月，google依靠自家的开源项目dawn早早利用C++完成了webgpu适配。火狐成立gfx-rs项目，在nightly build完成了webgpu支持，苹果safari在etchnology preview这个版本完成支持。而edge以及一系列国产浏览器大概率是准备白嫖google的dawn...

在我写完这篇文章的时候，也就是23年6月4日，在此之前，google浏览器以及完成了webgpu的上线，后续edge也完成了webgpu的上线。但在移动端，safari浏览器并没有webgpu的支持，可能移动端会晚一些上线罢。

##### 0.2 gpu渲染流程

在叙述webgpu之前，看看gpu本身是如何渲染的罢。

图形绘制管线分为三个阶段：应用程序阶段，几何阶段，光栅阶段。

###### 0.2.1 管线

什么是管线呢？

pu中的管线指的是执行管道流水线，简称为管线。

管线这个说法并不是只存在于gpu的，管线对于cpu的关系就类似于汽车组装线与汽车之间的关心。cpu管线并不是物理意义上提供数据输入输出的管路或通道，它是为了执行指令而归纳出的下一步需要做的事情。

gpu架构和cpu有极大不同，因为两者适用于不同的场合。想象一下，gpu面对3d游戏中成千上万的三角面，若仅仅是逐一单个处理计算，损失的效率是及其惊人的。

回到正题，类比汽车工业的发展，在1913年前福特开发出汽车流水线之前，汽车组装只能让一位位工人逐工序完成，年产不过12台，效率极低。在引入流水线概念之后，每位工人只需要不停的做一道工序，所有工序并行进行，效率可提高八倍。

gpu对图像处理的高效率体现了同样的思路，gpu采用数量众的计算单元和超长额流水线，但每一个部分只有非常简单的控制逻辑（如同摩登时代中一个流水线工人只负责拧一个螺丝）。尽管计算能力不如cpu，但耐不住人多力量大。好比一千道十以内加减法同时给一百个小学生和一个大学生来做，尽管小学生能力小，但这么多小学生同时做耗时肯定是比一个大学生来的快。

###### 0.2.2 管线与渲染

gpu渲染一个图形所的过程就像工厂的流水线一样，所以我的理解是gpu渲染流程等同于一些文章里的管线渲染流程（若有错误请指出，目前我并没有系统的学习过计算机图形学的知识）。

所以在正式进行图形绘制之前，应该有一个初始化的阶段，管线的初始化，cpu会告诉gpu，哥们，这个事儿你帮帮忙；cpu如同进货卡车一样不断将处理的数据丢给gpu，gpu工厂调用计算单元对数据进行简单的计算处理，而在管线的最后会组装出产品--图形。

###### 0.2.3 应用程序阶段 

这是由cpu主要的负责阶段，这个阶段开发者开源控制。cpu将决定传递给gpu什么样的数据（比如渲染目标场景中的灯光，场景的模型，摄像机的位置）有时候还会对这些数据进行处理，并告诉gpu这些数据的渲染状态（纹理材质等）。


###### 0.2.4 几何阶段

这个阶段主要由gpu进行主导，主要进行顶点变换和光照计算，其实它主要的工作就是获取三维模型的顶点坐标，按照某种方式将其投影到2d屏幕上。

顶点变化分为以下几个阶段：

模型坐标---世界坐标---视点坐标---投影（裁剪）坐标

需要注意的是：

- 从object space coordinate到world space coordinate的变换过程由一个四阶矩阵控制，通常称为world matrix。

- 光照计算通常在world coordinate space中进行，这也符合逻辑。当然也可以在eye coordinate space中得到相同的光照效果。

- 从eye space 到 project and clip space需要将视锥之外和视锥之内的顶点进行裁剪。

- 将视锥中的顶点变换到2d屏幕空间称为投影，裁剪就在这个空间中进行。

将顶点处理好后，gpu会进行图元装配（也就是原始的坐标连接关系），还原出网格结构，再将这这些顶点连接为一个个三角形，这样我们就会得到一堆透明的面片。

###### 0.2.5 光栅化阶段

这一阶段将决定哪些像素被几何图元覆盖的过程。所谓像素就是显示器的一个个像素点，几何图元就是我们之前生成的面片。

因为3d渲染是有一条z轴的，配合摄像机来达到3d渲染的效果，若没有摄像机，在平视角度下，我们看到的还是一张2d图形。


##### 0.3 浏览器渲染

我们知道了gpu的一个渲染流程，那么浏览器又是如何将获取的html字节流转换为2d或3d的图形图像呢？

todo... 还没想好怎么叙述。

### 1.简单使用webgpu

在支持webgpu的浏览器上，直接进行code就行，不需要进行第三方库的准备。

有关代码细节问题请查看webgpu文档。

##### 1.1 webgpu初始化

由于许多浏览器是不支持webgpu的，所以在初始化的时候我们需要进行一些判断处理

```ts
/* 1.初始化adapter和device */
async function initwebgpu(canvas: HTMLCanvasElement) {
  // 判断浏览器是否支持gpu
  if (!navigator.gpu) {
    throw new Error(
      "你的浏览器不支持webgpu捏，请使用谷歌或edga浏览器的最新版本"
    );
  }

  // 生成adapter抽象代理
  const adapter = await navigator.gpu.requestAdapter({
    powerPreference: "high-performance",
  });

  if (!adapter) {
    throw new Error("没有找到webgpu adapter代理捏");
  }

  // 通过adapter请求逻辑实例device
  const device = await adapter.requestDevice();

  // 为canvas获取webgpu的上线问context
  const context = canvas.getContext("webgpu") as GPUCanvasContext;

  // 获取支持的颜色格式
  const format = navigator.gpu.getPreferredCanvasFormat
    ? navigator.gpu.getPreferredCanvasFormat()
    : context.getPreferredFormat(adapter);

  // 高刷支持（不懂）
  const devicePixelRatio = window.devicePixelRatio || 1;

  // canvas设置
  canvas.width = canvas.clientWidth * devicePixelRatio;
  canvas.height = canvas.clientHeight * devicePixelRatio;
  const size = { width: canvas.width, height: canvas.height };

  // 对context上下文进行配置
  context.configure({
    device,
    format,
    alphaMode: "opaque",
  });
  return { device, context, format, size };
}
```

##### 1.2 创建管线

```ts
/* 2.创建简单的渲染管线 */
async function initpipeline(
  device: GPUDevice,
  format: GPUTextureFormat
): Promise<GPURenderPipeline> {
  // descriptor是创建管线所必要的参数
  const descriptor: GPURenderPipelineDescriptor = {
    // 新版本增加成员，必要（不然会报错，先不管）
    layout: "auto",
    // 描述管线的顶点着色器，或者说是顶点shader？
    vertex: {
      module: device.createShaderModule({
        code: triangleVert,
      }),
      // shader的入口？
      entryPoint: "main",
    },
    // 描述与管线相关的原始属性（渲染是如何进行原始组装和光栅化的）
    primitive: {
      // topology: "triangle-list",
      topology: "line-strip",
      topology: "triangle-strip",

    },
    // 描述管线的着色器入口及其输出颜色
    fragment: {
      module: device.createShaderModule({
        code: redFrag,
      }),
      entryPoint: "main",
      targets: [{ format }],
    },
  };

  return await device.createRenderPipelineAsync(descriptor);
}
```

##### 1.3 录制渲染通道

```ts
async function draw(
  device: GPUDevice,
  context: GPUCanvasContext,
  pipeline: GPURenderPipeline
) {
  // 获取命令encoder
  const commandEncoder = device.createCommandEncoder();
  // 获取可以被gpu操作的view buffer
  const view = context.getCurrentTexture().createView();
  // 设置渲染通道参数
  const renderPassDescriptor: GPURenderPassDescriptor = {
    // 设置颜色附件
    colorAttachments: [
      {
        view,
        clearValue: { r: 0, g: 0, b: 0, a: 1.0 },
        loadOp: "clear",
        storeOp: "store",
      },
    ],
  };
  // 设置renderpass
  const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
  // 使用命令对pipeline进行加载
  passEncoder.setPipeline(pipeline);
  passEncoder.draw(4);
  passEncoder.end();
  // 提交命令
  device.queue.submit([commandEncoder.finish()]);
}
```

##### 1.4 绑定到canvas

```ts
 async function run() {
    const canvas = document.getElementById("cv");

    if (!canvas) throw new Error("没有画布元素");

    const { device, context, format } = await initwebgpu(canvas);
    const pipeline = await initpipeline(device, format);

    draw(device, context, pipeline);

  }
  run();
```

##### 1.5 顶点插槽和资源绑定

还记得之前提到过的gpu渲染流程吗，在webgpu的实现里的第二步，我们创建了管线，第三步里我们为管线设置了着色器和图形入口等，最后将渲染操纵录入管线中。

这个部分比较复杂，后续又机会再叙述，使用顶点插槽和资源绑定可以使用js配合shader来动态更改数据。

### 2.简单使用orillusion框架

##### 2.0 导入orilusion第三方包

```ts
import * as pkg from "@orillusion/core";
const {
    Engine3D,
    Scene3D,
    AtmosphericComponent,
    Object3D,
    Camera3D,
    HoverCameraController,
    DirectLight,
    MeshRenderer,
    BoxGeometry,
    LitMaterial,
    View3D,
    ComponentBase,
    Color,
    Time,
    PostProcessingComponent,
    TAAPost
  } = pkg;
```

##### 2.1 初始化3d引擎

```ts
await Engine3D.init({
    canvasConfig: {
      canvas,
      // backgroundImage:`./img/gril.png`
      // devicePixelRatio:2,
    },
  });
```

##### 2.2 设置场景以及往场景增加子组件

```ts
let scene3D: Scene3D = new Scene3D();
  // add an Atmospheric sky enviroment
  let sky = scene3D.addComponent(AtmosphericComponent);
  
  // sky.sunY = 0.66
  // sky.fov=1
  // sky.name='stusky'

  // console.log(sky);

  // create camera
  let cameraObj: Object3D = new Object3D();

  let camera = cameraObj.addComponent(Camera3D);

  // adjust camera view
  camera.perspective(60, Engine3D.aspect, 1, 5000.0);
  // set camera controller
  let controller = cameraObj.addComponent(HoverCameraController);
  controller.setCamera(0, 0, 15);
  // add camera node

  scene3D.addChild(cameraObj);

  camera.viewPort.width = 566;

  // create light
  let light: Object3D = new Object3D();

  // add direct light component
  let component: DirectLight = light.addComponent(DirectLight);

  // adjust lighting
  light.rotationX = 45;
  light.rotationY = 30;
  component.lightColor = new Color(1.0, 0, 0, 1);
  component.intensity = 10;
  //  给灯光增加变换脚本
  component.object3D.addComponent(LightAnimation);

  // add light object
  scene3D.addChild(light);
  // create new object
  const obj: Object3D = new Object3D();
  // add MeshRenderer
  let mr: MeshRenderer = obj.addComponent(MeshRenderer);
  // set geometry
  mr.geometry = new BoxGeometry(5, 5, 5);
  // set material
  mr.material = new LitMaterial();
  // set rotation
  obj.rotationY = 115;
  // 给实体对象增加坐标移动脚本
  obj.addComponent(PathAnimation);
  // add object
  scene3D.addChild(obj);
```

##### 2.3 进行渲染

```ts
 let view = new View3D();
  // scene3D.scaleX=1
  // scene3D.scaleY=10
  // scene3D.scaleZ=10
  // scene3D.rotationZ=11
  view.scene = scene3D;
  view.camera = camera;

  // start render
  Engine3D.startRenderView(view);
```

##### 2.4 设置灯光，坐标变换类

```ts
class LightAnimation extends ComponentBase {
    private light: DirectLight;
    private color: Color;

    protected start() {
      this.light = this.object3D.getComponent(DirectLight);
      console.log(this);

      this.color = this.light.lightColor;
    }

    onUpdate() {
      // this.color.r = Math.pow(Math.sin(Time.time + 1), 10);
      // this.color.r=20
      this.color.r += 0.0001;
      this.color.g += 0.0003;
      this.color.b += 0.0002;
      // this.color.g = Math.pow(Math.sin(Time.time + 0.003), 10);
      this.light.lightColor = this.color;
    }
  }
class PathAnimation extends ComponentBase {
    onUpdate() {
      this.object3D.x = Math.sin(Time.time * 0.001) * 2;
      this.object3D.y = Math.cos(Time.time * 0.001) * 2;
    }
  }
```

##### 2.5 设置TAAPost抗锯齿处理

```ts
ngine3D.setting.render.postProcessing.taa.jitterSeedCount = 4;
  Engine3D.setting.render.postProcessing.taa.blendFactor = 0.1;
  Engine3D.setting.render.postProcessing.taa.sharpFactor = 0.3;
  Engine3D.setting.render.postProcessing.taa.sharpPreBlurFactor = 0.5;
  Engine3D.setting.render.postProcessing.taa.temporalJitterScale = 0.3;

   let postProcessing = scene3D.addComponent(PostProcessingComponent);
  postProcessing.addPost(TAAPost);
```


## 附录

引用链接和资料查询:

- <a style="cursor: pointer;" href="https://zhuanlan.zhihu.com/p/137780634"> 卷毛狒狒看的渲染管线 </a>

- <a style="cursor: pointer;" href="https://zhuanlan.zhihu.com/p/135308055"> GPU渲染过程 </a>

- <a style="cursor: pointer;" href="https://blog.csdn.net/hikaliv/article/details/4258715"> 浅谈cpu执行管道流水线 </a>

- <a style="cursor: pointer;" href="https://www.bilibili.com/video/BV1uu411B7uq/?spm_id_from=333.788&vd_source=6e8d0cd78fe3eb2103b38abe81966907"> webgpu零基础入门 </a>（
注意，这个视频教程和目前webgpu的文档有出入，部分代码已经不适用，请以官方github示例为准。）

- <a style="cursor: pointer;" href="https://github.com/Orillusion/orillusion-webgpu-samples"> orillusion的webgpu示例 </a>

- <a style="cursor: pointer;" href="https://www.orillusion.com/guide/"> orillusion的入门教程 </a>




