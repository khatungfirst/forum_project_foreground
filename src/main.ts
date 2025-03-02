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
import { useUserStore } from './config/store/userStore';

import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';
import createHighlightLinesPlugin from '@kangc/v-md-editor/lib/plugins/highlight-lines/index';
import '@kangc/v-md-editor/lib/plugins/highlight-lines/highlight-lines.css';
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';

import Prism from 'prismjs';

VueMarkdownEditor.use(vuepressTheme, {
  Prism,
});

VueMarkdownEditor.use(createLineNumbertPlugin());
VueMarkdownEditor.use(createHighlightLinesPlugin());
VueMarkdownEditor.use(createCopyCodePlugin());


const app = createApp(App);
app.use(plugin);
app.use(createPinia()); //创建一个 pinia 实例(根 store)并将其传递给应用
app.use(router);
app.use(VueMarkdownEditor);
const userStore = useUserStore();
userStore.init();
// const messageStore = useMessageStore();
// messageStore.initSSE();

// 销毁 SSE
// onUnmounted(() => {
//     messageStore.closeSSE(); // 销毁 SSE
// });
// 只有当 token 存在时（不为 null），才设置到 userStore
if (localStorage.getItem('token')) {
    const token = localStorage.getItem('token');
    userStore.setToken(token!); // 使用非空断言操作符 (!) 来告诉 TypeScript 编译器 token 不会是 null
}
app.mount('#app');
