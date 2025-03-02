/*
 * @Descripttion: router构造
 * @version: 1.0.0
 * @Author: zhoukai
 * @Date: 2022-11-28 15:52:00
 * @LastEditors: zhoukai
 * @LastEditTime: 2022-11-29 14:23:38
 */
import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import { useUserStore } from '../../config/store/userStore';
import NProgress from 'nprogress';
// NProgress樣式
import 'nprogress/nprogress.css';
// 配置NProgress进度条选项 —— 进度环显示隐藏
NProgress.configure({ showSpinner: false });

const router = createRouter({
    history: createWebHistory(),
    routes
});

// 定义路由守卫
router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();

    if (to.meta.requiresAuth) {
        if (!userStore.isLogin) {
            next('/home'); // 用户未登录，重定向到首页
        } else {
            next(); // 用户已登录，允许访问
        }
    } else {
        next(); // 不需要登录，允许访问
    }
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.afterEach((to) => {
    // 关闭NProgress（router 切换 loading）
    NProgress.done();
});

export default router;
