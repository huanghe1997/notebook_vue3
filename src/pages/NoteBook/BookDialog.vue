<template>
  <el-dialog :model-value="dialogVisible" :title="isEdit ? '编辑笔记本' : '新增笔记本'" width="300px" draggable style="right: 15%;"
    @close="closeDialog">
    <el-form ref="formRef" :model="form" label-width="55px" class="demo-ruleForm" :validate-on-rule-change="false">
      <el-form-item label="名称:" prop="notebookName" :rules="[
        { required: true, message: '名称不能为空' },
      ]" style="margin-bottom: 10px;">
        <el-input v-model="form.notebookName" type="text" autocomplete="off" />
      </el-form-item>
      <el-form-item label="封面:" prop="notebookImageUrl">
        <el-upload class="avatar-uploader" :show-file-list="false" :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="form.notebookImageUrl" :src="form.notebookImageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item style="margin-bottom: 0px;">
        <el-button type="primary" @click.stop="closeDialog">取消</el-button>
        <el-button @click="submitForm(formRef)">保存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { addNotebook, updateNotebook } from '@/api/notebook';
import { Plus } from '@element-plus/icons-vue';
import { ElMessage, type FormInstance, type UploadProps } from 'element-plus';
import { reactive, ref, toRefs } from 'vue';
import { BookDialogType } from './types';
let props = defineProps<BookDialogType>();
const { dialogVisible, isEdit, formData } = toRefs(props);
let emit = defineEmits(["closeDialog", "freshNoteList"]);
const formRef = ref<FormInstance>();
const form = reactive(formData);
const closeDialog = () => {
  emit("closeDialog", false);
  formRef.value?.resetFields('notebookName');
  form.value.id = undefined;
  form.value.notebookName = undefined;
  form.value.notebookImageUrl = undefined;
}
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      if (isEdit.value) {
        const param = {
          notebookName: form.value.notebookName as string,
          notebookImageUrl: form.value.notebookImageUrl as string,
          userId: form.value.userId as number,
          id: form.value.id as number,
        }
        const { data } = await updateNotebook(param);
        if (data) {
          emit("freshNoteList");
          emit("closeDialog", false);
        } else {
          ElMessage.error("未作修改！")
        }
      } else if (!isEdit.value) {
        const param = {
          notebookName: form.value.notebookName as string,
          notebookImageUrl: form.value.notebookImageUrl as string,
          userId: form.value.userId,
        }
        const res = await addNotebook(param);
        if (res.data) {
          emit("freshNoteList");
          emit("closeDialog", false);
        }
      }
      if (!formEl) return
      formEl.resetFields();
    } else {
      console.log('error submit!')
      return false
    }
  })
}

//图片上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = () => {
  //图片上传成功,清除掉对应图片校验结果
  formRef.value?.clearValidate('imageUrl')
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
    //请求上传文件的接口
    const reader = new FileReader();
    reader.readAsDataURL(rawFile);
    reader.onload = function () {
      form.value.notebookImageUrl = reader.result as string;
    }
  }

  // 取消默认的上传请求
  return false;
}
</script>

<style scoped lang="less">
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

:global(.el-dialog__body) {
  padding: 5px 5px 0px 5px;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>