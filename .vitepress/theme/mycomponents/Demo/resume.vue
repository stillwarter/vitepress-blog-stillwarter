<template>
  <div id="content">
    <pre id="style-text"></pre>
    <pre id="work-text"></pre>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

const renderlist = [
  {
    content: "// 这是一个简单的简历动画",
    style: false,
  },
  {
    content: "/* 先给全局加一个效果\n(css省略大括号) */",
    style: {
      "*": {
        transition: "all .3s linear;",
      },
    },
  },
  {
    content: "// 调整一下对话框样式",
    style: {
      "#content": {
        height: "90vh;",
      },
      "#style-text": {
        background: "#333;",
        width: "430px;",
        "min-height": "90vh;",
        padding: "10px;",
        border: "1px solid red;",
        "border-radius": "4px;",
        position: "absolute;",
        bottom: "0px;",
        overflow: "auto;",
      },
    },
  },
  {
    content: "// 换一个我喜欢的字体",
    style: {
      "#style-text": {
        "font-family": "catbite",
      },
    },
  },
  {
    content: "// ok 我们做一点调整 尽量让它看起来好看点",
    style: {
      "*": {
        margin: "0;",
      },
      p: {
        "margin-top": "10px;",
        color: "#857F6B;",
      },
      ".classkey": {
        color: "pink;",
        display: "block;",
        "margin-top": "10px;",
      },
      ".classattrkey": {
        color: "#16f979;",
        "padding-left": "12px;",
        "font-size": "12px;",
      },
      ".classattrvalue": {
        color: "#a3dff1;",
        "font-size": "12px;",
      },
    },
  },
  {
    content: "// 现在准备一个空白栏",
    style: {
      "#content": {
        width: "100vw;",
        display: "flex;",
        "justify-content": "space-between;",
      },
      "#work-text": {
        width: "720px;",
        height: "90vh;",
        "border-radius": "4px;",
        background: "#fff;",
        opacity: "0.4;",
        "box-shadow": "inset 0 0 6px rgba(255, 255, 255);",
        position: "absolute;",
        left: "450px;",
        overflow: "auto;",
        padding: "10px;",
      },
    },
  },
  {
    content: "// 现在可以开始写简历了",
    style: false,
  },
  {
    content: "// 我们先准备简历的整体布局",
    style: {
      "#work-text div": {
        padding: "10px;",
        background: "#eee;",
        "border-radius": "4px;",
      },
    },
  },
];

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

onMounted(async () => {
  const codedom = document.querySelector("#style-text");
  const textdom = document.querySelector("#work-text");
  const bodydom = document.body;
  let intervalId = null;

  function step(word, dom) {
    // intervalId = null;
    return new Promise((resolve, reject) => {
      const pdom = document.createElement("p");
      let i = 0;
      let len = word.length;
      intervalId = setInterval(() => {
        if (i < len) {
          pdom.innerHTML += word[i++];
          dom.appendChild(pdom);
        } else {
          clearInterval(intervalId);
          resolve("Step result");
        }
      }, 10);
    });
  }

  function setpStyle(word, dom, wordstyle = "") {
    return new Promise((resolve, reject) => {
      const pdom = document.createElement("span");
      pdom.className = wordstyle;
      let i = 0;
      let len = word.length;
      intervalId = setInterval(() => {
        if (i < len) {
          pdom.innerHTML += word[i++];
          dom.appendChild(pdom);
        } else {
          clearInterval(intervalId);
          resolve("Step result");
        }
      }, 10);
    });
  }

  /**
   * word:需要添加dom的文字
   * parentDom：需要添加dom的父节点
   * domType：需要添加dom的类型
   * wordStyle:需要添加dom的style样式
   */
  function stepDetail(word, parentDom, domType, className = "") {
    return new Promise((resolve, reject) => {
      const dom = document.createElement(domType);
      dom.className = className;
      let i = 0;
      const len = word.length;
      intervalId = setInterval(() => {
        if (i < len) {
          dom.innerHTML += word[i++];
          console.log(dom);
          parentDom.appendChild(dom);
        } else {
          // 没有word传入，也将dom添加到父节点
          parentDom.appendChild(dom);
          clearInterval(intervalId);
          resolve("Step result");
        }
      }, 10);
    });
  }

  function stepDetailImg(parenDdom, url, wordStyle = "") {
    return new Promise((resolve, reject) => {
      const dom = document.createElement("img");
      dom.className = wordStyle;
      dom.src = url;
      parenDdom.appendChild(dom);
      resolve("Step result");
    });
  }

  function addHeadStyle(stylecontent) {
    stylecontent = JSON.stringify(stylecontent)
      .toString()
      .slice(1, -1)
      .replace(/"/g, "")
      .replace(/,/g, "");
    const sdom = document.createElement("style");
    sdom.type = "text/css";
    sdom.innerHTML = stylecontent;
    document.querySelector("head").appendChild(sdom);
  }

  let datai = 0;
  let delay = 1;

  /**
   * 默认传入的list是renderlist样子的
   */
  async function stepStyleList(stylelist) {
    for (const item of stylelist) {
      if (item.style) {
        await step(item.content, codedom);
        const stylelist = Object.entries(item.style);
        for (const styleitem of stylelist) {
          await setpStyle(styleitem[0] + "\n", codedom, "classkey");
          const attr = Object.entries(styleitem[1]);
          for (const attritem of attr) {
            await setpStyle(attritem[0] + ":", codedom, "classattrkey");
            await setpStyle(attritem[1] + "\n", codedom, "classattrvalue");
          }

          addHeadStyle(styleitem);
        }
      } else {
        await step(item.content, codedom);
      }
    }
  }

  try {
    // 初始化
    await stepStyleList(renderlist);

    // 调整头部栏布局
    // await step("// 调整头部栏布局", codedom);

    // 简历布局
    /**
     * 使用stepDetail 创建子元素
     */
    await stepDetail("", textdom, "div", "headbox");
    const headboxdom = document.querySelector(".headbox");
 await stepDetail("", headboxdom, "div", "headboxright");
    /**
     * 头部的照片和简介
     */
    const headStylelist = [
      {
        content: "// 简历头部",
        style: {
          ".headbox": {
            display: "flex;",
          },
        },
      },
    ];
    stepStyleList(headStylelist);

    await stepDetail("", textdom, "div", "centerbox");
    await stepDetail("", textdom, "div", "footerbox");

    // 正式写简历
    // await stepDetail("你好，我是stillwarter", textdom, "h6");

    // const url =
    //   "https://file.fishpi.cn/2022/07/MOSHED2022621164630-1b1ec532.gif?imageView2/1/w/210/h/210/interlace/0/q/100";
    // await stepDetailImg(textdom, url);
  } catch (error) {
    console.log(error);
  }

  // async function run() {

  //   if (delay % 200 == 0) {
  //     renderwords(renderlist[datai]);
  //     datai++;
  //   }
  //   delay++;

  //   if (datai >= renderlist.length) {
  //     return;
  //   }

  //   requestAnimationFrame(run);
  // }

  // requestAnimationFrame(run);

  // function renderwords(words, wordstyle = "") {
  //   const pdom = document.createElement("p");
  //   const word = words.content;
  //   const style = words.style;
  //   // const word = word;
  //   // let i = 0;
  //   let delay = 1;
  //   let i = 0;

  //   function addfont() {
  //     let sdelay = 1;
  //     if (delay % 20 == 0) {
  //       pdom.innerHTML += word[i++];
  //       codedom.appendChild(pdom);
  //     }
  //     delay++;

  //     if (i >= word.length) {
  //       if (style) {
  //         addHeadStyle(style);
  //       }
  //       return;
  //     }

  //     requestAnimationFrame(addfont);

  //     function addStyle(){

  //     }
  //   }

  //   addfont();
  // }
});
</script>

<style scoped></style>
