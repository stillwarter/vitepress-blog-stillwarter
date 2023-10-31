<template>
  <div></div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { myengineInit } from "./main.js";
onMounted(() => {
  myengineInit();
});
</script>

<style lang="less" scoped></style>
