<template>
  <div>
    <div class="common-layout">
      <el-container>
        <el-aside width="5%" style="overflow:hidden">
          <Aside></Aside>
        </el-aside>
        <el-main style="padding: 1px;overflow:hidden">
          <RouterView></RouterView>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script setup lang="ts">
import Aside from '@/components/Aside.vue';
</script>

<style scoped></style>