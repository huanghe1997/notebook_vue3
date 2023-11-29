import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    //路由初始指向
    path: '/',
    name: 'Home',
    component: () => import('../Home/index.vue'),
    redirect: '/notes',
    children: [
      {
        path: '/notes',
        name: 'Notes',
        component: () => import('../pages/Notes/index.vue'),
      },
      {
        path: '/addNote',
        name: 'AddNote',
        component: () => import('../pages/AddNote/index.vue'),
      },
      {
        path: '/searchNote',
        name: 'Search',
        component: () => import('../pages/Search/index.vue'),
      },
      {
        path: '/collect',
        name: 'Collect',
        component: () => import('../pages/Collect/index.vue'),
      },
      {
        path: '/notebook',
        name: 'NoteBook',
        component: () => import('../pages/NoteBook/index.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../Login/index.vue'),
  },
];
export default routes;
