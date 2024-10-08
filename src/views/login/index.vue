<script setup>
import { ref, onMounted } from 'vue';
import { NForm, NFormItem, NInput, NButton } from 'naive-ui';
import { useRouter } from 'vue-router';
import { login } from '../../config/apis/login';
import { useMessage } from 'naive-ui';
const router = useRouter();
const formRef = ref(null);
const form = ref({
    email: '',
    password: ''
});
const message = useMessage(); // 获取消息提示 API
const rules = ref({
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { pattern: /^[^@\s]+@[^@\s]+\.(com|cn)$/, message: '请输入正确的邮箱', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 8, message: '密码长度不得少于8位', trigger: 'blur' },
        {
            pattern:
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|\\:;"'<>,.?/])[A-Za-z\d!@#$%^&*()_+\-=\[\]{}|\\:;"'<>,.?/]{8,}$/,
            message: '密码必须包含字母、数字和特殊符号',
            trigger: 'blur'
        }
    ]
});

const currentRoute = ref(router.currentRoute.value.path); // 使用响应式引用来存储当前路由

// 使用 watchEffect 来响应路由变化
watch(
    () => router.currentRoute.value.path,
    (newPath) => {
        currentRoute.value = newPath;
    }
);

const handleLogin = async () => {
    try {
        await formRef.value.validate();
        console.log('登录', form.value);
        const response = await login(form.value.email, form.value.password);
        if (response.code === 2000 && response.data) {
            router.push('/home');
        } else {
            message.error('登录失败: ' + response.data.message);
        }
    } catch (errors) {
        console.error('验证失败', errors);
        message.error('请检查表单错误');
    }
};

// const goToRegister = () => {
//     router.push('/register');
// };

onMounted(() => {
    // 可以在此处执行一些初始化逻辑
});
</script>

<template>
    <div class="login-container">
        <div class="header">
            <span :class="{ active: currentRoute === '/login' }" @click="router.push('/login')">登录</span>
            <span :class="{ active: currentRoute === '/register' }" @click="router.push('/register')">注册</span>
        </div>
        <n-form ref="formRef" :model="form" :rules="rules" label-placement="top" @submit="handleLogin">
            <n-form-item label="邮箱" path="email">
                <n-input v-model:value="form.email" placeholder="请输入邮箱" class="common-input"></n-input>
            </n-form-item>
            <n-form-item label="密码" path="password">
                <n-input v-model:value="form.password" type="password" placeholder="请输入密码" class="common-input">
                    <template #suffix>
                        <span class="forgot-password-btn" @click="router.push('/findPassword')">忘记密码</span>
                    </template>
                </n-input>
            </n-form-item>
            <n-form-item>
                <div class="button-wrapper">
                    <n-button @click="handleLogin" class="common-button">登陆</n-button>
                </div>
            </n-form-item>
        </n-form>
        <!-- <div class="register" @click="goToRegister">
            <n-button class="common-button">注册</n-button>
        </div> -->
    </div>
</template>

<style scoped>
.login-container {
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

.n-form {
    width: 290px;
}

.n-form-item {
    margin-bottom: 6px;
    box-sizing: border-box;
    width: 100%;
}

.button-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
}

.common-button {
    width: 100%;
    /* margin-top: 20px; */
    background-color: #c5e2d4 !important;
    color: #19a059;
    border: none;
    padding: 10px 20px;
    border-radius: 25px;
    cursor: pointer;
}

.register {
    display: flex;
    justify-content: center;
    width: 100%;
}

.common-input {
    width: 100%;
    /* 确保输入框占满容器宽度 */
    border-radius: 25px;
    /* 设置为边框的一半使输入框变为圆形 */
    padding: 2px 6px;
    /* 根据需要调整内边距 */
}

.login-container::after {
    content: '';
    display: table;
    clear: both;
}

.forgot-password-btn {
    color: #19a059;
}
</style>
