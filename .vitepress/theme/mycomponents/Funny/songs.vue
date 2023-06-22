<template>
  <div class="main">
    <!-- <div style="width: 300px; height: 120px; margin: 100px auto">
      <audio
        id="music2"
        src="http://music.163.com/song/media/outer/url?id=1337065812.mp3"
        loop="loop"
      >
        你的浏览器不支持audio标签。
      </audio>
      <a href="javascript:playPause();"
        ><img
          src="pause.gif"
          width="48"
          height="50"
          id="music_btn2"
          border="0"
          style="top: 10px; right: 10px; position: absolute"
      /></a>
    </div> -->

    <audio
      preload="auto"
      src="http://music.163.com/song/media/outer/url?id=1411793721.mp3"
      controls
      @pause="onPause"
      @play="onPlay"
    />

    <div id="content" class="content">
      <h1 id="word" class="wordtitle">
        stillwarter的歌词渲染器
        <div class="aurora">
          <div class="aurora__item"></div>
          <div class="aurora__item"></div>
          <div class="aurora__item"></div>
          <div class="aurora__item"></div>
        </div>
      </h1>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {  onMounted } from "vue";
import axios from "axios";


let audioflag = 0;
let audiostatu = 0;
let audiotimimg=0

let title 
let audio 


let word = [];
let lyricarr = [];
let lyriarrindex = 1;

let lyricword = "";
let timing = 0;
let nextiming = 0;
let timer = 0;

let flag = 0;
let endflag = 0;
let nextflag = 0;

let render = {};
let renderfn = {};

/* 分离时间和歌词 获取下一个时间点*/
function splicelyric(lyricwords, nextlyricwords) {
  // console.log(lyricarr);
  lyricword = lyricwords.slice(10, lyricwords.length);
  if (!lyricword.length) {
    lyricword = ".........";
  }
  timing = lyricwords.slice(1, 6).split(":");
  nextiming = nextlyricwords.slice(1, 6).split(":");
}

/* 计算时间长 */
function getrenderlength() {
  let len1 = nextiming[0] - timing[0];
  let len2 = nextiming[1] - timing[1];
  return len1 * 60 + len2;
}

/* 歌词渲染 */
function renderlyric() {
  let delay = 0;
  let lyricwordindex = 0;

  // 获取渲染时间
  let rendertime1 = new Date().getTime();

  // 渲染函数
  renderfn = () => {
    // 配合audio进行暂停
    if (audioflag == 1) {
      cancelAnimationFrame(render);
    } else {
      // 若当前歌词小于接口歌词，则word进行更新
      if (word.length < lyricword.length && delay % 6 == 0 && !flag) {
        console.log("文字渲染");
        word.push(lyricword[lyricwordindex]);
        lyricwordindex++;
        title[0].childNodes[0].textContent = word.join("");
        // 若歌词长度等于歌词长度，则根据时间戳进行暂停（歌词停顿效果）
        if (word.length == lyricword.length) {
          flag = 1;
          cancelAnimationFrame(render);
          let rendertime2 = new Date().getTime();
          timer = getrenderlength() * 1000 - (rendertime2 - rendertime1) - 110;
          setTimeout(() => {
            delay++;
            requestAnimationFrame(renderfn);
          }, timer);
        } else {
          delay++;
          requestAnimationFrame(renderfn);
        }
      } 
      // 停顿后,由于flag状态改变,对歌词进行退步更新
      else if (flag && delay % 4 == 0) {
        word.pop();
        title[0].childNodes[0].textContent = word.join("");
        nextflag = 1;
        delay++;
        requestAnimationFrame(renderfn);
      } 
      // 歌词退完后,渲染下一条歌词
      else if (word.length == 0 && nextflag) {
        nextflag = 0;
        lyricwordindex = 0;

        lyriarrindex++;
        flag = 0;
        splicelyric(lyricarr[lyriarrindex], lyricarr[lyriarrindex + 1]);
        rendertime1 = new Date().getTime();
        delay++;
        requestAnimationFrame(renderfn);
      } else {
        delay++;
        requestAnimationFrame(renderfn);
      }
    }
  };
  render = requestAnimationFrame(renderfn);
}


// https://api.injahow.cn/meting/?type=lrc&id=416892104
function renderstart() {
  /* 动画渲染入口 */
  axios.get("https://api.injahow.cn/meting/?type=lrc&id=1411793721").then((res) => {
    // console.log(res);
    
    // lyricarr = res.data.lrc.lyric.split("\n");
    lyricarr = res.data.split("\n");
    
    // lyricarr = res.data.tlyric.lyric.split("\n");
    splicelyric(lyricarr[lyriarrindex], lyricarr[lyriarrindex + 1]);
    getrenderlength();
    
    renderlyric();
  });
}

function onPause() {
  console.log("暂停");
  audioflag = 1;
  audiotimimg=timer-Math.round(audio[0].currentTime*1000)
}

function onPlay() {
 title = document.getElementsByClassName("wordtitle");
 audio = document.getElementsByTagName("audio")
  if (audioflag == 1) {
    audioflag = 0;
  
    setTimeout(() => {
      requestAnimationFrame(renderfn);
    }, audiotimimg+200);
  } else {
    renderstart();
  }
}




</script>

<style scoped>
.main {
  font-family: "Inter", "DM Sans", Arial, sans-serif;
  overflow: hidden;
  place-items: center;
  background-color: var(--bg);
  display: grid;
  height: 50vh;
  color: #fff;
  border-radius: 8px;
}

*,
*::before,
*::after {
  font-family: inherit;
  box-sizing: border-box;
}

.content {
  text-align: center;
}

.wordtitle {
  font-size: 50px;
  font-weight: 800;
  letter-spacing: var(--ls);
  position: relative;
  overflow: hidden;
  background: var(--bg);
  margin: 0;
  height: 150px;
}

.subtitle {
}

.aurora {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  mix-blend-mode: darken;
  pointer-events: none;
}

.aurora__item {
  overflow: hidden;
  position: absolute;
  width: 60vw;
  height: 60vw;
  background-color: var(--clr-1);
  border-radius: 37% 29% 27% 27% / 28% 25% 41% 37%;
  filter: blur(var(--blur));
  mix-blend-mode: overlay;
}

.aurora__item:nth-of-type(1) {
  top: -50%;
  animation: aurora-border 5s ease-in-out infinite,
    aurora-1 12s ease-in-out infinite alternate;
}

.aurora__item:nth-of-type(2) {
  background-color: var(--clr-3);
  right: 0;
  top: 0;
  animation: aurora-border 6s ease-in-out infinite,
    aurora-2 9s ease-in-out infinite alternate;
}

.aurora__item:nth-of-type(3) {
  background-color: var(--clr-2);
  left: 0;
  bottom: 0;
  animation: aurora-border 6s ease-in-out infinite,
    aurora-3 9s ease-in-out infinite alternate;
}

.aurora__item:nth-of-type(4) {
  background-color: var(--clr-4);
  right: -300px;
  bottom: -100%;
  animation: aurora-border 6s ease-in-out infinite,
    aurora-4 12s ease-in-out infinite alternate;
}

@keyframes aurora-1 {
  0% {
    top: 0;
    right: 0;
  }

  50% {
    top: 100%;
    right: 75%;
  }

  75% {
    top: 100%;
    right: 25%;
  }

  100% {
    top: 0;
    right: 0;
  }
}

@keyframes aurora-2 {
  0% {
    top: -50%;
    left: 0%;
  }

  60% {
    top: 100%;
    left: 75%;
  }

  85% {
    top: 100%;
    left: 25%;
  }

  100% {
    top: -50%;
    left: 0%;
  }
}

@keyframes aurora-3 {
  0% {
    bottom: 0;
    left: 0;
  }

  40% {
    bottom: 100%;
    left: 75%;
  }

  65% {
    bottom: 40%;
    left: 50%;
  }

  100% {
    bottom: 0;
    left: 0;
  }
}

@keyframes aurora-4 {
  0% {
    bottom: -50%;
    right: 0;
  }

  50% {
    bottom: 0%;
    right: 40%;
  }

  90% {
    bottom: 50%;
    right: 25%;
  }

  100% {
    bottom: -50%;
    right: 0;
  }
}

@keyframes aurora-border {
  0% {
    border-radius: 37% 29% 27% 27% / 28% 25% 41% 37%;
  }

  25% {
    border-radius: 47% 29% 39% 49% / 61% 19% 66% 26%;
  }

  50% {
    border-radius: 57% 23% 47% 72% / 63% 17% 66% 33%;
  }

  75% {
    border-radius: 28% 49% 29% 100% / 93% 20% 64% 25%;
  }

  100% {
    border-radius: 37% 29% 27% 27% / 28% 25% 41% 37%;
  }
}
</style>
