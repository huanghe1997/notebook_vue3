import { ElMessage } from 'element-plus';
import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('noteToken');
  if (to.name !== 'Login' && !token) {
    ElMessage.error('请先登录');
    next({ name: 'Login' });
  } else next();
});
export default router;
