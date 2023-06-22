<template>
  <div class="main">
    <canvas id="canvas" width="800" height="500" />
    <!-- <img style="border-radius: 8px;" src="../../../../posts/img/gril.png" /> -->
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";
import * as pkg from "@orillusion/core";

onMounted(async () => {
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

  class MaterialAnimation extends ComponentBase {
    private material: LitMaterial;

    // 覆写 start 初始化变量
    protected start() {
      let mr = this.object3D.getComponent(MeshRenderer);
      this.material = mr.material;
    }

    onUpdate() {
      // 更新 baseColor
      let delta = Time.time * 0.001;
      this.material.baseColor = new Color(
        Math.sin(delta),
        Math.cos(delta),
        Math.sin(delta)
      );
    }
  }

  class PathAnimation extends ComponentBase {
    onUpdate() {
      this.object3D.x = Math.sin(Time.time * 0.001) * 2;
      this.object3D.y = Math.cos(Time.time * 0.001) * 2;
    }
  }

  let canvas = document.getElementById("canvas");
  Engine3D.setting.render.postProcessing.taa.jitterSeedCount = 4;
  Engine3D.setting.render.postProcessing.taa.blendFactor = 0.1;
  Engine3D.setting.render.postProcessing.taa.sharpFactor = 0.3;
  Engine3D.setting.render.postProcessing.taa.sharpPreBlurFactor = 0.5;
  Engine3D.setting.render.postProcessing.taa.temporalJitterScale = 0.3;

  await Engine3D.init({
    canvasConfig: {
      canvas,
      // backgroundImage:`./img/gril.png`
      // devicePixelRatio:2,
    },

    // beforeRender:()=>{
    //   // console.log('beforerender');
    // },
    // lateRender:()=>{
    //   console.log('endrender');

    // },
    // renderLoop:()=>{
    //   console.log('loop');

    // },
    // engineSetting:{

    // }
  });

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
  component.object3D.addComponent(LightAnimation);
  // console.log(component.object3D);

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
  obj.addComponent(PathAnimation);
  // add object
  scene3D.addChild(obj);
  // create a view with target scene and camera
  let view = new View3D();
  // scene3D.scaleX=1
  // scene3D.scaleY=10
  // scene3D.scaleZ=10
  // scene3D.rotationZ=11
  view.scene = scene3D;
  view.camera = camera;

  // start render
  Engine3D.startRenderView(view);

  let postProcessing = scene3D.addComponent(PostProcessingComponent);
  postProcessing.addPost(TAAPost);
});
</script>
<style lang="less" scoped>
canvas {
  width: 688px;
  height: 400px;
  background: #000;
  border-radius: 8px;
}
</style>
