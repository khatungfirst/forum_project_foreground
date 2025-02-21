<script setup>
import Login from '@/views/login/index.vue';
import Register from '@/views/register/index.vue';
import findPassword from '@/views/findPassword/index.vue';
import { ref } from 'vue';

const props = defineProps({
    type: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['trigger-type']);

// 当前激活的组件
const activeComponent = ref('login');

// 切换组件
const switchComponent = (component) => {
    activeComponent.value = component;
};

const performOperation = (type) => {
    emit('trigger-type', type);
};
</script>

<template>
    <div class="auth-container">
        <div class="header" v-if="activeComponent !== `findPassword`">
            <span :class="{ active: activeComponent === 'login' }" @click="switchComponent('login')">登录</span>
            <span :class="{ active: activeComponent === 'register' }" @click="switchComponent('register')">注册</span>
            <!-- <span
                :class="{ active: activeComponent === 'forgot-password' }"
                @click="switchComponent('forgot-password')"
            >
                找回密码
            </span> -->
        </div>
        <!-- 动态加载组件 -->
        <component
            :is="activeComponent === 'login' ? Login : activeComponent === 'register' ? Register : findPassword"
            @switch-component="switchComponent"
            :type="props.type"
            @trigger-type="performOperation"
        ></component>
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
}

.header span {
    cursor: pointer;
    padding: 5px;
    font-size: 20px;
    font-weight: 500;
}

.header .active {
    color: #19a059 !important;
    text-decoration: underline !important;
    font-weight: 700 !important;
}
</style>
