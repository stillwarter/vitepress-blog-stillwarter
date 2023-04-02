<template>
  <div class="main">
    <!-- <div class="words">你好，你可以叫我stillwarter。
  
    </div> -->

    <div class="threeshow"></div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, getCurrentInstance } from "vue";

import * as three from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";
import * as dat from "dat.gui";
import { Water } from "../water/water.js";
import normalMap0 from "/img/home/Water_1_M_Normal.jpg";
import normalMap1 from "/img/home/Water_2_M_Normal.jpg";

onMounted(() => {
  const scene = new three.Scene();
  
  const camera = new three.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );
  camera.position.set(-50, 50, 130);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  scene.add(camera);

  const renderer = new three.WebGLRenderer({
    antialias: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(window.devicePixelRatio);
  });

  function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 20;
  controls.maxDistance = 500;

  // const planeGemoetry=new three.PlaneGeometry(50,50);
  // const planeMaterial=new three.MeshBasicMaterial({
  //   color:0xfffffff,
  // })
  // const plane=new three.Mesh(planeGemoetry,planeMaterial);
  // scene.add(plane);

  let texture = new three.TextureLoader().load("/img/home/sky.jpg");
  const skyGeometry = new three.SphereGeometry(1000, 60, 60);
  const skyMaterial = new three.MeshBasicMaterial({
    map: texture,
  });
  skyGeometry.scale(1, 1, -1);
  const sky = new three.Mesh(skyGeometry, skyMaterial);
  scene.add(sky);

  const video = document.createElement("video");
  video.src = "/img/home/sky.mp4";
  video.loop = true;

  window.addEventListener("click", (e) => {
    // 当鼠标移动的时候播放视频
    //   判断视频是否处于播放状态
    if (video.paused) {
      video.play();
      let texture = new three.VideoTexture(video);
      skyMaterial.map = texture;
      skyMaterial.map.needsUpdate = true;
    }
  });

  // 创建水面
  const waterGeometry = new three.CircleBufferGeometry(800, 64);
  const water = new Water(waterGeometry, {
    textureWidth: 2048,
    textureHeight: 2048,
    color: 0xeeeeff,
    flowDirection: new three.Vector2(10, 1),
    scale: 4,
    normalMap0: new three.TextureLoader().load(
      "/img/home/Water_1_M_Normal.jpg"
    ),
    normalMap1: new three.TextureLoader().load(
      "/img/home/Water_2_M_Normal.jpg"
    ),
  });
  water.position.y = 3;
  // 水面旋转至水平
  water.rotation.x = -Math.PI / 2;
  scene.add(water);

  const threeshow = document.querySelector(".threeshow");
  threeshow.appendChild(renderer.domElement);
  render();
});
</script>

<style lang="less" scoped>
.words {
  position: absolute;
  z-index: 100;
}
.threeshow {
  position: absolute;
  top: -64px;
}
</style>
