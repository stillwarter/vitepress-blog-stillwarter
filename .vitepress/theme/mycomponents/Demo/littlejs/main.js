import {
  debug,
  lerp,
  paused,
  min,
  canvasFixedSize,
  canvasMaxSize,
  vec2,
  frameRate,
  showWatermark,
} from "./var";
import { Color } from "./util";
let mainCanvas, mainContext, overlayCanvas, overlayContext, glCanvas, glContext;

let time = 0;

let timeReal = 0;

let engineObjects = [];
let engineObjectsCollide = [];

let frame = 0;

let glEnable = 1;

// render回调
let skySeed, skyColor, horizonColor;
let randSeed = 1;
skySeed = 10;

// horizonColor = skyColor;
// let size = randSeeded(6, 1);
function gameRender() {
  drawSky();
  drawStars();
}

/**
 * littlejs无法直接经过vitepress的打包，所以我用这种方式（重写）来解决这个问题
 */

function myengineInit() {
  // html和主canvas初始化
  sethtmlbody();
  // gl初始化
  glInit();
  // overly初始化
  setoverly();
  // 所有canvas元素样式设置
  setcanvasfull();

  // drawStars()
  //// 引擎更新（心脏跳动）

  // fps内部变量声明
  let frameTimeLastMS = 0,
    frameTimeBufferMS,
    averageFPS;
  engineUpdate();

  /**
   * 引擎更新（必须放到内部不让无法访问到fps内部变量
   * myenginUpdate
   */
  function engineUpdate(frameTimeMS = 0) {
    // fps处理
    let frameTimeDeltaMS = frameTimeMS - frameTimeLastMS;
    frameTimeLastMS = frameTimeMS;
    if (debug || showWatermark)
      averageFPS = lerp(0.05, averageFPS, 1e3 / (frameTimeDeltaMS || 1));
    timeReal += frameTimeDeltaMS / 1e3;
    frameTimeBufferMS += !paused * frameTimeDeltaMS;
    frameTimeBufferMS = min(frameTimeBufferMS, 50);

    // canvas size处理
    if (canvasFixedSize.x) {
      // clear canvas and set fixed size
      mainCanvas.width = canvasFixedSize.x;
      mainCanvas.height = canvasFixedSize.y;

      // fit to window by adding space on top or bottom if necessary
      const aspect = innerWidth / innerHeight;
      const fixedAspect = mainCanvas.width / mainCanvas.height;
      (
        glCanvas || mainCanvas
      ).style.width = mainCanvas.style.width = overlayCanvas.style.width =
        aspect < fixedAspect ? "100%" : "";
      (
        glCanvas || mainCanvas
      ).style.height = mainCanvas.style.height = overlayCanvas.style.height =
        aspect < fixedAspect ? "" : "100%";
    } else {
      // clear canvas and set size to same as window
      mainCanvas.width = min(innerWidth, canvasMaxSize.x);
      mainCanvas.height = min(innerHeight, canvasMaxSize.y);
    }
    // clear overlay canvas and set size
    overlayCanvas.width = mainCanvas.width;
    overlayCanvas.height = mainCanvas.height;
    // save canvas size
    // mainCanvasSize = vec2(mainCanvas.width, mainCanvas.height);

    /**
     * 回调之一 gamerender
     */
    gameRender();

    // 更新渲染对象
    engineObjectsUpdate();

    if (showWatermark) {
      // update fps
      overlayContext.textAlign = "right";
      overlayContext.textBaseline = "top";
      overlayContext.font = "1em monospace";
      overlayContext.fillStyle = "#000";
      const text =
        "test" +
        " " +
        "v" +
        "0.0.1" +
        " / " +
        0 +
        " / " +
        "by stiillwarter" +
        " / " +
        averageFPS.toFixed(1) +
        (glEnable ? " GL" : " 2D");
      overlayContext.fillText(text, mainCanvas.width - 3, 3);
      overlayContext.fillStyle = "#fff";
      overlayContext.fillText(text, mainCanvas.width - 2, 2);
      // drawCount = 0;
    }

    requestAnimationFrame(engineUpdate);
  }
}

/**
 * html初始化,给主canvas操作对象赋值
 */
function sethtmlbody() {
  const stylebody =
    "margin:0;overflow:hidden;background:#000" + // fill the window
    ";touch-action:none" + // prevent mobile pinch to resize
    ";user-select:none" + // prevent mobile hold to select
    ";-webkit-user-select:none"; // compatibility for ios

  document.body.style = stylebody;
  document.body.appendChild((mainCanvas = document.createElement("canvas")));
  mainContext = mainCanvas.getContext("2d");
}

/**
 * 设置覆盖层（用于显示信息？）
 */
function setoverly() {
  // create overlay canvas for hud to appear above gl canvas
  document.body.appendChild((overlayCanvas = document.createElement("canvas")));
  overlayContext = overlayCanvas.getContext("2d");
}

/**
 * 设置canvas样式已经覆盖尺寸
 */
function setcanvasfull() {
  // set canvas style to fill the window
  const styleCanvas =
    "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)";
  (
    glCanvas || mainCanvas
  ).style = mainCanvas.style = overlayCanvas.style = styleCanvas;
}

/**
 * 渲染对象更新
 */
function engineObjectsUpdate() {
  // get list of solid objects for physics optimzation
  engineObjectsCollide = engineObjects.filter((o) => o.collideSolidObjects);

  // recursive object update
  const updateObject = (o) => {
    if (!o.destroyed) {
      o.update();
      for (const child of o.children) updateObject(child);
    }
  };
  for (const o of engineObjects) o.parent || updateObject(o);

  // remove destroyed objects
  engineObjects = engineObjects.filter((o) => !o.destroyed);

  // increment frame and update time
  time = ++frame / frameRate;
}

/******************************************************************************
 * game部分
 */
let hcolor = { r: 0.1, g: 0.2, b: 0.1, a: 1 };
horizonColor = new Color(hcolor.r, hcolor.g, hcolor.b);
let scolor = { r: 0.1, g: 0.1, b: 0.2, a: 1 };
skyColor = new Color(0.1, 0.1, 0.2);
let t = 0;
let addflag = 1;
let reflag = 0;
function drawSky() {
  // fill background with a gradient
  const gradient = (mainContext.fillStyle = mainContext.createLinearGradient(
    0,
    0,
    0,
    mainCanvas.height
  ));
  gradient.addColorStop(0, skyColor);
  gradient.addColorStop(1, horizonColor);
  mainContext.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
  // console.log(hcolor);
  // console.log(1);
  if (addflag) {
    t += 0.0001;
  }
  if (t >= 0.8) {
    addflag = 0;
    reflag = 1;
  }
  if (reflag) {
    t -= 0.0001;
  }
  if (t <= 0.1) {
    addflag = 1;
    reflag = 0;
  }

  skyColor = new Color(0.1, 0.1, t);
}

function drawStars() {
  // draw stars and planets
  randSeed = skySeed;
  const largeStarCount = 9;
  for (let i = 1e3; i--; ) {
    let size = randSeeded(6, 1);
    let speed = randSeeded() < 0.9 ? randSeeded(5) : randSeeded(99, 9);
    // let speed = 0;
    let color = new Color().setHSLA(
      randSeeded(0.2, -0.3),
      randSeeded() ** 9,
      randSeeded(1, 0.5),
      randSeeded(0.9, 0.3)
    );
    if (i < largeStarCount) {
      // large planets and suns
      size = randSeeded() ** 3 * 99 + 9;
      speed = randSeeded(5);
      // speed = 0;
      color = new Color()
        .setHSLA(randSeeded(), randSeeded(), randSeeded(1, 0.5))
        .add(skyColor.scale(0.5))
        .clamp();
    }

    const extraSpace = 200;
    const w = mainCanvas.width + 2 * extraSpace,
      h = mainCanvas.height + 2 * extraSpace;
    const screenPos = vec2(
      ((randSeeded(w) + time * speed) % w) - extraSpace,
      ((randSeeded(h) + time * speed * randSeeded()) % h) - extraSpace
    );

    mainContext.fillStyle = color;
    if (size < 9) mainContext.fillRect(screenPos.x, screenPos.y, size, size);
    else {
      mainContext.beginPath(
        mainContext.fill(mainContext.arc(screenPos.x, screenPos.y, size, 0, 9))
      );
    }
  }
}

/*****************************************************************************************
 *webgl初始化
 */
import {
  gl_TEXTURE_2D,
  gl_NEAREST,
  gl_TEXTURE_MIN_FILTER,
  gl_TEXTURE_MAG_FILTER,
  gl_TEXTURE_WRAP_S,
  gl_CLAMP_TO_EDGE,
  gl_TEXTURE_WRAP_T,
  gl_VERTEX_SHADER,
  gl_COMPILE_STATUS,
  gl_FRAGMENT_SHADER,
  gl_LINK_STATUS,
  gl_VERTEX_BUFFER_SIZE,
  cavasPixelated,
  glOverlay,
} from "./var";

let glTileTexture,
  glShader,
  glArrayBuffer,
  glPositionData,
  glColorData,
  glBatchCount,
  image;
function glInit() {
  glCanvas = document.createElement("canvas");
  glContext = glCanvas.getContext("webgl", { antialias: false });
  glTileTexture = glCreateTexture((image = null)); // 未传入image
  // some browsers are much faster without copying the gl buffer so we just overlay it instead
  glOverlay && document.body.appendChild(glCanvas);
  // setup vertex and fragment shaders
  glShader = glCreateProgram(
    "precision highp float;" + // use highp for better accuracy
    "uniform mat4 m;" + // transform matrix
    "attribute vec2 p,t;" + // position, uv
    "attribute vec4 c,a;" + // color, additiveColor
    "varying vec4 v,d,e;" + // return uv, color, additiveColor
    "void main(){" + // shader entry point
    "gl_Position=m*vec4(p,1,1);" + // transform position
    "v=vec4(t,p);d=c;e=a;" + // pass stuff to fragment shader
      "}", // end of shader
    "precision highp float;" + // use highp for better accuracy
    "varying vec4 v,d,e;" + // uv, color, additiveColor
    "uniform sampler2D s;" + // texture
    "void main(){" + // shader entry point
    "gl_FragColor=texture2D(s,v.xy)*d+e;" + // modulate texture by color plus additive
      "}" // end of shader
  );

  // init buffers
  const vertexData = new ArrayBuffer(gl_VERTEX_BUFFER_SIZE);
  glArrayBuffer = glContext.createBuffer();
  glPositionData = new Float32Array(vertexData);
  glColorData = new Uint32Array(vertexData);
  glBatchCount = 0;
}

/** Create WebGL texture from an image and set the texture settings
 * 用于glInit
 */
function glCreateTexture(image) {
  // build the texture
  const texture = glContext.createTexture();
  glContext.bindTexture(gl_TEXTURE_2D, texture);
  image &&
    image.width &&
    glContext.texImage2D(
      gl_TEXTURE_2D,
      0,
      gl_RGBA,
      gl_RGBA,
      gl_UNSIGNED_BYTE,
      image
    );

  // use point filtering for pixelated rendering
  const filter = cavasPixelated ? gl_NEAREST : gl_LINEAR;
  glContext.texParameteri(gl_TEXTURE_2D, gl_TEXTURE_MIN_FILTER, filter);
  glContext.texParameteri(gl_TEXTURE_2D, gl_TEXTURE_MAG_FILTER, filter);
  glContext.texParameteri(gl_TEXTURE_2D, gl_TEXTURE_WRAP_S, gl_CLAMP_TO_EDGE);
  glContext.texParameteri(gl_TEXTURE_2D, gl_TEXTURE_WRAP_T, gl_CLAMP_TO_EDGE);
  return texture;
}

/** Create WebGL program with given shaders
 *  @param {WebGLShader} vsSource
 *  @param {WebGLShader} fsSource
 *  @return {WebGLProgram}
 *  @memberof WebGL */
function glCreateProgram(vsSource, fsSource) {
  // build the program
  const program = glContext.createProgram();
  glContext.attachShader(program, glCompileShader(vsSource, gl_VERTEX_SHADER));
  glContext.attachShader(
    program,
    glCompileShader(fsSource, gl_FRAGMENT_SHADER)
  );
  glContext.linkProgram(program);

  // check for errors
  if (debug && !glContext.getProgramParameter(program, gl_LINK_STATUS))
    throw glContext.getProgramInfoLog(program);
  return program;
}

/** Compile WebGL shader of the given type, will throw errors if in debug mode
 *  @param {String} source
 *  @param          type
 *  @return {WebGLShader}
 *  @memberof WebGL */
function glCompileShader(source, type) {
  // build the shader
  const shader = glContext.createShader(type);
  glContext.shaderSource(shader, source);
  glContext.compileShader(shader);

  // check for errors
  if (debug && !glContext.getShaderParameter(shader, gl_COMPILE_STATUS))
    throw glContext.getShaderInfoLog(shader);
  return shader;
}

/*****************************************************
 * 计算工具
 */
const randSeeded = (a = 1, b = 0) => {
  randSeed ^= randSeed << 13;
  randSeed ^= randSeed >>> 17;
  randSeed ^= randSeed << 5; // xorshift
  return b + ((a - b) * abs(randSeed % 1e9)) / 1e9;
};
const abs = (a) => (a < 0 ? -a : a);
export { myengineInit };
