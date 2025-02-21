<script setup>
import { ref, onMounted } from 'vue';
import { NForm, NFormItem, NInput, NButton } from 'naive-ui';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import { verify_code, register } from '../../config/apis/login';
import { useUserStore } from '@/config/store/userStore';
const router = useRouter();
const formRef = ref(null);
const form = ref({
    email: '',
    password: '',
    verify_code: '',
    re_password: ''
});
const isLogging = ref(false); // 控制登录按钮的状态
const message = useMessage(); // 获取消息提示 API
const userStore = useUserStore();
const rules = ref({
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { pattern: /^[^@\s]+@[^@\s]+\.(com|cn)$/, message: '请输入正确的邮箱', trigger: 'blur' }
    ],
    verify_code: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { min: 6, message: '验证码长度不得少于6位', trigger: 'blur' }
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
    ],
    re_password: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        {
            validator: (rule, value) => {
                if (value !== form.value.password) {
                    return new Error('两次输入的密码不一致');
                }
                return true;
            },
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

const countdown = ref(60); // 倒计时秒数
const isCounting = ref(false); // 是否正在倒计时

const sendVerify_code = async () => {
    if (!form.value.email) {
        message.error('请先输入邮箱地址');
        return;
    } else if (isCounting.value) {
        message.warning('验证码已发送, 请稍后再试');
        return;
    }
    startCountdown(); // 立即启动倒计时
    try {
        const email = form.value.email;
        const response = await verify_code({ email });
        if (response.code === 2000) {
            message.success('验证码已发送，请检查您的邮箱');
        } else {
            message.error(`发送验证码失败: ${response.data.message}`);
        }
    } catch (error) {
        console.error(error); // 打印错误对象到控制台
        if (error.response) {
            // 服务器有响应，但不是2xx的范围
            message.error(`请求发送验证码失败: ${error.response.status} ${error.response.data.message}`);
        } else if (error.request) {
            // 请求已发出，但没有收到响应
            message.error('请求发送验证码失败: 无响应');
        } else {
            // 在设置请求时出现了一些事情
            message.error('请求发送验证码失败: ' + error.message);
        }
    }
};

const startCountdown = () => {
    isCounting.value = true; // 开始倒计时
    const interval = setInterval(() => {
        if (countdown.value > 0) {
            countdown.value--;
        } else {
            clearInterval(interval);
            isCounting.value = false; // 倒计时结束
            countdown.value = 60; // 重置倒计时
        }
    }, 1000);
};

const handleResister = async () => {
    try {
        await formRef.value.validate();
        isLogging.value = true;

        const response = await register({
            email: form.value.email,
            password: form.value.password,
            verify_code: form.value.verify_code,
            re_password: form.value.re_password
        });

        if (response.code === 2000 && response.data) {
            message.success('注册成功！'); // 注册成功时显示提示
            isLogging.value = false; // 请求完成后，解除加载状态

            userStore.login(response.data); // 登录成功，调用 login 方法
            router.push('/choosetag');
        } else {
            message.error('注册失败：' + response.data.message);
        }
    } catch (errors) {
        console.error('注册失败', errors);
        message.error('请检查表单错误');
    }
};

onMounted(() => {
    // 可以在此处执行一些初始化逻辑
});
</script>

<template>
    <!-- <div class="login-container"> -->
    <!-- <div class="header">
            <span :class="{ active: currentRoute === '/login' }" @click="router.push('/login')">登录</span>
            <span :class="{ active: currentRoute === '/register' }" @click="router.push('/register')">注册</span>
        </div> -->
    <n-form ref="formRef" :model="form" :rules="rules" label-placement="top" @submit="handleResister">
        <n-form-item label="邮箱" path="email">
            <n-input v-model:value="form.email" placeholder="请输入邮箱" class="common-input">
                <template #suffix>
                    <span class="forgot-password-btn" @click="sendVerify_code">
                        {{ isCounting ? `${countdown}秒后重试` : '发送验证码' }}
                    </span>
                </template>
            </n-input>
        </n-form-item>
        <n-form-item label="验证码" path="verify_code">
            <n-input v-model:value="form.verify_code" placeholder="请输入验证码" class="common-input"></n-input>
        </n-form-item>
        <n-form-item label="密码" path="password">
            <n-input
                v-model:value="form.password"
                type="password"
                placeholder="请输入密码"
                class="common-input"
            ></n-input>
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
                <n-button @click="handleResister" class="common-button" :disabled="isLogging">
                    注册
                    <n-spin :size="12" v-if="isLogging"></n-spin>
                </n-button>
            </div>
        </n-form-item>
    </n-form>
    <!-- </div> -->
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
    cursor: pointer;
}
</style>
