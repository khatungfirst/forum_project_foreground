<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

//定义距离回到首页的秒数
const seconds = ref(5);

//定义路由对象
const router = useRouter();

//倒计时的方法
const startCountdown = () => {
    if (seconds.value > 0) {
        setTimeout(() => {
            seconds.value--; // 倒计时减1
            startCountdown(); // 递归调用，直到剩余时间为0
        }, 1000); // 每隔1秒更新一次
    }
    if (seconds.value === 0) {
        router.push('/articledetail');
    }
};

//回到首页的点击事件
const back = () => {
    router.push('/articledetail');
};

//继续发布的点击事件
const continuePublic = () => {
    router.push('/articlerelease/0');
};

onMounted(() => {
    // 组件挂载后启动倒计时
    startCountdown();
});
</script>
<template>
    <div class="wrap">
        <img src="@/assets/images/victory.png" alt="" />
        <p>发布成功 {{ seconds }}S后回到首页</p>
        <div class="button">
            <n-button strong secondary round type="primary" @click="back">回到首页</n-button>
            <n-button tertiary round type="primary" @click="continuePublic">继续发布</n-button>
        </div>
    </div>
</template>
<style scoped lang="scss">
@import '@/assets/styles/mixin.scss';
.wrap {
    @include flex;
    flex-direction: column;
    position: relative;
    top: 13%;
    p {
        font-size: 23px;
        color: #19a059;
        margin-bottom: 30px;
    }
    .button {
        .n-button {
            margin-right: 20px;
            width: 140px;
        }
    }
}
</style>
