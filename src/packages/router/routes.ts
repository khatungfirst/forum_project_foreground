/*
 * @Descripttion: 读取config/roouter 所以路由配置
 * @version: 1.0.0
 * @Author: zhoukai
 * @Date: 2022-11-28 10:53:58
 * @LastEditors: zhoukai
 * @LastEditTime: 2022-11-28 14:12:26
 */
// import path = require('path');
import type { RouteRecordRaw } from 'vue-router';

// * 导入所有router
// * 处理路由
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const metaRouters: any = import.meta.glob('../../config/router/*.ts', { eager: true });

export const routerArray: RouteRecordRaw[] = [];
Object.keys(metaRouters).forEach((item) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.keys(metaRouters[item]).forEach((key: any) => {
        routerArray.push(...metaRouters[item][key]);
    });
});

//捕获404
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
const routers404: any = [
    {
        path: '/:pathMatch(.*)*',
        // redirect: '/404'
        component: () => import('../../views/errPage/err404.vue')
    }
];
const routes = [
    {
        path: '/login',
        component: () => import('../../views/login/index.vue')
    },
    {
        path: '/register',
        component: () => import('../../views/register/index.vue')
    },
    {
        path: '/findPassword',
        component: () => import('../../views/findPassword/index.vue')
    },
    {
        path: '/navigation',
        component: () => import('../../views/components/navigation/index.vue'),
        children: [
            {
                path: '/articledetail/:id',
                component: () => import('../../views/articleDetail/index.vue')
            },
            {
                path: '/transferPage',
                component: () => import('../../views/components/transferPage/index.vue')
            },
            {
                path: '/articlerelease/:id',
                component: () => import('../../views/articleRelease/index.vue')
            },
            {
                path: '/select',
                component: () => import('../../views/searchPage/index.vue')
            },
            {
                path: '/drawer',
                component: () => import('../../views/components/markdownViewer/index.vue')
            },
            {
                path: '/settings/:id',
                component: () => import('../../views/settings/index.vue')
            },
            {
                path: '/member/:id',
                component: () => import('../../views/memberCenter/index.vue')
            },
            {
                path: '/home',
                component: () => import('../../views/home/index.vue')
            },
            {
                path: '/tag',
                component: () => import('../../views/tag/index.vue')
            },
            {
                path: '/message',
                component: () => import('../../views/message/index.vue')
            }
        ]
    }
];
routerArray.push(...routers404);
routerArray.push(...routes);
console.log(routerArray);

export default routerArray;
