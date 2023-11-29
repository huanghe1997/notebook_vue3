<template>
  <div class="container">
    <el-card style="width:100%">
      <el-row>
        <el-col :span="20">
          <br />
          <div style="display: flex;justify-content:center">
            <el-input style="width: 300px;" placeholder="输入查询字段" v-model:model-value="searchValue" clearable />
            <el-button type="success" style="margin-left: 50px;" @click="onSearch">查询</el-button>
            <el-button type="danger" @click="resetSearch">重置</el-button>
          </div>
        </el-col>
        <el-col :span="4" style="justify-content:center">
          <div style="display: flex;align-items:center">
            <b style="width: 100px;white-space:nowrap">{{ userMsgForm.userMsg.nickName }}</b>
            <el-dropdown style="padding:0px 10px" @command="(command) => switchModel(command)" ref="dropdown">
              <el-image class="imageStyle" :src="userMsgForm.userMsg.imageUrl">
                <template #error>
                  <el-icon size="100" color="#eeee">
                    <PictureFilled />
                  </el-icon>
                </template>
              </el-image>
              <template #dropdown>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="user" :icon="User">&nbsp;个人信息</el-dropdown-item>
                  <el-dropdown-item command="exit" :icon="Expand">&nbsp;退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>

        </el-col>

      </el-row>
    </el-card>
    <el-scrollbar style="width:100%;height:70vh;overflowX:hidden">
      <el-card class="cardBox">
        <NoteCard v-for="noteMessage in noteMessageReactive.NoteMessageList" :key="noteMessage.noteId"
          :noteMessage="noteMessage" />
      </el-card>

    </el-scrollbar>
    <el-dialog v-model="centerDialogVisible" title="个人信息" width="350px" :draggable="true">
      <el-form ref="formRef" :model="userMsgForm.userMsg" label-width="55px" :rules="rules">
        <el-form-item label="头像" prop="userImageUrl">
          <div style="display:flex;">
            <el-image :src="userMsgForm.userMsg.imageUrl"
              style="width: 50px;height:50px; border-radius: 50%;margin-bottom:10px;  border: 1px solid #a8a6a6;">
              <template #error>
                <el-icon style="width: 50px;height:50px" size="40" color="#eeee">
                  <PictureFilled />
                </el-icon>
              </template>
            </el-image>
            <span style="padding-left: 20px;">
              <el-upload :show-file-list="false" :before-upload="beforeAvatarUpload">
                <el-button size="small">
                  上传新头像
                </el-button>
              </el-upload>
              <p style="margin:0px;color:rgb(129, 127, 124);font-size:smaller">支持jpg/png格式,文件小于4M</p>
            </span>
          </div>
        </el-form-item>
        <el-form-item label="账号" prop="name" style="justify-content: left;">
          <span>{{ userMsgForm.userMsg.name }}</span>
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model.number="userMsgForm.userMsg.nickName" type="text" autocomplete="off" placeholder="最多可输入16个字"
            style="width:250px" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="userMsgForm.userMsg.sex">
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
            <el-radio label="0">保密</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="userMsgForm.userMsg.address" type="text" autocomplete="off" placeholder="最多可输入16个字"
            style="width:250px" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="centerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm(formRef)">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { getUser, updateUser } from '@/api/login';
import { getNotes, searchNotes } from '@/api/note';
import router from '@/router';
import {
  Expand,
  PictureFilled,
  User
} from '@element-plus/icons-vue';
import { ElMessage, type FormInstance, type FormRules, type UploadProps } from 'element-plus';
import debounce from 'lodash/debounce';
import { onMounted, reactive, ref } from 'vue';
import NoteCard from './NoteCard.vue';
import { NoteMessageProps } from './types';

type NoteMessageReactive = {
  NoteMessageList: NoteMessageProps[]
}
const noteMessageReactive = reactive<NoteMessageReactive>({
  NoteMessageList: []
});
const centerDialogVisible = ref(false);
const formRef = ref<FormInstance>();
const userMsgForm = reactive({
  userMsg: {
    id: 0,
    name: '',
    imageUrl: '',
    nickName: '',
    sex: '',
    address: "",
  }
});
const searchValue = ref('');
const checkNickName = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入昵称'));
  } else if (value && value.length > 16) {
    callback(new Error('昵称字段过长'));
  } else callback();
}
const checkSex = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请选择性别'));
  } else callback();
}
const checkAddress = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入地址'));
  } else if (value && value.length > 16) {
    callback(new Error('地址字段过长'));
  } else callback();
}
const rules = reactive<FormRules<typeof userMsgForm.userMsg>>({
  nickName: [{ validator: checkNickName, trigger: 'blur' }],
  sex: [{ validator: checkSex, trigger: 'change' }],
  address: [{ validator: checkAddress, trigger: 'blur' }],
})
const switchModel = (command: string) => {
  switch (command) {
    case 'user': centerDialogVisible.value = true; break;
    case 'exit': { router.push('/login'); localStorage.clear(); break; }
    default: break;
  }

}
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      let param = {
        ...userMsgForm.userMsg
      }
      const { data } = await updateUser(param);
      if (data) {
        ElMessage.success('修改成功！');
        setUser();
        centerDialogVisible.value = false
      }

    } else {
      ElMessage.error('修改失败！')
      return false
    }
  })
}
//上传图片组件->上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = async (rawFile: any) => {
  const maxSize = 2 * 1024 * 1024; // 2M
  //上传图片格式和大小要求  png|jpg  2M
  if (rawFile.type !== 'image/png' && rawFile.type !== 'image/jpg') {
    ElMessage.error('上传文件格式务必PNG|JPG')
    return false;
  } else if (rawFile.size > maxSize) {
    ElMessage.error('上传文件大小不能超过 2M');
    return false;
  } else {
    const reader = new FileReader();
    reader.readAsDataURL(rawFile);
    reader.onload = function () {
      userMsgForm.userMsg.imageUrl = reader.result as string;
    }
  }
  return false;
}
const setUser = async () => {
  let param = {
    userId: localStorage.getItem('userId') as unknown as number,
  }
  const { data } = await getUser(param);
  if (data) {
    userMsgForm.userMsg = { ...data };
  } else {
    ElMessage.error('未找到用户信息!');
  }
}
const fetchNoteMessages = async () => {
  const { data } = await getNotes();
  noteMessageReactive.NoteMessageList = { ...data }

};
const onSearch = () => {
  if (searchValue.value.length > 0) {
    const timeoutSearch = debounce(async function () {
      //发请求  
      let param = {
        searchValue: searchValue.value
      }
      const { data } = await searchNotes(param);
      if (data.length > 0) {
        noteMessageReactive.NoteMessageList = { ...data };
        searchValue.value = '';
      } else {
        ElMessage.warning("未查到相关内容");
      }
    }, 500);
    timeoutSearch();
  } else {
    ElMessage.error("请输入查询字段")
  }

}
const resetSearch = () => {
  fetchNoteMessages();
}
onMounted(() => {
  setUser();
  fetchNoteMessages();
})

</script>

<style scoped lang="less">
.container {
  /* 设置容器宽度 */
  /* 隐藏溢出部分 */
  display: flex;
  flex-direction: column;
  align-items: center;

  .cardBox {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: top;
    overflow-x: hidden;
  }
}

.imageStyle {
  width: 80px;
  height: 80px;
  cursor: pointer;
  border: 1px solid #eee;
  /* 定义渐变的分割方式 */
  border-radius: 10px;
  box-shadow: 1px 1px 10px 1px rgba(100, 100, 99, 0.5);

}

:global(.el-dialog__footer) {
  padding-right: 36px;
}

:global(.el-dialog__body) {
  padding: 2px 0px 2px 10px;
}

:deep(.el-form-item__content) {
  justify-self: left;
}
</style>