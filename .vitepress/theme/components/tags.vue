<template>
  <div class="main">
    <div class="mytags">
      <div
        v-for="(item, key) in endData"
        class="mytag"
        @click="chose(key, item)"
      >
        <div class="chosemytag">
          {{ key }} <sup>{{ item.length }}</sup>
        </div>
      </div>
    </div>
    <div class="colorline"></div>
    <div class="mytagslist">
      <div class="theTagTitle">
        {{ theTag }}
      </div>
      <div v-for="(item, key) in choseData" class="list">
        <a :href="item.regularPath" class="singlelist">
          <div>{{ item.frontMatter.title }}</div>
          <div>{{ item.frontMatter.date }}</div>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useData, withBase } from "vitepress";

const { theme } = useData();
const postsData = theme.value.posts;
// console.log(postsData);

const endData: any = {};
let theTag = ref("");
let choseData = ref("");
for (let item of postsData) {
  const tag = item.frontMatter.tags;

  if (!tag) {
    break;
  }

  if (typeof tag == "object") {
    for (let i of tag) {
      if (!endData[i]) {
        endData[i] = [];
      }
      endData[i].push(item);
    }
  } else {
    if (!endData[tag]) {
      endData[tag] = [];
    }
    endData[tag].push(item);
  }
}

function chose(key, item) {
  choseData.value = item;
  theTag = key;
}
</script>

<style lang="less" scoped>
.main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 20px;
  .mytags {
    width: 50rem;
    transition: all 0.5s linear;
    display: flex;
    flex-wrap: wrap;
    .mytag {
      width: 125px;
      padding: 5px;
      text-align: center;
      font-family: Avenir, Consolas, Helvetica, Arial, sans-serif;
      cursor: pointer;
      color: #74787a;
      .chosemytag {
        transition: all 0.25s linear;
      }
      .chosemytag:hover {
        color: #21373d;
      }
    }
  }
}
.colorline {
  margin: 15px 0;
  width: 800px;
  transition: all 0.5s linear;
  border-image: linear-gradient(
      to right,
      red,
      orange,
      yellow,
      green,
      Cyan,
      blue,
      purple
    )
    1;
  border-style: solid;
  border-width: 1px;
}
.mytagslist {
  width: 800px;
  padding: 30px 70px 0 70px;
  transition: all 0.5s linear;
  min-height: 70vh;
  max-height: 80vh;
  .theTagTitle {
    font-size: 200%;
    font-weight: 600;
    margin-bottom: 40px;
  }
  .list {
    font-family: FangSong, Helvetica, Tahoma, Arial;
    .singlelist {
      display: flex;
      justify-content: space-between;
      color: #74787a;
      transition: all 0.5s linear;
    }
    .singlelist:hover {
      color: #21373d;
    }
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
