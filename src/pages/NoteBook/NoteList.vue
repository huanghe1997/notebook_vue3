<template>
  <div class="container">
    <div class="mainBox">
      <div class="imageBox">
        <el-image :src="notebook.notebookImageUrl" class="imageStyle" />
        <div class="contentBox">
          <b>{{ notebook.notebookName }}</b>
          <p style="font-size: 12px;">笔记总数：{{ notebook.notebookCount }}&nbsp;个</p>
          <el-button type="info" @click="returnPrePage">返回</el-button>
        </div>
      </div>
      <el-divider border-style="double" style="margin: 0px;background-color:#eeee;" />
      <el-card body-style="padding:0px" class="noteListBox">
        <div v-for="(note) in noteListReactive.noteList" :key="note.id"
          @mouseenter.stop="switchBackgroundColorEnter(note, 'rgb(64,188,108)')"
          @mouseleave.stop="switchBackgroundColorLeave(note, '')" class="itemBox"
          :style="{ 'background-color': note.backgroundColor, cursor: 'pointer' }"
          @click.prevent="deliverMdMessage(note)">
          <span style="padding-left: 10px;">
            <b>{{ note.noteTitle }}</b>
            <p style="margin: 5px 0 10px 0px;font-size:10px">创建时间: {{ filterDate(note.noteTime) }}</p>
          </span>
          <el-button :icon="Delete" type="danger" plain style="margin-right: 20px;" v-if="note.showButton"
            @click.stop="onDeleteNote(note.id as number)">
          </el-button>
        </div>
      </el-card>
    </div>
    <div class="mdBox">
      <div class="titleBox">
        <b style="font-size: 19px;">{{ currentNote.currentNoteTitle }}</b>
        <div>
          <el-tooltip content="编辑">
            <el-button :icon="Edit" type="primary" plain @click="toEdit">
            </el-button>
          </el-tooltip>
          <el-tooltip content="取消编辑">
            <el-button :icon="CloseBold" type="danger" plain @click="onCancel" v-show="isEditable">
            </el-button>
          </el-tooltip>
          <el-tooltip content="提交">
            <el-button :icon="CircleCheck" type="success" plain @click.stop="onSave" v-show="isEditable">
            </el-button>
          </el-tooltip>
        </div>
      </div>
      <MdEditor v-model="currentNote.currentNoteMd" :on-save="(v, h) => onSaveTitle(v, h)"
        :toolbars="toolbarsTool.toolbars" :inputBoxWitdh="inputBoxWitdh" style="height: 100vh;" :preview="true">
      </MdEditor>
    </div>
  </div>
</template>

<script setup lang="ts">
import { deleteNote, queryNoteList, updateNote } from '@/api/note';
import { CircleCheck, CloseBold, Delete, Edit } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import debouce from 'lodash/debounce';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import moment from 'moment';
import { onMounted, reactive, ref, toRefs } from 'vue';
import { NoteListProps, toolbarsToolProps, tools } from './types';

interface NoteProps {
  id?: number,
  noteMd?: string,
  noteTitle?: string,
  noteTime?: number,
  backgroundColor?: string,
  showButton: boolean,
}
interface NoteListReactiveProps {
  noteList?: NoteProps[],
}
let props = defineProps<NoteListProps>();
const { notebook } = toRefs(props);
let emit = defineEmits(["returnPage"]);
const noteListReactive = reactive<NoteListReactiveProps>({});
const currentNote = reactive({
  id: 0,
  currentNoteMd: '',
  currentNoteTitle: '',
  currentNoteTime: '',
  userId: 0,
  notebookId: 0,
});
const toolbarsTool = reactive<toolbarsToolProps>({
  toolbars: ['=', '-', 'catalog']
});//工具栏
const inputBoxWitdh = ref<string>('0%');
const isEditable = ref<boolean>(false);
const switchBackgroundColorEnter = (note: any, color: string) => {
  note.backgroundColor = color;
  note.showButton = true;
};
const switchBackgroundColorLeave = (note: any, color: string) => {
  note.backgroundColor = color;
  note.showButton = false;
};
const filterDate = (time: number | undefined) => {
  let filterTime = moment(time).format('YYYY-MM-DD');
  return filterTime;
}

const returnPrePage = () => {
  emit('returnPage', false)
}
const deliverMdMessage = (note: any) => {
  currentNote.currentNoteMd = note.noteMd;
  currentNote.id = note.id;
  currentNote.currentNoteTitle = note.noteTitle;
  currentNote.userId = note.userId;
  currentNote.notebookId = note.notebookId;
}
const toEdit = () => {
  isEditable.value = true;
  inputBoxWitdh.value = '50%';
  toolbarsTool.toolbars = tools;
}
const onSave = async () => {
  const { currentNoteMd, currentNoteTitle, id, notebookId, userId } = currentNote;
  let param = {
    id,
    noteTitle: currentNoteTitle,
    noteMd: currentNoteMd,
    userId: userId,
    notebookId: notebookId
  }
  const { data } = await updateNote(param);
  if (data) {
    ElMessage.success("笔记修改成功");
    isEditable.value = false;
    inputBoxWitdh.value = '0%';
    toolbarsTool.toolbars = ['=', '-', 'catalog'];
    const timeoutFetchData = debouce(function () {
      fetchData();
    }, 300);
    timeoutFetchData();
  } else {
    ElMessage.error("笔记修改失败");
  }
}
const onSaveTitle = async (_v: string, h: Promise<string>) => {
  let h1 = await h;
  const array = h1.split('\n')
  if (array.length > 1) {
    const message = array[0];
    const match = />([^<]+)<\/h1>/.exec(message);
    if (match) {
      currentNote.currentNoteTitle = match[1];
    } else {
      ElMessage.error("请正确填写文章标题");
      currentNote.currentNoteTitle = '';
    }
  } else {
    ElMessage.error("请正确填写文章标题");
    currentNote.currentNoteTitle = '';
  }
}
const onCancel = () => {
  isEditable.value = false;
  inputBoxWitdh.value = '0%';
  toolbarsTool.toolbars = ['=', '-', 'catalog'];
}
const onDeleteNote = async (id: number) => {
  let param = {
    id
  };
  const { data } = await deleteNote(param);
  if (data) {
    const fetchTimeout = debouce(function () {
      fetchData();
    }, 500);
    fetchTimeout();
  }

}
const fetchData = async () => {
  if (notebook) {
    //发请求
    let param = {
      userId: localStorage.getItem('userId') as unknown as number,
      notebookId: notebook.value.notebookId as number,
    }
    let { data } = await queryNoteList(param);
    if (data.length > 0) {
      let dealData = data.map((note: any) => {
        return {
          ...note,
          backgroundColor: '',
          showButton: false,
        }
      });
      noteListReactive.noteList = dealData;
      currentNote.currentNoteMd = dealData[0].noteMd;
      currentNote.currentNoteTitle = dealData[0].noteTitle;
      currentNote.currentNoteTime = dealData[0].noteTime;
      currentNote.id = dealData[0].id;
      currentNote.notebookId = dealData[0].notebookId;
      currentNote.userId = dealData[0].userId;
    } else {
      ElMessage.warning("暂无笔记信息");
      noteListReactive.noteList = undefined;
      currentNote.currentNoteMd = '';
      currentNote.currentNoteTitle = '';
      currentNote.currentNoteTime = '';
      currentNote.id = -1;
    }

  }
}
onMounted(() => {
  fetchData();
})
</script>

<style scoped lang="less">
.container {
  display: flex;
  width: 100%;

  .mainBox {
    width: 20%;
    height: 100vh;
    opacity: 0;
    /* 初始时设置不可见 */
    transform: translateX(-100%);
    /* 初始时将元素向左移动 100% 的宽度 */
    animation: slide-in 0.5s forwards;
  }

  @keyframes slide-in {
    to {
      opacity: 1;
      /* 动画结束时设置元素可见 */
      transform: translateX(0);
      /* 将元素还原到原始位置，从左到右滑动显示 */
    }
  }

  .mdBox {
    width: 80%;
    display: flex;
    flex-direction: column;
    height: 100vh;

    .titleBox {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      padding: 10px;
    }
  }
}

.imageBox {
  width: 100%;
  display: flex;

  .imageStyle {
    width: 100px;
    height: 100px;
    border: 2px solid #ecb2b2;
    margin: 10px;
    box-shadow: 1px 1px 10px 2px #e2afaf;
  }

  .contentBox {
    display: flex;
    flex-direction: column;
    padding: 10px 0px 0px 30px;
    font-size: 19px;
    min-width: 100px;
  }
}

.noteListBox {
  height: 80vh;
  overflow-y: scroll;

  .itemBox {
    padding: 10px 0 0 0;
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid #eeee;
  }
}
</style>