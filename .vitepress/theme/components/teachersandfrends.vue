<template>
  <div class="main" @click="getnode($event)">
    <div class="content" ref="content">
      <h1 class="title">stillwarter的友人帳</h1>
      <p>
        记录相遇的朋友，和我编的小故事，还有老师(虽然老师不认识我，厚颜称为老师)。
      </p>
      <br />
      <p>以及一些厉害的前辈们，和值得感谢的人们...</p>

      <h2 class="h2title">鱼油</h2>
      <p>一起摸鱼的伙伴，相遇于偶然，下次见面会是什么时候呢？</p>
      <div class="teachercontent">
        <div
          class="cardcontent"
          v-for="(item, index) in peopledata.fishfrends"
          :key="index"
          @click="openright(item)"
        >
          <div class="card">
            <img class="avater" :src="item.img" />
            <div class="infor">
              <h4 class="thename">{{ item.name }}</h4>
              <p class="himdes">{{ item.des }}</p>
              <p class="look">{{ item.look }}</p>
            </div>
          </div>
        </div>
      </div>

      <h2 class="h2title">老师</h2>
      <p>谢谢你的回答（文章或视频），解开了我的疑惑。</p>

      <div class="teachercontent">
        <div
          class="cardcontent"
          v-for="(item, index) in peopledata.teacherdata"
          :key="index"
          @click="openright(item)"
        >
          <div class="card">
            <img class="avater" :src="item.img" />
            <div class="infor">
              <h4 class="thename">{{ item.name }}</h4>
              <p class="himdes">{{ item.des }}</p>
              <p class="look">{{ item.look }}</p>
            </div>
          </div>
        </div>
      </div>

      <h2 class="h2title">大佬</h2>
      <p>领域内的传道者，希望我以后也能成为这样的人...</p>

      <div class="teachercontent">
        <div
          class="cardcontent"
          v-for="(item, index) in peopledata.bigstart"
          :key="index"
          @click="openright(item)"
        >
          <div class="card">
            <img class="avater" :src="item.img" />
            <div class="infor">
              <h4 class="thename">{{ item.name }}</h4>
              <p class="himdes">{{ item.des }}</p>
              <p class="look">{{ item.look }}</p>
            </div>
          </div>
        </div>
      </div>

      <h2 class="h2title">挚友</h2>
      <p>落日桥头晓风吹，冷月江畔一人寒。</p>

      <div class="teachercontent">
        <div
          class="cardcontent"
          v-for="(item, index) in peopledata.bestfrends"
          :key="index"
          @click="openright(item)"
        >
          <div class="card">
            <img class="avater" :src="item.img" />
            <div class="infor">
              <h4 class="thename">{{ item.name }}</h4>
              <p class="himdes">{{ item.des }}</p>
              <p class="look">{{ item.look }}</p>
            </div>
          </div>
        </div>
      </div>

      <h2 class="h2title">好玩</h2>
      <p>认识鱼油的平台以及有趣的网站。</p>

      <div class="teachercontent">
        <div
          class="cardcontent"
          v-for="(item, index) in peopledata.website"
          :key="index"
          @click="openright(item)"
        >
          <div class="card">
            <img class="avater" :src="item.img" />
            <div class="infor">
              <h4 class="thename">{{ item.name }}</h4>
              <p class="himdes">{{ item.des }}</p>
              <p class="look">{{ item.look }}</p>
            </div>
          </div>
        </div>
      </div>

      <h2 class="h2title">其他</h2>
      <p>为一些没有blog的朋友准备（你们也赶快搞一个blog罢）...</p>

      <div class="teachercontent">
        <div
          class="cardcontent"
          v-for="(item, index) in peopledata.noblogpeople"
          :key="index"
          @click="openright(item)"
        >
          <div class="card">
            <img class="avater" :src="item.img" />
            <div class="infor">
              <h4 class="thename">{{ item.name }}</h4>
              <p class="himdes">{{ item.des }}</p>
              <p class="look">{{ item.look }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="right" ref="rightpanel">
      <div class="rightcontent">
        <img class="avater" :src="peopleinfo.img" />
        <div class="name">
          {{ peopleinfo.name }}
        </div>
        <div class="des">
          {{ peopleinfo.des }}
        </div>

        <div class="link">
          <a :href="peopleinfo.link" target="_blank">
            {{ peopleinfo.link }}
          </a>
        </div>

        <div class="store" v-html="peopleinfo.store"></div>
      </div>
      <div class="footer">
        <a target="_blank" :href="peopleinfo.fishlink">
          <img src="https://fishpi.cn/images/favicon.png" />
        </a>

        <!-- <a>
          <img src="https://fishpi.cn/images/favicon.png"/>
        </a> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useData, withBase } from "vitepress";
import { peopledata } from "./data/teacherinfo.js";

const content = ref(null);
const rightpanel = ref(null);
const peopleinfo = ref("");

let rightflag = 0;

function openright(info) {
  peopleinfo.value = info;
  rightflag = 1;
  content.value.style.zIndex = 0;
  rightpanel.value.style.right = 0;
}

function getnode(e) {
  if (rightflag && e.target.className == "main") {
    content.value.style.zIndex = 10;
    rightpanel.value.style.right = -450 + "px";
    rightflag = 0;
  }
}
</script>

<style lang="less" scoped>
.main {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  justify-content: center;
  background-color: #e493d0;
  background-repeat: no-repeat;
  transition: all 1s ease;
  background-image: radial-gradient(
      closest-side,
      rgba(235, 105, 78, 1),
      rgba(235, 105, 78, 0)
    ),
    radial-gradient(
      closest-side,
      rgba(100, 229, 225, 1),
      rgba(100, 229, 225, 0)
    ),
    radial-gradient(
      closest-side,
      rgba(204, 234, 131, 1),
      rgba(204, 234, 131, 0)
    ),
    radial-gradient(
      closest-side,
      rgba(170, 142, 245, 1),
      rgba(170, 142, 245, 0)
    ),
    radial-gradient(
      closest-side,
      rgba(218, 192, 147, 1),
      rgba(218, 192, 147, 0)
    );
  background-size: 130vmax 130vmax, 80vmax 80vmax, 90vmax 90vmax,
    110vmax 110vmax, 90vmax 90vmax;
  background-position: -80vmax -80vmax, 60vmax -30vmax, 10vmax 10vmax,
    -30vmax -10vmax, 50vmax 50vmax;

  animation: 24s movement ease infinite;

  .content {
    width: 1250px;
    min-height: 80vh;
    padding-top: 40px;
    padding-bottom: 100px;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 10;
    font-family: "hancan", Arial, "Microsoft YaHei";

    .title {
      font-family: "catbite";
      font-size: 36px;
      line-height: 36px;
      margin-bottom: 42px;
    }
    p {
      font-size: 18px;
      line-height: 16px;
    }

    .h2title {
      font-family: "catbite";
      font-size: 28px;
      line-height: 28px;
      margin-top: 24px;
      margin-bottom: 18px;
    }

    .teachercontent {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
    }

    .cardcontent {
      width: 380px;
      margin-top: 24px;
      display: flex;
      font-family: "liuhuan", Arial, "Microsoft YaHei";
      transition: all 0.5s linear;
      overflow: hidden;
      margin-right: 24px;
      cursor: pointer;
      .card {
        width: 380px;
        height: 120px;
        padding: 16px;
        background: rgba(255, 255, 255, 0.1);
        -webkit-backdrop-filter: blur(8px);
        backdrop-filter: blur(8px);
        border-radius: 25px;
        box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.2);
        transition: all 0.5s linear;
        position: relative;
        display: flex;
        overflow: hidden;
        box-sizing: border-box;
        .avater {
          width: 80px;
          height: 80px;
          border-radius: 50px;
          margin-right: 20px;
          object-fit: cover;
        }
        .infor {
          width: 248px;
          height: 80px;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          .thename {
            font-size: 18px;
            font-weight: bolder;
            font-family: "catbite", Arial, "Microsoft YaHei";
          }

          .himdes {
            font-size: 16px;
            width: 248px;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            white-space: nowrap;
          }

          .look {
            font-size: 16px;
          }
        }
      }

      .card:hover {
        background: rgba(0, 0, 0, 0.1);
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      }
    }
  }

  .right {
    transition: all 1s ease;
    width: 450px;
    height: 100%;
    position: fixed;
    z-index: 10;
    top: 64px;
    right: -450px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.4);
    box-shadow: inset 0 0 6px rgba(255, 255, 255);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
    transition: all 0.5s linear;
    justify-content: space-around;
    .rightcontent {
      width: 100%;

      display: flex;
      flex-direction: column;
      align-items: center;
      transition: all 0.5s linear;
      .avater {
        width: 200px;
        height: 200px;
        border-radius: 50%;
        border: 1px pink solid;
        box-shadow: inset 0 0 1px rgba(0, 0, 0, 1);
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .name {
        font-size: 24px;
        font-weight: bolder;
        font-family: "catbite", Arial, "Microsoft YaHei";
        text-align: center;
        margin-bottom: 20px;
        transition: all 0.5s linear;
        cursor: none;
      }
      .des {
        font-size: 18px;
        font-weight: bolder;
        font-family: "catbite", Arial, "Microsoft YaHei";
        text-align: center;
        margin-bottom: 20px;
        transition: all 0.5s linear;
        cursor: none;
        padding: 0 40px;
      }
      .link {
        font-size: 18px;
        font-family: "catbite", Arial, "Microsoft YaHei";
        transition: all 0.5s linear;
        margin-bottom: 50px;
        a {
          transition: all 0.5s linear;
        }
        a:hover {
          color: #9499ff;
        }
      }
      .store {
        font-size: 14px;
        font-family: "catbite", Arial, "Microsoft YaHei";
        transition: all 0.5s linear;
        cursor: none;
        padding: 0 30px;
        text-indent: 2em;
      }

      .name:hover,
      .des:hover,
      .store:hover {
        color: #9499ff;
      }
    }

    .footer {
      display: flex;
      position: relative;
      a {
        cursor: pointer;
        margin-right: 10px;
        img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
      }
    }
  }
}

.main::after {
  content: "";
  display: block;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

@keyframes movement {
  0%,
  100% {
    background-size: 130vmax 130vmax, 80vmax 80vmax, 90vmax 90vmax,
      110vmax 110vmax, 90vmax 90vmax;
    background-position: -80vmax -80vmax, 60vmax -30vmax, 10vmax 10vmax,
      -30vmax -10vmax, 50vmax 50vmax;
  }

  25% {
    background-size: 100vmax 100vmax, 90vmax 90vmax, 100vmax 100vmax,
      90vmax 90vmax, 60vmax 60vmax;
    background-position: -60vmax -90vmax, 50vmax -40vmax, 0vmax -10vmax,
      -40vmax -20vmax, 40vmax 60vmax;
  }

  50% {
    background-size: 80vmax 80vmax, 110vmax 110vmax, 80vmax 80vmax,
      60vmax 60vmax, 80vmax 80vmax;
    background-position: -50vmax -70vmax, 40vmax -30vmax, 10vmax 0vmax,
      -20vmax 10vmax, 30vmax 50vmax;
  }

  75% {
    background-size: 90vmax 90vmax, 90vmax 90vmax, 100vmax 100vmax,
      90vmax 90vmax, 60vmax 60vmax;
    background-position: -50vmax -40vmax, 50vmax -30vmax, 20vmax 0vmax,
      -10vmax 10vmax, 30vmax 70vmax;
  }
}

@media screen and (max-width: 680px) {
  .main {
    .mytags {
      width: 30rem;
    }
  }
  .colorline {
    width: 480px;
  }
  .mytagslist {
    width: 480px;
    padding: 30px 30px 0 30px;
  }
}

@media (max-width: 480px) {
  .main {
    .mytags {
      width: 15rem;
    }
  }
  .colorline {
    width: 240px;
  }
  .mytagslist {
    width: 240px;
    padding: 30px 10px 0 10px;
  }
}
</style>
