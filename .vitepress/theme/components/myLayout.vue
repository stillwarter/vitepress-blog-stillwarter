<template>
  <Layout></Layout>
  <footer id="foo">
    <div class="busuanzi">
      <span id="busuanzi_container_site_pv" style="display: none">
        本站总访问量
        <span ref="sitepv" id="busuanzi_value_site_pv"></span>次
        <span class="post-meta-divider">|</span>
      </span>
      <span id="busuanzi_container_site_uv" style="display: none">
        本站访客数
        <span id="busuanzi_value_site_uv"></span>人
      </span>
    </div>

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
import bsz from "busuanzi.pure.js";
import { onMounted, ref } from "vue";
const { Layout } = DefaultTheme;
// console.log(bsz);

bsz

</script>
<style lang="less" scoped>
#foo {
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
  cursor: help;
  z-index:-1;
  font: 12px/150% Arial, Verdana, SimSun;
  a {
    color: #ff7007;
  }
}
</style>
