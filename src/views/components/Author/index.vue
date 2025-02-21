<script setup>
import Login from '@/views/login/index.vue';
import Register from '@/views/register/index.vue';
import findPassword from '@/views/findPassword/index.vue';
import { ref } from 'vue';

// 当前激活的组件
const activeComponent = ref('login');
const ifShow = ref(true);
// 切换组件
const switchComponent = (component) => {
    activeComponent.value = component;
};

const closeAuthor = () => {
    ifShow.value = false;
};
</script>

<template>
    <div class="auth-container" v-if="ifShow">
        <div class="header" v-if="activeComponent !== `findPassword`">
            <span :class="{ active: activeComponent === 'login' }" @click="switchComponent('login')">登录</span>
            <span :class="{ active: activeComponent === 'register' }" @click="switchComponent('register')">注册</span>
            <!-- <span
                :class="{ active: activeComponent === 'forgot-password' }"
                @click="switchComponent('forgot-password')"
            >
                找回密码
            </span> -->
            <n-icon><i class="close-button iconfont icon-guanbi" @click="closeAuthor"></i></n-icon>
        </div>
        <!-- 动态加载组件 -->
        <component
            :is="activeComponent === 'login' ? Login : activeComponent === 'register' ? Register : findPassword"
            @switch-component="switchComponent"
            @close-popup="closeAuthor"
        ></component>
        <!-- 关闭按钮 -->
        <!-- <button > -->

        <!-- </button> -->
    </div>
</template>

<style scoped>
.auth-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 400px;
    margin: 200px auto;
    padding: 52px 0;
    border: 1px solid #ddd;
    border-radius: 3px;
    box-shadow: 0 3px 13px rgba(0, 0, 0, 0.5);
}

.header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 25px;
    padding: 0px 135px;
    position: relative; /* 添加相对定位，使绝对定位的关闭按钮能够相对于此容器定位 */
}

.header span {
    cursor: pointer;
    padding: 5px;
    font-size: 20px;
    font-weight: 500;
}

.header .active {
    top: 10px;
    color: #19a059 !important;
    text-decoration: underline !important;
    font-weight: 700 !important;
}

.close-button {
    position: absolute; /* 使用 absolute 定位 */
    top: -31px;
    right: -111px;
    cursor: pointer;
    z-index: 1000; /* 确保按钮在父容器内容之上 */
}
.icon-guanbi {
    font-size: 18px;
    color: #5c9e64;
}
</style>
