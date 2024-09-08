/*
 * @Descripttion: 读取config/roouter 所以路由配置
 * @version: 1.0.0
 * @Author: zhoukai
 * @Date: 2022-11-28 10:53:58
 * @LastEditors: zhoukai
 * @LastEditTime: 2022-11-28 14:12:26
 */
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
        component: () => import('@/views/errPage/err404.vue')
    }
];
const routes = [
    {
        path: '/articledetail',
        component: () => import('@/views/articleDetail/index.vue')
    },
    {
        path: '/drawer',
        component: () => import('@/views/components/commentDrawer/index.vue')
    },
    {
        path: '/articlerelease',
        component: () => import('@/views/articleRelease/index.vue')
    }
];
routerArray.push(...routers404);
routerArray.push(...routes);
console.log(routerArray);

export default routerArray;
