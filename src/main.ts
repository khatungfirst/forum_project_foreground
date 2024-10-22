/*
 * @Descripttion: 入口js
 * @version:
 * @Author: zhoukai
 * @Date: 2022-11-28 16:42:22
 * @LastEditors: zhoukai
 * @LastEditTime: 2023-03-27 09:49:09
 */
/** 重置样式 */
import '@/assets/css/reset.css';
import '@/assets/css/global.scss';
import 'uno.css';

import App from './App.vue';
// 导入router配置
import router from './packages/router';
// 导入全局自定义插件
import plugin from '@/resources/plugin';
import { useUserStore } from '../src/config/store/userStore';

const app = createApp(App);
app.use(plugin);
app.use(createPinia()); //创建一个 pinia 实例(根 store)并将其传递给应用
app.use(router);
const userStore = useUserStore();

// 只有当 token 存在时（不为 null），才设置到 userStore
if (localStorage.getItem('token')) {
    const token = localStorage.getItem('token');
    userStore.setToken(token!); // 使用非空断言操作符 (!) 来告诉 TypeScript 编译器 token 不会是 null
}
app.mount('#app');
