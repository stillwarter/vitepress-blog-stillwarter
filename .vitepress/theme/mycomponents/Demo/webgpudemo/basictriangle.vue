<template>
  <canvas id="cv"></canvas>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";

import triangleVert from "../shaders/triangle.vert.wgsl?raw";
import redFrag from "../shaders/red.frag.wgsl?raw";

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
      // topology: "line-strip",
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

/* 3.录制渲染通道 */
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

onMounted(() => {
  async function run() {
    const canvas = document.getElementById("cv");

    if (!canvas) throw new Error("没有画布元素");

    const { device, context, format } = await initwebgpu(canvas);
    const pipeline = await initpipeline(device, format);

    draw(device, context, pipeline);

    // re-configure context on resize
    // window.addEventListener("resize", () => {
    //   canvas.width = canvas.clientWidth * devicePixelRatio;
    //   canvas.height = canvas.clientHeight * devicePixelRatio;
    //   // don't need to recall context.configure() after v104
    //   draw(device, context, pipeline);
    //   console.log(canvas.width);
      
    // });
  }
  run();
});
</script>

<style scoped>
canvas {
  width: 688px;
  height: 400px;
  background: #000;
  border-radius: 8px;
}
</style>
