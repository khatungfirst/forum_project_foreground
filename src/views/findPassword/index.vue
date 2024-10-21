<script setup>
import { ref, onMounted } from 'vue';
import { NForm, NFormItem, NInput, NButton } from 'naive-ui';
// import { Visibility } from '@vicons/ionicons5';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import { register, verify_code } from '../../config/apis/login';
const router = useRouter();
const formRef = ref(null);
const form = ref({
    email: '',
    password: '',
    verify_code: '',
    re_password: ''
});

const message = useMessage(); // 获取消息提示 API
// 局部注册 NIcon 组件和 Visibility 图标
// const icons = {
//     Visibility
// };

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

const sendVerify_code = async () => {
    if (!form.value.email) {
        message.error('请先输入邮箱地址');
        return;
    }
    try {
        const response = await verify_code(form.value.email);

        if (response.code === 2000) {
            message.success('验证码已发送，请检查您的邮箱');
        } else {
            message.error(`发送验证码失败: ${response.data.message}`);
        }
    } catch (error) {
        console.error('请求发送验证码失败:', error);
        message.error('请求发送验证码失败');
    }
};

const handleResister = async () => {
    try {
        await formRef.value.validate();
        console.log('注册', form.value);
        const response = await register(
            form.value.email,
            form.value.password,
            form.value.verify_code,
            form.value.re_password
        );
        if (response.code === 200 && response.data) {
            router.push('/login');
        } else {
            this.$message.error('注册失败:' + response.data.message);
        }
    } catch (errors) {
        console.error('注册失败', errors);
        this.$message.error('请检查表单错误');
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
            <span>找回密码</span>
        </div>
        <n-form ref="formRef" :model="form" :rules="rules" label-placement="top" @submit="handleLogin">
            <n-form-item label="邮箱" path="email">
                <n-input v-model:value="form.email" placeholder="请输入邮箱" class="common-input">
                    <template #suffix>
                        <span class="forgot-password-btn" @click="sendVerify_code">发送验证码</span>
                    </template>
                </n-input>
            </n-form-item>
            <n-form-item label="验证码" path="verify_code">
                <n-input v-model:value="form.verify_code" placeholder="请输入验证码" class="common-input"></n-input>
            </n-form-item>
            <n-form-item label="密码" path="password">
                <n-input v-model:value="form.password" placeholder="请输入密码" class="common-input"></n-input>
            </n-form-item>
            <n-form-item label="重复密码" path="re_password">
                <n-input
                    v-model:value="form.re_password"
                    type="password"
                    placeholder="请输入重复密码"
                    class="common-input"
                ></n-input>
            </n-form-item>
            <n-form-item>
                <div class="button-wrapper">
                    <n-button @click="handleResister" class="common-button">登陆</n-button>
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
    /* width: 100%; */
    margin-bottom: 25px;
    padding: 0px 135px;
}

.header {
    cursor: pointer;
    padding: 5px;
    font-size: 20px;
    font-weight: 500;
}

.header {
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
    width: 100%; /* 确保输入框占满容器宽度 */
    border-radius: 25px; /* 设置为边框的一半使输入框变为圆形 */
    padding: 2px 6px; /* 根据需要调整内边距 */
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
