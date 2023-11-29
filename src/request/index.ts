import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';

const requestInstance = axios.create({
  baseURL: '/api',
  timeout: 15000,
});
// 请求拦截器
requestInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('noteToken');
    token && config.headers.set('noteToken', token);
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

requestInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { status, data, headers } = response;
    if (status === 200) {
      //设置token
      if (headers.authorization) {
        localStorage.setItem('noteToken', headers.authorization);
      }
      return data;
    }
    ElMessage.error('登录失败');
    return response;
  },
  (error) => {
    console.log(error);

    const message = error?.message || '系统繁忙';
    ElMessage.error(message);
    return Promise.reject(error);
  },
);

export default requestInstance;
