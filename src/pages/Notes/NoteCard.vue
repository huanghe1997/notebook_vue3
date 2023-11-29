<template>
  <div class="cardStyle" body-style="padding:0px">
    <div>
      <el-image :src="noteMessage.imageUrl" class="nickImageStyle"></el-image>
      <el-image :src="noteMessage.notebookImageUrl" class="notebookImageStyle"></el-image>
      <span> &nbsp;&nbsp;{{ noteMessage.nickName }}</span>
      <span style="font-size: smaller;color:#aea6a6ee"> &nbsp;&nbsp;{{ formatDate(noteMessage.noteTime) }}</span>
      <p style="margin: 10px;font-size:large"><b>&nbsp;&nbsp;{{ noteMessage.noteTitle }}</b> </p>
    </div>
    <p style="margin: 0px;padding-top:15px;padding-left:59px;font-size:small">笔记分类:&nbsp;<b>{{ noteMessage.notebookName
    }}</b>
      <a style="cursor: pointer;padding-left:40px;color:brown" @click="drawer = true">查看笔记内容</a>
    </p>
  </div>
  <el-drawer v-model="drawer" :with-header="false" size="50%">
    <md-preview :model-value="noteMessage.noteMd"></md-preview>
  </el-drawer>
</template>

<script setup lang="ts" >
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import moment from 'moment';
import { ref } from 'vue';
import { NoteMessageProps } from './types';
type Props = {
  noteMessage: NoteMessageProps
}
const { noteMessage } = defineProps<Props>();
const drawer = ref(false);
const formatDate = (time: string | undefined) => {
  const formatTime = moment(time).format("yyyy-MM-DD");
  return formatTime;
}
</script>

<style scoped lang="less">
.cardStyle {
  padding: 10px;
  border-bottom: solid 1px #eeee;
  height: 100px;

  .notebookImageStyle {
    float: right;
    width: 100px;
    height: 100px;
    border: 2px solid #eeee;
    box-shadow: 1px 1px 10px 1px rgb(156, 154, 154);
  }

  .nickImageStyle {
    width: 50px;
    height: 50px;
    float: left;
    border-radius: 10%;
    border: 1px solid #e9e8e8;
    box-shadow: 1px 1px 10px 1px #9c9c9c;
  }
}
</style>