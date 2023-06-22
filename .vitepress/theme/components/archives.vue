<template>
  <div class="main">
    <div class="archievs">
      <div v-for="(item, key) in yearDate" class="arc">
        <div class="yeartitle">{{ key.slice(0, 4) }}</div>
        <div v-for="(item, key) in yearDate[key]" class="archievsmain">
          <a :href="item.regularPath">
            <div>{{ item.frontMatter.title }}</div>
            <div>{{ item.frontMatter.date }}</div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";
import { useData, withBase } from "vitepress";

const { theme } = useData();
const postsData = theme.value.posts;
const yearDate: any = {};
const yearInfo: any = {};


for (let item of postsData) {
  const date = item.frontMatter.date.slice(0,4);
  const layout = item.frontMatter.layout;

  console.log(date);
  // 隐藏layout为false的文章（但可以通过url访问）
  if (layout === false) {
    continue;
  }

  if (!yearDate[date]) {
    yearDate[date] = [];
  }
  
  yearDate[date].push(item);
}

console.log(yearDate,yearInfo);
</script>

<style lang="less" scoped>
.main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 20px;
  .archievs {
    width: 1000px;
    transition: all 0.5s linear;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    .arc {
      margin-bottom: 40px;
    }
    .archievsmain {
      width: 1000px;
      display: flex;
      justify-content: center;
      align-content: space-between;
      color: #74787a;
      transition: all 0.25s linear;
      a {
        width: 600px;
        display: flex;
        justify-content: space-between;
        color: #74787a;
        transition: all 0.5s linear;
        font-family: FangSong, Helvetica, Tahoma, Arial;
        cursor: pointer;
      }
      a:hover {
        color: #21373d;
      }

      
    }
    .archievsmain:hover {
      color: #21373d;
    }
  }
}

.yeartitle {
  margin-left: 200px;
  font-size: 130%;
  margin-bottom: 5px;
}

@media screen and (max-width: 680px) {
  .main {
    .archievs {
      .archievsmain {
        width: 30rem;
        a {
          width: 22rem;
        }
        .div {
          width: 20rem;
        }
      }
    }
  }
  .yeartitle {
    margin-left: 70px;
  }
}

@media (max-width: 480px) {
  .main {
    .archievs {
      .archievsmain {
        width: 15rem;
        .div {
          width: 15rem;
        }
      }
    }
  }
  .yeartitle {
    margin-left: 10px;
  }
}
</style>
