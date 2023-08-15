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
        <a>
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

const peopledata = {
  teacherdata: [
    {
      img: "https://tmx.fishpi.cn/image/head.jpg",
      name: "鼠鼠在碎觉",
      des: "鼠鼠在碎觉，请勿打扰~",
      look: "我的摸鱼导师~",
      link: "https://www.sszsj.cc/",
      store: `
        <p>大三的时候在GitHub上面搜索摸鱼，看到了摸瞎的摸鱼插件？然后就进入了链滴，奇怪的开始了code生涯，在此之前并没有认真的code，大多情况下只是为了应付学业。</p>
        
        <p>这位确实能称为我的导师了，虽然他也并没有教导我什么，虽然我不知道他的模样姓名，但故事是从摸鱼开始...</p>
      `,
    },
    {
      img: "https://my.hancel.org/media/logo.jpg",
      name: "hancel",
      des: "人生而自由，却无往不在枷锁之中。",
      look: "超强叮当猫~",
      link: "https://my.hancel.org/",
      store: `
        <p>为什么叫叮当猫，因为鱼油很多的问题他都能答上来，hancel（跳佬）做了很多插件，比如maze，鱼派的拓展等等，是混在鱼排内很强力的开发者！</p>
        <p>跳佬也会分享自己的做菜贴和白嫖游戏的帖子，德艺双馨了属于是。</p>
      `,
    },
  ],

  fishfrends: [
    {
      img:
        "https://file.fishpi.cn/2022/11/blob-e958dbd9.png?imageView2/1/w/210/h/210/interlace/0/q/100",
      name: "Gakkiyomi",
      des: "为往圣继绝学~",
      look: "某知名大厂java主程~",
      link: " http://gakkiyomi.me",
      store: "",
    },
    {
      img: "https://avatars1.githubusercontent.com/u/6754458?v=4",
      name: "adlered",
      des: "贼拉正经的技术博客~",
      look: "年少有为的公司老总~",
      link: "https://www.stackoverflow.wiki",
      store: "",
    },
    {
      img: "https://lemon-cxh.github.io/images/avatar.jpg",
      name: "三月柳絮四月雨",
      des: "我年华虚度，空有一身疲惫😭",
      look: "感情上的迷途人..",
      link: "https://lemon-cxh.github.io",
      store: "",
    },
    {
      img: "https://www.hjljy.cn/favicon.png",
      name: "海加尔金鹰",
      des: "如野草般一岁一枯荣~",
      look: "熟悉又陌生的链友~",
      link: "https://www.hjljy.cn",
      store: "",
    },
    {
      img:
        "https://file.fishpi.cn/2022/06/blob-fbff7c58.png?imageView2/1/w/210/h/210/interlace/0/q/100",
      name: "十一",
      des: "懒癌晚期，混吃等死~",
      look: "成熟稳重的中龄愤青🤪",
      link: "https://www.elevenblog.cn",
      store: "",
    },
    {
      img:
        "https://file.fishpi.cn/2022/06/srchttpimgzcoolcncommunity0116405d84f975a801211d537707c9gifreferhttpimgzcool-0f2d09c9.gif?imageView2/1/w/210/h/210/interlace/0/q/100",
      name: "test12138",
      des: "大丈夫生于天地之间，岂能郁郁久居人下！",
      look: "AAA-瓷砖批发~",
      link: "https://114514gay.cf",
      store: "",
    },
    {
      img:
        "https://file.fishpi.cn/2023/02/v247dfbb051740334703a0c5a05fb006dbr-d6b59b50.jpg?imageView2/1/w/210/h/210/interlace/0/q/100",
      name: "probieMott",
      des: ".net萌新~",
      look: "你好鱼油~",
      link: "https://probieluo.github.io",
      store: "",
    },
    {
      img: " https://s1.ax1x.com/2022/03/13/bqyIpT.jpg",
      name: "咕咕咕",
      des: "路漫漫其修远兮，吾将上下而求索。",
      look:"偶尔冒泡的猫猫头",
      link: "https://cooooing.github.io/",
    },
    {
      img:"https://pwl.stackoverflow.wiki/2021/10/blob-29bbd528.png?imageView2/1/w/210/h/210/interlace/0/q/100",
      name:"涛之雨",
      des:"'懒得打理blog，cnblogs也很丑，也没什么人看，不如直接来吾爱找我'",
      look:"吾爱大佬",
      link:"https://taozhiyu.gitee.io/"
    },
  ],

  bigstart: [
    {
      img: "https://avatars.githubusercontent.com/u/905434?v=4",
      name: "阮一峰",
      des: "《未来世界的幸存者》",
      look: "20年的时间散落在这里..",
      link: " https://ruanyifeng.com/",
      store: "",
    },
    {
      img: "https://b3logfile.com/avatar/1353745196354_1611386411315.jpeg",
      name: "D",
      des: "但行好事莫问前程~",
      look: "思源笔记开发者，报废程序员D~",
      link: "https://88250.b3log.org/",
      store: "",
    },
    {
      img: " https://avatars.githubusercontent.com/u/11247099?v=4",
      name: "Anthony Fu",
      des: "vue,vite,nuxt核心团队成员~",
      look: "开源探店人~",
      link: "https://antfu.me/",
      store: "",
    },
    {
      img: "https://avatars.githubusercontent.com/u/1240026?v=4",
      name: "Matt Frisbie",
      des: "红宝书作者~",
      look: "新手村老爷爷~",
      link: "https://www.mattfriz.com/",
      store: "",
    },
    {
      img: "https://avatars.githubusercontent.com/u/13848593?v=4",
      name: "向军大叔",
      des: "后盾人社区开发者~",
      look: "最初学习web开发的老师~",
      link: "https://www.houdunren.com/",
      store: "",
    },
  ],

  bestfrends: [
    {
      img: "/img/CC.jpg",
      name: "CC",
      des: "河流捞的一，津门大鲛弹。",
      look: "嵌入式攻城狮~",
      link: "",
      store: "若是蚊子很多，晚上睡不着觉，阁下该如何应对？",
    },
  ],

  website: [
    {
      img: "https://fishpi.cn/images/favicon.png",
      name: "摸鱼派",
      des: "摸鱼派是一个以程序员、设计师、极客为核心的社区，欢迎你的加入。",
      look: "鱼油卧虎藏龙!",
      link: "https://fishpi.cn/",
      store: `
        <p>D哥后续全心全意的进行思源笔记的开发，链滴社区逐渐变为了思源笔记的bug提交社区？一批链滴的摸鱼老油条们重启炉灶，新建了一个社区，这就是摸鱼派了。</P>
        <p>也是在这里，老油条们发光发热，将这里打造成了真正的摸鱼聊天室，我也是这里早期的非官方接待机器人；而我在这里的故事也在继续...</p>
      `,
    },
    {
      img: "https://ld246.com/images/favicon.png",
      name: "链滴",
      des:
        "这里是一个记录生活的地方，目前已经有超过 50000 的伙伴加入。我们正在构建一个小众社区。大家在这里相互信任，以平等 • 自由 • 奔放的价值观进行分享交流。最终，希望大家能够找到与自己志同道合的伙伴，共同成长。",
      look: "摸鱼开始的地方~",
      link: "https://ld246.com/",
      store: `
      <p>链滴是我看鼠鼠在碎觉（摸瞎）的插件里发现的，在哪里知道了思源笔记和D哥，正好当时在准备考研，于是就用这个笔记记录知识要点（虽然最后没考好）...</P>
      <p>在社区内遇到的人，确实对我工作学习的选择上产生了影响。我永远记得，接触链滴后，我发现我需要的是学习本身，而不是它带给我的分数。</p>
      `,
    },
  ],

  noblogpeople: [
    {
      img:
        "https://pwl.stackoverflow.wiki/2021/09/bulabula1-98fde124.png?imageView2/1/w/210/h/210/interlace/0/q/100",
      name: "bulabula",
      des: "这个人很懒，什么都没留下。",
      look: "牛b哄哄的脚本小子。",
      link: "https://fishpi.cn/member/bulabula",
      store: "",
    },
    {
      img:
        "https://pwl.stackoverflow.wiki/2021/12/blob-28eb4b9f.png?imageView2/1/w/210/h/210/interlace/0/q/100",
      name: "bongbongbakudan",
      des: "呼呼呼~",
      look: "贴友友~",
      link: "https://fishpi.cn/member/bongbongbakudan",
      store: "",
    },
    {
      img:
        "https://file.fishpi.cn/2023/02/blob-b65aba57.png?imageView2/1/w/210/h/210/interlace/0/q/100",
      name: "Orange",
      des: "小羊要睡觉了~",
      look: "咩~",
      link: "https://fishpi.cn/member/Orange",
      store: "",
    },
    {
      img: "https://file.fishpi.cn/2023/04/blob-3cabeac5.png",
      name: "viiSummer",
      des: "为万世开太平~",
      look: "王昭君温酒斩华雄！",
      link: "https://fishpi.cn/member/viiSummer",
      store: "",
    },
  ],
};
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
