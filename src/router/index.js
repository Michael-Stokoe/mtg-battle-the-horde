import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';

const routes = [
    {
       path: '/',
       name: 'home',
       component: HomePage
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;