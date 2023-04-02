<template>
  <div class="main">
    <div class="threeshow"></div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, getCurrentInstance } from "vue";

import * as three from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";
import * as dat from "dat.gui";

// 将webgl渲染的canvas内容添加到dom
onMounted(() => {
  // 第一部分
  // 创建threejs场景
  const scene = new three.Scene();




  // 创建相机(透视相机 75度，视口宽高比例，最近距离0.1，最远距离1000)
  const camera = new three.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );


  // 设置相机位置
  camera.position.set(0, 0, 10);

  // 添加到场景
  scene.add(camera);

  // 添加物体
  // 创建几何体
  const cubegeometry = new three.BoxGeometry(1, 1, 1);

  // 给几何体添加基础网格材质(可以预设材质颜色)
  const cubematerial = new three.MeshBasicMaterial({ color: 0xffff00 });

  // 根据几何体和材质创建物体（网格）
  const cube = new three.Mesh(cubegeometry, cubematerial);

  // 将几何体添加到场景中
  // scene.add(cube);

  // 初始化渲染器
  const renderer = new three.WebGLRenderer({ antialias: true });

  // 设置渲染器大小
  // renderer.setSize(672,400);
  if (window.innerWidth <= 460) {
    renderer.setSize(340, 400);
  } else {
    renderer.setSize(672, 400);
  }

  // 第二部分
  // 创建轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  // 设置控制器阻尼 使效果更真实
  controls.enableDamping = true;

  // 第三部分 添加坐标辅助器
  // 这里显示的坐标 红色代表x轴 绿色代表y轴 蓝色代表z轴
  const axesHelper = new three.AxesHelper(10);
  // scene.add(axesHelper);

  // 第四部分 3D物体移动
  // 修改物体位置
  // cube.position.set(5,0,0);
  // 也可以直接赋值
  cube.position.x = 0;

  // 第五部分 物体缩放与旋转
  // scale就是缩放，3，2，1代表x轴放大3被，2是y轴放大2倍，1是轴缩放到1呗。
  cube.scale.set(1, 1, 1);
  // 和position一样可以使用属性
  cube.scale.x = 2;
  // rotation就是旋转，后续的参数分别是对下x，y，z轴进行旋转，最后一个参数是旋转轴的顺序设置。
  // cube.rotation.set(Math.PI / 4, 0, 0, "xyz");

  // 第六部分 requestAnimationFrame
  // 这个函数自己有一个time参数用于控制渲染的帧率

  // 第七部分 Clock跟踪时间处理动画
  // 设置时钟
  const clock = new three.Clock();

  // 第八部分 Gsap动画库基本使用（使用需要导入包，商用收费）
  // 设置动画，使用gsap的话就不用自己再计算帧率去渲染了，可设置自己的ease运动速率曲线
  let animate1 = gsap.to(cube.position, {
    x: 5,
    duration: 5,
    // 设置重复的次数，无限次循环-1
    repeat: 2,
    // 往返运动
    yoyo: true,
    // 延时启动
    // delay:2,
    onComplete: () => {
      console.log("动画完成");
    },
    onStart: () => {
      console.log("动画开始");
    },
  });
  gsap.to(cube.rotation, { x: 2 * Math.PI, duration: 5 });

  // 第九部分 Gsap控制动画属性与方法
  // window.addEventListener("dblclick", () => {
  //   if (animate1.isActive()) {
  //     animate1.pause();
  //   } else {
  //     animate1.resume();
  //   }
  // });

  // 第十部分 bug 尺寸自适应

  // 第十一部分 全屏设置 使用document.fullscreenElement
  // window.addEventListener("dblclick", () => {
  //   const fullscreenElement = document.fullscreenElement;
  //   if (!fullscreenElement) {
  //     renderer.domElement.requestFullscreen();
  //   } else {
  //     document.exitFullscreen();
  //   }
  // });

  // 第十二部分 图形用户界面GUI
  // const gui = new dat.GUI();
  // gui
  //   .add(cube.position, "x")
  //   .min(0)
  //   .max(10)
  //   .step(0.01)
  //   .name("物体x轴坐标")
  //   .onChange(() => {
  //     console.log("值被修改了");
  //   })
  //   .onFinishChange(() => {
  //     console.log("完全停下来");
  //   });
  // // 修改物体颜色
  // const params = {
  //   color: "#ffff00",
  // };
  // gui
  //   .addColor(params, "color")
  //   .name("物体颜色")
  //   .onChange((value) => {
  //     cube.material.color.set(value);
  //   });
  // // 是否显示cube
  // gui.add(cube, "visible").name("是否显示");

  // 第十三部分 几何顶点
  // 使用BufferGeometry创建集合体
  // const buffergeometry = new three.BufferGeometry();
  // const buffervertices = new Float32Array([
  //   -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
  //   -1.0, -1.0, 1.0,
  // ]);
  // buffergeometry.setAttribute(
  //   "position",
  //   new three.BufferAttribute(buffervertices, 3)
  // );
  // const buffermaterial = new three.MeshBasicMaterial({ color: 0xffff00 });
  // const buffermesh = new three.Mesh(buffergeometry, buffermaterial);
  // scene.add(buffermesh);

  // 第十四部分 生成三角形集群物体
  // let endmesh;
  for (let i = 0; i < 50; i++) {
    const gemo = new three.BufferGeometry();
    const positionArray = new Float32Array(9);
    for (let j = 0; j < 9; j++) {
      positionArray[j] = Math.random() * 4 - 2;
    }
    gemo.setAttribute("position", new three.BufferAttribute(positionArray, 3));
    let color = new three.Color(Math.random(), Math.random(), Math.random());
    // const buffermaterial = new three.MeshBasicMaterial({
    //   color: color,
    //   transparent: true,
    //   opacity: 0.5,
    // });
    const buffermaterial = new three.LineBasicMaterial({
      color,
      linewidth: 2,
      linecap: "butt",
      linejoin: "butt",
    });
    const buffermesh = new three.Mesh(gemo, buffermaterial);
    gsap.to(buffermesh.rotation, {
      y: 2 * Math.PI,
      duration: 3,
      repeat: -1,
      yoyo: true,
    });
    scene.add(buffermesh);
  }

  // 第十五部分 常用网格几何体
  /**
   * 在文档内输入gemo可以看到three给我们的常用几何体
   */

  // 第十六部分 初始材质纹理
  // 在文档内的Materials有所有材质

  // 第十七部分 纹理旋转偏移重复

  // 第十八部分 纹理显示算法与mipmap

  // 第十九部分 透明材质与透明纹理

  // 第二十部分 环境遮挡贴图与强度

  // 第二十一部分 详解PBR物理渲染

  // 第二十二部分 标准网格材质与光照物理效果
  // 灯光
  // 环境光
  const light = new three.AmbientLight(0xfffffff, 0.5);
  scene.add(light);
  // 直线光源
  // const directionLight=new three.DirectionalLight(0xffffff,0.5);
  // directionLight.position.set(10,10,10);
  // directionLight.castShadow=true;
  // scene.add(directionLight);

  // 第二十三部分 置换贴图与顶点细分

  // 使用requestAnimationFrame不断渲染
  function render() {
    // 也可以在渲染时改变我们坐标（第四部分）
    // cube.position.x+=0.01;
    // if (cube.position.x>15) {
    //   cube.position.x=0;
    // }

    // 也可以在渲染时进行旋转或者缩放

    // 获取clock（第七部分）
    // let time = clock.getElapsedTime();
    // let deltaTime = clock.getDelta();
    // console.log("时钟运行的总时长：", time);
    // console.log("两次获取时间的间隔时间：", deltaTime);
    // 这里得到的间隔时间是0，因为oldtimes的值是time减delatime这样的

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);

    // 通过渲染器将场景渲染出来
    // renderer.render(scene, camera);
  }

  render();

  // 监听画面变化，更新渲染画面（第十部分）
  window.addEventListener("resize", () => {
    // 更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight;
    // 更新摄像机的投影矩阵
    camera.updateProjectionMatrix();
    // 更新渲染器
    // renderer.setSize()
    // 设置渲染器的像素比
    renderer.setPixelRatio(window.devicePixelRatio);
  });

  const threeshow = document.querySelector(".threeshow");
  threeshow.appendChild(renderer.domElement);
});
</script>
<style lang="less" scoped>
:deep(canvas) {
  border-radius: 4px;
}
.main {
}
.threeshow {
  border-radius: 10px;
}
</style>
