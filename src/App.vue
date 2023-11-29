<template>
  <el-config-provider :locale="zhCn">
    <div class="app">
      <router-view></router-view>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
</script>
<style scoped lang="less">
.app {
  height: 100vh;
}
</style>
