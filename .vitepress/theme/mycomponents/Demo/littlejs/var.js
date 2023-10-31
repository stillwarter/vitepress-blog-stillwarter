import {Vector2} from "./util"

/**
 * 一些通用变量
 */

// 二次改变使用变量

/**
 * 主要canvasdom操作对象
 */
let mainCanvas, mainContext;

/**
 * webgl操作对象
 */
let glCanvas, glContext, glTileTexture;

/**
 * overly操作对象
 */
let overlayCanvas, overlayContext;

/**
 * webgl需要用到的静态变量
 */
const gl_ONE = 1,
  gl_TRIANGLES = 4,
  gl_SRC_ALPHA = 770,
  gl_ONE_MINUS_SRC_ALPHA = 771,
  gl_BLEND = 3042,
  gl_TEXTURE_2D = 3553,
  gl_UNSIGNED_BYTE = 5121,
  gl_BYTE = 5120,
  gl_FLOAT = 5126,
  gl_RGBA = 6408,
  gl_NEAREST = 9728,
  gl_LINEAR = 9729,
  gl_TEXTURE_MAG_FILTER = 10240,
  gl_TEXTURE_MIN_FILTER = 10241,
  gl_TEXTURE_WRAP_S = 10242,
  gl_TEXTURE_WRAP_T = 10243,
  gl_COLOR_BUFFER_BIT = 16384,
  gl_CLAMP_TO_EDGE = 33071,
  gl_TEXTURE0 = 33984,
  gl_TEXTURE1 = 33985,
  gl_ARRAY_BUFFER = 34962,
  gl_STATIC_DRAW = 35044,
  gl_DYNAMIC_DRAW = 35048,
  gl_FRAGMENT_SHADER = 35632,
  gl_VERTEX_SHADER = 35633,
  gl_COMPILE_STATUS = 35713,
  gl_LINK_STATUS = 35714,
  gl_UNPACK_FLIP_Y_WEBGL = 37440,
  // constants for batch rendering
  gl_VERTICES_PER_QUAD = 6,
  gl_INDICIES_PER_VERT = 6,
  gl_MAX_BATCH = 1 << 16,
  gl_VERTEX_BYTE_STRIDE = 4 * 2 * 2 + 4 * 2, // vec2 * 2 + (char * 4) * 2
  gl_VERTEX_BUFFER_SIZE =
    gl_MAX_BATCH * gl_VERTICES_PER_QUAD * gl_VERTEX_BYTE_STRIDE;
// WebGL internal variables not exposed to documentation
let glActiveTexture,
  glShader,
  glArrayBuffer,
  glPositionData,
  glColorData,
  glBatchCount,
  glBatchAdditive,
  glAdditive;
let glEnable = 1;

/**
 * debug模式相关
 */
let debug = 1;

// 原littlejs变量

/** Current engine time since start in seconds, derived from frame
 *  @type {Number}
 *  @memberof Engine */
let time = 0;

/** Actual clock time since start in seconds (not affected by pause or frame rate clamping)
 *  @type {Number}
 *  @memberof Engine */
let timeReal = 0;

/** Current update frame, used to calculate time
 *  @type {Number}
 *  @memberof Engine */
let frame = 0;

/** Frames per second to update objects
 *  @type {Number}
 *  @default
 *  @memberof Engine */
const frameRate = 60;

/** How many seconds each frame lasts, engine uses a fixed time step
 *  @type {Number}
 *  @default 1/60
 *  @memberof Engine */
const timeDelta = 1 / frameRate;

/** Array containing all engine objects
 *  @type {Array}
 *  @memberof Engine */
let engineObjects = [];

/** Array containing only objects that are set to collide with other objects this frame (for optimization)
 *  @type {Array}
 *  @memberof Engine */
let engineObjectsCollide = [];

/** Is the game paused? Causes time and objects to not be updated
 *  @type {Boolean}
 *  @default 0
 *  @memberof Engine */
let paused = 0;

/** True if watermark with FPS should be shown, false in release builds
 *  @type {Boolean}
 *  @default
 *  @memberof Debug */
let showWatermark = 1;

/**
 * Create a 2d vector, can take another Vector2 to copy, 2 scalars, or 1 scalar
 * @param {Number} [x=0]
 * @param {Number} [y=0]
 * @return {Vector2}
 * @example
 * let a = vec2(0, 1); // vector with coordinates (0, 1)
 * let b = vec2(a);    // copy a into b
 * a = vec2(5);        // set a to (5, 5)
 * b = vec2();         // set b to (0, 0)
 * @memberof Utilities
 */
const vec2 = (x = 0, y) =>
  x.x == undefined
    ? new Vector2(x, y == undefined ? x : y)
    : new Vector2(x.x, x.y);

/** Fixed size of the canvas, if enabled canvas size never changes
 * 固定画布大小，如果启用，画布大小永远不会更改
 * - you may also need to set mainCanvasSize if using screen space coords in startup
 * 如果在启动时使用屏幕空间坐标，您可能还需要设置mainCanvasSize
 *  @type {Vector2}
 *  @default Vector2()
 *  @memberof Settings */
let canvasFixedSize = vec2();

/** Fixes slow rendering in some browsers by not compositing the WebGL canvas
 * 通过不合成WebGL画布修复了某些浏览器中渲染速度慢的问题（但实际上
 *  @type {Boolean}
 *  @default
 *  @memberof Settings */
let glOverlay = 1;

/** Disables anti aliasing for pixel art if true
 * 如果为true，则禁用像素艺术的抗锯齿
 *  @type {Boolean}
 *  @default
 *  @memberof Settings */
let cavasPixelated = 1;

/** Scale of camera in world space
 * 相机在世界空间中的比例
 *  @type {Number}
 *  @default
 *  @memberof Settings */
let cameraScale = 32;

/** Returns lowest of two values passed in
 * 返回传入的两个值中的最低值
 *  @param {Number} valueA
 *  @param {Number} valueB
 *  @return {Number}
 *  @memberof Utilities */
const min = (a, b) => (a < b ? a : b);

/** The max size of the canvas, centered if window is larger
 *  @type {Vector2}
 *  @default Vector2(1920,1200)
 *  @memberof Settings */
let canvasMaxSize = vec2(1920, 1200);

/** Position of camera in world space
 * 相机在世界空间中的位置
 *  @type {Vector2}
 *  @default Vector2()
 *  @memberof Settings */
let cameraPos = vec2();

/** Returns a random color between the two passed in colors, combine components if linear
 *  @param {Color}   [colorA=Color()]
 *  @param {Color}   [colorB=Color(0,0,0,1)]
 *  @param {Boolean} [linear]
 *  @return {Color}
 *  @memberof Random */
const randColor = (cA = new Color(), cB = new Color(0, 0, 0, 1), linear) =>
  linear
    ? cA.lerp(cB, rand())
    : new Color(
        rand(cA.r, cB.r),
        rand(cA.g, cB.g),
        rand(cA.b, cB.b),
        rand(cA.a, cB.a)
      );

/** Returns a random value between the two values passed in
 * 返回传入的两个值之间的随机值
 *  @param {Number} [valueA=1]
 *  @param {Number} [valueB=0]
 *  @return {Number}
 *  @memberof Random */
const rand = (a = 1, b = 0) => b + (a - b) * Math.random();

/** Seed used by the randSeeded function
 *  @type {Number}
 *  @default
 *  @memberof Random */
let randSeed = 1;

/** Returns a seeded random value between the two values passed in using randSeed
 *  @param {Number} [valueA=1]
 *  @param {Number} [valueB=0]
 *  @return {Number}
 *  @memberof Random */
const randSeeded = (a = 1, b = 0) => {
  randSeed ^= randSeed << 13;
  randSeed ^= randSeed >>> 17;
  randSeed ^= randSeed << 5; // xorshift
  return b + ((a - b) * abs(randSeed % 1e9)) / 1e9;
};

/** Returns absoulte value of value passed in
 * 返回传入值的绝对值
 *  @param {Number} value
 *  @return {Number}
 *  @memberof Utilities */
const abs = (a) => (a < 0 ? -a : a);

/** Clamps the value beween max and min
 * 钳制最大值和最小值之间的值
 *  @param {Number} value
 *  @param {Number} [min=0]
 *  @param {Number} [max=1]
 *  @return {Number}
 *  @memberof Utilities */
const clamp = (v, min = 0, max = 1) => (v < min ? min : v > max ? max : v);

/** Linearly interpolates the percent value between max and min
 *  @param {Number} percent
 *  @param {Number} [min=0]
 *  @param {Number} [max=1]
 *  @return {Number}
 *  @memberof Utilities */
const lerp = (p, min = 0, max = 1) => min + clamp(p) * (max - min);

export {
  mainCanvas,
  mainContext,
  glCanvas,
  glContext,
  glTileTexture,
  overlayCanvas,
  overlayContext,
  gl_ONE,
  gl_TRIANGLES,
  gl_SRC_ALPHA,
  gl_ONE_MINUS_SRC_ALPHA,
  gl_BLEND,
  gl_TEXTURE_2D,
  gl_UNSIGNED_BYTE,
  gl_BYTE,
  gl_FLOAT,
  gl_RGBA,
  gl_NEAREST,
  gl_LINEAR,
  gl_TEXTURE_MAG_FILTER,
  gl_TEXTURE_MIN_FILTER,
  gl_TEXTURE_WRAP_S,
  gl_TEXTURE_WRAP_T,
  gl_COLOR_BUFFER_BIT,
  gl_CLAMP_TO_EDGE,
  gl_TEXTURE0,
  gl_TEXTURE1,
  gl_ARRAY_BUFFER,
  gl_STATIC_DRAW,
  gl_DYNAMIC_DRAW,
  gl_FRAGMENT_SHADER,
  gl_VERTEX_SHADER,
  gl_COMPILE_STATUS,
  gl_LINK_STATUS,
  gl_UNPACK_FLIP_Y_WEBGL,
  gl_VERTICES_PER_QUAD,
  gl_INDICIES_PER_VERT,
  gl_MAX_BATCH,
  gl_VERTEX_BYTE_STRIDE,
  gl_VERTEX_BUFFER_SIZE,
  debug,
  time,
  timeReal,
  frame,
  frameRate,
  timeDelta,
  engineObjects,
  engineObjectsCollide,
  paused,
  showWatermark,
  vec2,
  canvasFixedSize,
  glOverlay,
  cavasPixelated,
  cameraScale,
  min,
  canvasMaxSize,
  cameraPos,
  randColor,
  rand,
  randSeed,
  randSeeded,
  abs,
  clamp,
  lerp,
};
