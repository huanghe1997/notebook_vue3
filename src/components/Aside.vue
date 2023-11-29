<template>
  <div class="container">
    <el-icon color="gold" size="30" style="margin-top: 10%;">
      <Sunny />
    </el-icon>
    <el-menu style="background-color: none;">
      <div class="asideBox">
        <router-link :to="{
          name: 'AddNote'
        }" class="iconBox">
          <el-menu-item index="0">
            <el-tooltip content="新增笔记" placement="right">
              <el-icon size="25" color="green" style="margin-right: 0px;">
                <Plus />
              </el-icon>
            </el-tooltip>
          </el-menu-item>
        </router-link>

        <!-- <router-link :to="{
          name: 'Search'
        }">
          <el-menu-item index="1">
            <el-tooltip content="搜索笔记" placement="right">
              <el-icon size="25" style="margin-right: 0px;">
                <Search />
              </el-icon>
            </el-tooltip>
          </el-menu-item>
        </router-link> -->

        <router-link :to="{
          name: 'Notes'
        }">
          <el-menu-item style="margin-top: 20px;" index="2">
            <el-tooltip content="笔记" placement="right">
              <el-icon size="25" style="margin-right: 0px;">
                <List />
              </el-icon>
            </el-tooltip>
          </el-menu-item>
        </router-link>

        <router-link :to="{
          name: 'Collect'
        }">
          <el-menu-item index="3">
            <el-tooltip content="收藏" placement="right">
              <el-icon size="25">
                <StarFilled />
              </el-icon>
            </el-tooltip>
          </el-menu-item>
        </router-link>

        <router-link :to="{
          name: 'NoteBook'
        }">
          <el-menu-item index="4">
            <el-tooltip content="笔记本" placement="right">
              <el-icon size="25">
                <Memo />
              </el-icon>
            </el-tooltip>
          </el-menu-item>
        </router-link>
      </div>
    </el-menu>

  </div>
</template>

<script setup lang="ts">

import {
  List,
  Memo,
  Plus,
  StarFilled,
  Sunny
} from '@element-plus/icons-vue';

</script>

<style scoped lang="less">
.container {
  text-align: center;
  height: 100vh;
  background: #BE93C5;
  /* fallback for old browsers */
  background: -webkit-linear-gradient(to bottom, #7BC6CC, #BE93C5);
  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to bottom, #7BC6CC, #BE93C5);
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.asideBox {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.iconHoverCollect {
  margin-right: 0px;
  color: black;
}

:global(.el-menu) {
  background: none;
}
</style>