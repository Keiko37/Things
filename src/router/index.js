import { createRouter, createWebHistory } from 'vue-router';
import Desktop from '../views/Desktop.vue';

const routes = [
  {
    path: '/',
    name: 'Desktop',
    component: Desktop,
  },
  // {
  //   path: "/about",
  //   name: "About",
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue"),
  // },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
