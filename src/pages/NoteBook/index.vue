<template>
  <div class="container">
    <el-card v-if="!switchNoteList" class="noteStyle" body-style="padding:0px">
      <div class="headerBox">
        <b>笔记本</b>
        <el-tooltip content="新增笔记本">
          <el-button type="default" style="padding: 5px;" circle @click="openDialog(false, null)">
            <el-icon size="large" color="green">
              <FolderAdd />
            </el-icon>
          </el-button>
        </el-tooltip>
      </div>
      <br />
      <el-input placeholder="查找笔记本" :prefix-icon="Search" clearable v-model="searchValue"
        style="padding: 0px 20px 0px 20px">
      </el-input>
      <el-divider border-style="double" style="margin-bottom: 0px;background-color:#eeee;" />
      <div class="noteBoxList">
        <div v-for="(notebook) in noteBookListReactive.notebookList" :key="notebook.id"
          @mouseenter="switchBackgroundColorEnter(notebook, 'rgb(64,188,108)')"
          @mouseleave="switchBackgroundColorLeave(notebook, '')" @click.stop="toNoteList(notebook)"
          :style="{ 'background-color': notebook.backgroundColor, cursor: 'pointer' }" class="itemBox">
          <span style="padding-left: 10px;min-width:100px;white-space:nowrap;overflow:hidden;
          text-overflow: ellipsis;">
            {{ notebook.notebookName }}
            <p style="margin: 5px 0 10px 0px;font-size:10px">{{ notebook.notebookCount
            }}&nbsp;条笔记</p>
          </span>
          <span v-if="notebook.showButton" style="padding-right: 20px;min-width:80px">
            <el-button :icon="Edit" type="info" plain circle @click.stop="openDialog(true, notebook)">
            </el-button>
            <el-button :icon="Delete" type="danger" plain circle @click.stop="deleteBook(notebook.id)">
            </el-button>
          </span>
        </div>
      </div>
    </el-card>
    <div v-if="!switchNoteList" style="width: 80%;" class="dataChartBox">
      <DataChart></DataChart>
    </div>

    <BookDialog v-model:dialogVisible="dialogVisible" :formData="formData" @closeDialog="closeDialog" :isEdit="isEdit"
      @freshNoteList="freshNoteList">
    </BookDialog>
    <div v-if="switchNoteList" class="noteBox">
      <NoteList :notebook="noteBookProps" @returnPage="returnPage"></NoteList>
    </div>
  </div>
</template>

<script setup lang="ts">
import { deleteNotebook, queryNotebooks } from '@/api/notebook';
import { Delete, Edit, FolderAdd, Search } from '@element-plus/icons-vue';
import debouce from 'lodash/debounce';
import 'md-editor-v3/lib/style.css';
import { onMounted, reactive, ref } from 'vue';
import BookDialog from './BookDialog.vue';
import DataChart from './DataChart.vue';
import NoteList from './NoteList.vue';
import { NotebookListType, NotebookType } from './types';

interface noteBookListReactiveProps {
  notebookList: NotebookListType[];
}
interface formDataProps {
  id: number | undefined;
  notebookName: string | undefined;
  notebookImageUrl: string | undefined;
  userId: number;
}
let userId = localStorage.getItem('userId');
let formData = reactive<formDataProps>({
  id: undefined,
  notebookName: undefined,
  notebookImageUrl: undefined,
  userId: userId as unknown as number,
})
const searchValue = ref<string>('');
let noteBookListReactive = reactive<noteBookListReactiveProps>({
  notebookList: []
})
let dialogVisible = ref(false);//控制弹窗显示
let isEdit = ref(false);
let switchNoteList = ref(false);//切换至笔记列表
let noteBookProps = reactive<NotebookType>({});//传递给NoteList的数据

const switchBackgroundColorEnter = (noteBook: NotebookListType, color: string) => {
  noteBook.backgroundColor = color;
  noteBook.showButton = true;
}
const switchBackgroundColorLeave = (noteBook: NotebookListType, color: string) => {
  noteBook.backgroundColor = color;
  noteBook.showButton = false;
}
const closeDialog = (value: boolean) => {
  formData.id = undefined;
  formData.notebookName = undefined;
  formData.notebookImageUrl = undefined;
  dialogVisible.value = value;
}
const returnPage = (value: boolean) => {
  switchNoteList.value = value;
}
const openDialog = (is: boolean, noteBook: any) => {
  isEdit.value = is;
  let notebookName, id, notebookImageUrl = null;
  if (noteBook) {
    notebookName = noteBook.notebookName;
    id = noteBook.id;
    notebookImageUrl = noteBook.notebookImageUrl;
  };
  if (is) {
    formData.notebookName = notebookName;
    formData.id = id;
    formData.notebookImageUrl = notebookImageUrl;
  }
  dialogVisible.value = true;
}
const toNoteList = (book: NotebookListType) => {
  const { id, notebookName, notebookImageUrl, notebookCount } = book;
  noteBookProps.notebookId = id;
  noteBookProps.notebookName = notebookName;
  noteBookProps.notebookImageUrl = notebookImageUrl;
  noteBookProps.notebookCount = notebookCount;//笔记条数先不写，等后期优化。
  switchNoteList.value = true;
}
const fetchNoteBookList = async () => {
  // const data = await queryNoteBookList(userId as unknown as number);
  let param = {
    userId: userId as unknown as number,
  }
  const { data } = await queryNotebooks(param);

  if (data) {
    let dealData = data?.map((item: any) => {
      return {
        ...item,
        backgroundColor: '',
        showButton: false,
      }
    })
    noteBookListReactive.notebookList = dealData;
  }
}
const deleteBook = async (id: number | undefined) => {
  let param = {
    id: id as number,
  }
  const { data } = await deleteNotebook(param);
  if (data) {
    const fetchTimeout = debouce(function () {
      fetchNoteBookList();
    }, 500);
    fetchTimeout();
  }

}
const freshNoteList = () => {
  fetchNoteBookList();
}
onMounted(async () => {
  fetchNoteBookList();
})
</script>

<style scoped lang="less">
.container {
  display: flex;
  height: 99vh;

  .noteStyle {
    border-radius: 0px;
    width: 20%;
    opacity: 0;
    /* 初始时设置不可见 */
    transform: translateX(-100%);
    /* 初始时将元素向左移动 100% 的宽度 */
    animation: slide-in 0.5s forwards;
    /* 使用关键帧动画，1s 是动画时长 */
  }

  @keyframes slide-in {
    to {
      opacity: 1;
      /* 动画结束时设置元素可见 */
      transform: translateX(0);
      /* 将元素还原到原始位置，从左到右滑动显示 */
    }
  }

  .headerBox {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px 0px 20px;
  }

  .noteBox {
    width: 100%;
  }
}

.noteBoxList {
  height: 86vh;
  overflow-y: scroll;
}

.itemBox {
  padding: 10px 0 0 0;
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid #eeee;
}

.dataChartBox {
  transform: translateX(200%);
  /* 初始时将元素向右移动 100% 的宽度 */
  animation: slide-in 1s forwards;
}

:global(.el-form-item__content) {
  justify-content: center;
}

:global(.el-dialog__body) {
  padding-bottom: 10px;
}
</style>