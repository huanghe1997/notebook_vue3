import 'element-plus/dist/index.css';
import Particles from 'particles.vue3';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.less';
const app = createApp(App);
app.use(router).use(Particles).mount('#app');
