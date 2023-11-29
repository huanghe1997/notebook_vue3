<template>
  <div class="content">
    <Particles id="tsparticles" class="login-particles" :particlesInit="particlesInit" :particlesLoaded="particlesLoaded"
      :options="options" />
    <div class="content-login" v-if="isLogin">
      <div class="content-login-info">
        <div class="content-title">markdown在线编辑器</div>
        <el-form ref="loginFormRef" :model="loginForm" label-width="70px">
          <el-form-item label="用户名:" prop="userName" :rules="[
            { required: true, message: '请填写用户名' },
          ]" style="margin: 25px;">
            <el-input v-model="loginForm.userName" type="text" autocomplete="off" style="box-shadow: 0px;"
              placeholder="输入用户名" />
          </el-form-item>
          <el-form-item label="密码:" prop="password" :rules="[
            { required: true, message: '请填写密码' },
          ]" style="margin: 25px;">
            <el-input v-model="loginForm.password" type="password" autocomplete="off" placeholder="输入密码" />
          </el-form-item>
        </el-form>
        <div style="margin: 26px;text-align:center">
          <el-button type="info" @click="loginBtn(loginFormRef)" color="green"
            style="width: 150px;margin-left:80px">登录</el-button>
        </div>
        <div class="content-bottom">
          <div @click="topassword">忘记密码？</div>
          <div @click="toRegister">注册</div>
        </div>
      </div>
    </div>
    <!-- 注册界面 -->
    <Register v-if="!isLogin" @toLogin="toLogin"></Register>
  </div>
</template>
<script setup lang="ts">
import router from '@/router';
import { ElMessage, type FormInstance } from 'element-plus';
import { loadFull } from 'tsparticles';
import type { Engine } from 'tsparticles-engine';
import { reactive, ref } from 'vue';
import { loginUser } from '../api/login';
import Register from './Register.vue';
import options from './util.ts';
const loginFormRef = ref<FormInstance>()
const loginForm = reactive({
  userName: '',
  password: '',
})
const isLogin = ref<boolean>(true);//用于切换登录和注册页面
const loginBtn = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      let para = {
        name: loginForm.userName,
        password: loginForm.password,
      }
      const { data } = await loginUser(para);
      if (data) {
        localStorage.setItem("userId", data.id);
        router.push("/");
      } else {
        ElMessage.error("账户或密码错误")
      }

    } else {
      console.log('error submit!')
      return false;
    }
  })
}
const topassword = () => {
  ElMessage.warning('请联系管理员');
}
const toRegister = () => {
  isLogin.value = false;
}
const toLogin = (value: boolean) => {
  isLogin.value = value;
}
//查询账户是否存入数据库中
const particlesInit = async (engine: Engine) => {
  await loadFull(engine)
}
const particlesLoaded = async (_container: any) => {
  // console.log('Particles container loaded', container)
}

</script>
 
<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  background-image: url('../assets/background.jpg');
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-title {
  text-align: center;
  font-size: 25px;
  color: #fff;
}

.content-login {
  position: fixed;
  top: 26%;
  left: 36.5%;
  width: 400px;
  height: 300px;
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

.content-bottom {
  display: flex;
  justify-content: space-between;
  color: black;
  font-size: 17px
}

.content-bottom :hover {
  cursor: pointer;
}

:global(.el-input .el-input__wrapper) {
  box-shadow: 0px;
}
</style>
