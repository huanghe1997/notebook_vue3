<template>
  <div class="container">
    <el-calendar>
      <template #date-cell="{ data }" style="overflow-y: scroll;">
        <el-row :class="data.isSelected ? 'is-selected' : 'sds'" class="taskListBox">
          {{ data.day.split('-').slice(1).join('-') }}
          {{ data.isSelected ? '✔️' : '' }}
          <el-tooltip content="添加任务" placement="right">
            <a @click.stop="addTask(data.day)" class="buttonBox">
              <el-icon color="rgb(108, 106, 106)" size="" style="border: 1px solid #d3cece;border-radius:50%">
                <Plus />
              </el-icon>
            </a>
          </el-tooltip>

        </el-row>

        <el-scrollbar style="height:65px;padding-top:2px">
          <el-row v-for="(task) in textContent(data.day)" :key="task.id" style="padding: 1px;">
            <el-tooltip content="点击完成任务" placement="right" :auto-close="1000" :show-after="200">
              <a @click.stop="deleteTask(task.id)">
                <el-tag type="info" class="tag" color="rgb(64, 188, 108)">
                  <span style="color: black;">{{ task.taskName }}</span>
                </el-tag>
              </a>
            </el-tooltip>
          </el-row>
        </el-scrollbar>
      </template>
    </el-calendar>
    <div v-if="state.openInput" class="inputBoxStyle">
      <p style="margin: 5px;">任务名称:</p>
      <el-input class="inputStyle" type="text" placeholder="不超过10个字" v-model="state.currentInputValue"></el-input>
      <el-button type="info" style="margin-left: 10px;" @click.stop="cancelTask">取消</el-button>
      <el-button type="success" @click.stop="saveTask">保存</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getTasks, insertTask, removeTask } from "@/api/task";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { onMounted, reactive } from "vue";
import { taskReactiveProps } from "./types";
const state = reactive<taskReactiveProps>({
  openInput: false,
  //测试数据
  tasks: [

  ],
  //当前新增任务传递的日期
  currentDate: '',
  currentInputValue: ''
});
const addTask = (date: string) => {
  state.currentDate = date;
  state.openInput = true;
};
//删除任务字段
const deleteTask = async (id: number) => {
  const { data } = await removeTask({ id });
  if (data) {
    ElMessage.success("删除成功!")
    getTaskList();
  }


};
//取消保存任务字段
const cancelTask = () => {
  state.openInput = false;
  state.currentInputValue = '';
}
const saveTask = async () => {
  if (state.currentDate && state.currentInputValue) {
    let param = {
      userId: localStorage.getItem("userId") as unknown as number,
      taskName: state.currentInputValue,
      day: state.currentDate
    }
    const { data } = await insertTask(param);
    if (data) {
      ElMessage.success("添加任务成功");
      state.openInput = false;
      //查询
      getTaskList();
      state.currentInputValue = '';
    } else {
      ElMessage.error("添加失败!")
    }
  }
}
const getTaskList = async () => {
  const res = await getTasks({ userId: localStorage.getItem("userId") as unknown as number });
  if (res.data) {
    let fetchTasks = res.data.map((item: { id: number; day: string; taskName: string }) => {
      return {
        id: item.id as number,
        day: item.day as string,
        taskName: item.taskName as string,
      }
    })
    state.tasks = fetchTasks;
  }
}
//处理日期获取后台数据动态渲染上去
const textContent = (date: string) => {
  //当前date是拿到上面日历组件当前的日期值 根据该值去筛选测试数据找到对应各个日期下对应的数据return出去
  return state.tasks.filter((item) => {
    return date === item.day;
  });
};
onMounted(() => {
  getTaskList();
})
</script>

<style scoped lang="less">
.container {
  display: flex;
  flex-direction: column;
}


.is-selected {
  color: #1989fa;
}

:deep(.el-calendar__body) {
  padding: 4px 20px 4px;
}


:deep(.el-calendar-table thead th) {
  color: rgb(64, 188, 108);
  font-weight: bold;
  font-size: 25px;
}

.tag {
  display: flex;
  align-items: center;
  height: 20px;
  justify-content: center;
}



:deep(.el-calendar-table .el-calendar-day:hover) {
  background-color: rgba(156, 224, 180, 0.8);
}

:deep(.el-calendar) {
  --el-calendar-selected-bg-color: rgba(145, 218, 170, 0.8);
}

:deep(.el-calendar) {
  --el-calendar-cell-width: 100px;
}

:deep(.el-calendar__header) {
  justify-content: center;
}

.taskListBox {
  .buttonBox {
    position: absolute;
    top: 1px;
    right: 8px;
  }
}

.inputBoxStyle {

  opacity: 0.9;
  justify-content: left;
  align-items: left;
  display: flex;
  padding-left: 15px;

  .inputStyle {
    width: 150px;
    height: 30px;
  }
}
</style>