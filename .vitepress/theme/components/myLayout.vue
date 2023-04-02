<template>
  <Layout></Layout>
  <footer id="foo">
    Copyright © 2019-2023 | the model from
    <a href="https://process1024.github.io/vitepress/"> vitepress </a>
    and
    <a href="https://github.com/clark-cui/vitepress-blog-zaun">
      vitepress-blog-zaun
    </a>
    | have a good time
  </footer>
</template>
<script lang="ts" setup>
import DefaultTheme from "vitepress/theme";
const { Layout } = DefaultTheme
</script>
<style lang="less" scoped>
#foo {
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
  cursor: help;
  font: 12px/150% Arial, Verdana, SimSun;
  a{
    color:#ff7007;
  }
}
</style>
