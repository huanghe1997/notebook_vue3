<template>
  <div ref="container">
    <div class="headerBox" :style="modelStyle">
      <div style="font-size: 29px;">
        {{ noteReactive.note.noteTitle ? noteReactive.note.noteTitle : '标题' }}
        <span v-show="noteReactive.note.noteTitle">
          <el-select v-model="optionValue" placeholder="选择分类" clearable style="width: 100px;">
            <el-option v-for="item in noteReactive.options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </span>
      </div>
      <div>
        <el-tooltip content="计时" placement="bottom">
          <el-button circle plain type="info" @click="openTime">
            <el-icon size="large">
              <Timer />
            </el-icon>
          </el-button>
        </el-tooltip>
        <el-dropdown style="padding:0px 10px" @command="(command) => switchModel(command)">
          <el-button type="info">
            <el-icon>
              <Sort />
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="dark">暗黑模式</el-dropdown-item>
              <el-dropdown-item command="light">默认模式</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button plain type="success" @click.stop="submitNote">
          提交
        </el-button>
        <el-button plain @click="changHome" type="danger">
          取消
        </el-button>
      </div>
    </div>
    <el-card v-if="timeFlag"
      :style="`cursor:move;left:${divElement.elementName.elLeft}px;top:${divElement.elementName.elTop}px;`"
      body-style="padding:0px;" class="timeBox" id="box" draggable="true" @dragstart="(e) => dragStart(e)"
      @dragend="(e) => dragEnd(e)">
      <TimeControl @getTimeFlag="getTimeFlag"> </TimeControl>
    </el-card>
    <MdEditor v-model="noteReactive.note.noteMd" :preview="false" :theme="theme" class="mdBox" placeholder="填写标题"
      autoFocus inputBoxWitdh="50%" :scroll-auto="false" showToolbarName :on-save="(v, h) => onSave(v, h)"
      :toolbars="toolbar" />
  </div>
</template>

<script setup lang="ts">
import { addNote } from "@/api/note";
import { queryName } from "@/api/notebook";
import router from '@/router';
import { Sort, Timer } from '@element-plus/icons-vue/global';
import { ElMessage } from "element-plus";
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { computed, onMounted, reactive, ref } from 'vue';
import TimeControl from './TimeControl.vue';
import { NoteReactiveProps, toolbar } from './types';
export type Themes = 'light' | 'dark';



const theme = ref<Themes | undefined>('light');
const timeFlag = ref<boolean>(false);
let noteReactive = reactive<NoteReactiveProps>({
  note: {
    noteTitle: "",
    noteMd: "",
    userId: localStorage.getItem("userId") as unknown as number,
    notebookId: undefined,
    noteTime: undefined,//创建时间
  },
  options: undefined
});
let optionValue = ref<number | undefined>(undefined);
const container = ref();
const divElement = reactive({
  elementName: {
    initWidth: 0, // 父元素的宽-自适应值
    initHeight: 0, // 父元素的高-自适应值
    startclientX: 0, // 元素拖拽前距离浏览器的X轴位置
    startclientY: 0, //元素拖拽前距离浏览器的Y轴位置
    elLeft: 1000, // 元素的左偏移量
    elTop: 10, // 元素的右偏移量
  }
})
const openTime = () => {
  timeFlag.value = true;
}
const changHome = () => {
  router.push('/notes');
}
const getTimeFlag = (value: boolean) => {
  timeFlag.value = value;
}
const switchModel = (command: string) => {
  switch (command) {
    case 'dark': theme.value = 'dark'; break;
    case 'light': theme.value = 'light'; break;
    default: break;
  }
}
const modelStyle = computed(() => {
  return theme.value === 'light' ? { backgroundColor: 'white', color: 'black' } : { backgroundColor: 'black', color: 'white' };
})
const onSave = async (_v: string, h: Promise<string>) => {
  let h1 = await h;
  const array = h1.split('\n')
  if (array.length > 1) {
    const message = array[0];
    const match = />([^<]+)<\/h1>/.exec(message);
    if (match) {
      noteReactive.note.noteTitle = match[1];
    } else {
      noteReactive.note.noteTitle = '';
    }
  } else {
    noteReactive.note.noteTitle = '';
  }
}
const dragStart = (e: MouseEvent) => {
  console.log(e);
  divElement.elementName.startclientX = e.clientX;
  divElement.elementName.startclientY = e.clientY;
}
const dragEnd = (e: MouseEvent) => {
  let x = e.clientX - divElement.elementName.startclientX;
  let y = e.clientY - divElement.elementName.startclientY;
  divElement.elementName.elLeft += x;
  divElement.elementName.elTop += y;
}
const initBodySize = () => {
  divElement.elementName.elLeft = container.value.clientWidth * ((1080 * 0.88) / (1920 - 1080 * 0.02));
  divElement.elementName.elTop = container.value.clientHeight * ((1080 * 0.88 - 900) / (1920 - 1080 * 0.02));
}
const feacthNoteLabel = async () => {
  let param = {
    userId: localStorage.getItem("userId") as unknown as number,
  }
  const { data } = await queryName(param);
  let dealOptionsArray = [];
  for (let key in data) {
    dealOptionsArray.push({
      label: data[key],
      value: key
    })
  };
  noteReactive.options = dealOptionsArray;

}
const submitNote = async () => {
  let param = {
    noteTitle: noteReactive.note.noteTitle,
    noteMd: noteReactive.note.noteMd,
    userId: localStorage.getItem("userId") as unknown as number,
    notebookId: optionValue.value,
  };
  if (param.noteTitle && param.notebookId && param.userId) {
    const { data } = await addNote(param);
    if (data) {
      ElMessage.success("提交成功，即将跳转至笔记列表")
      router.push('/');
    }
  } else {
    ElMessage.error("请检查笔记标题和分类是否填写！")
  }

}
onMounted(() => {
  feacthNoteLabel();

  initBodySize();
})
</script>

<style scoped lang="less">
.headerBox {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.mdBox {
  height: 89vh;
}

.timeBox {
  background: #FC354C;
  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #0ABFBC, #FC354C);
  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #0ABFBC, #FC354C);
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  position: absolute;
  width: 250px;
  height: 136px;
  z-index: 1;
}
</style>