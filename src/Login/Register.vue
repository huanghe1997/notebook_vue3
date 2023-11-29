<template>
  <div class="content-login">
    <div class="content-login-info">
      <div class="content-title">注册</div>
      <el-form ref="registerFormRef" :model="registerForm" label-width="90px" status-icon :rules="rules">
        <el-form-item label="用户名:" prop="userName" style="margin: 25px;">
          <el-input v-model="registerForm.name" type="text" autocomplete="off" style="box-shadow: 0px;"
            placeholder="输入用户名" />
        </el-form-item>
        <el-form-item label="密码:" prop="password" style="margin: 25px;">
          <el-input v-model="registerForm.password" type="password" autocomplete="off" placeholder="输入密码" />
        </el-form-item>
        <el-form-item label="确认密码:" prop="enterPassword" style="margin: 25px;">
          <el-input v-model="registerForm.enterPassword" type="password" autocomplete="off" placeholder="输入密码" />
        </el-form-item>
      </el-form>
      <div style="margin: 26px;text-align:center; display:flex">
        <el-button type="info" @click="registerBtn(registerFormRef)" color="green"
          style="width: 150px;margin-left:80px">注册</el-button>
        <el-button type="primary" @click="returnLogin" style="width: 150px;margin-left:40px">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { registerUser } from '@/api/login';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
const emit = defineEmits(['toLogin']);
const registerFormRef = ref<FormInstance>();
const registerForm = reactive({
  name: '',
  password: '',
  enterPassword: '',
})

const validateName = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入用户名'))
  } else {
    callback()
  }
}
const validatePass = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (registerForm.enterPassword !== '') {
      if (!registerFormRef.value) return
      registerFormRef.value.validateField('enterPassword', () => null)
    }
    callback()
  }
}
const validateEnterPass = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error("两次输入的密码不匹配"))
  } else {
    callback()
  }
}
const rules = reactive<FormRules<typeof registerForm>>({
  name: [{ validator: validateName, trigger: 'blur' }],
  password: [{ validator: validatePass, trigger: 'blur' }],
  enterPassword: [{ validator: validateEnterPass, trigger: 'blur' }],
})
const registerBtn = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      let param = {
        name: registerForm.name,
        password: registerForm.password,
        enterPassword: registerForm.enterPassword,
      }
      const { code, data } = await registerUser(param);
      if (code === 1) {
        ElMessage.success(`${data}`);
        returnLogin();
      } else if (code === 2) {
        ElMessage.warning(`${data}`);
      } else {
        ElMessage.error(`${data}`);
      }

    } else {
      console.log('error submit!')
      return false
    }
  })
}
const returnLogin = () => {
  emit('toLogin', true)
}

</script>

<style scoped lang="less">
.content-title {
  text-align: center;
  font-size: 25px;
  color: #fff
}

/* .content-box{
  width: 550px;
  height: 400px;
  background: rgba(223,219,219,0.3);
  display: flex;
  justify-content: center;
  align-items: center;
} */
.content-login {
  width: 400px;
  height: 350px;
  background: rgba(223, 219, 219, 0.2);
  display: flex;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  box-shadow: 0 25px 35px rgba(0, 0, 0, 0.8);
}

.content-login-info {
  width: 90%;
}
</style>