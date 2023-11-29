import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  //解决“vite use `--host` to expose”
  // base: '/', //不加打包后白屏
  server: {
    host: '0.0.0.0',
    port: 8080,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8081/api', //目标地址,这个目录里有api时，才需要重写
        changeOrigin: true, //是否换源
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    //别名配置，引用src路径下的东西可以通过@如：import Layout from '@/layout/index.vue'
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src'),
      },
    ],
  },
});
