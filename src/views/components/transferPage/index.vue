<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

//定义路由对象
const router = useRouter();

//辨别是否继续倒计时
const flag = ref(0);

onMounted(() => {
    // 组件挂载后启动倒计时
    startCountdown();
});

//--------------------倒计时------------------------------

//定义距离回到首页的秒数
const seconds = ref(5);

//倒计时的方法
const startCountdown = () => {
    if (seconds.value > 0) {
        setTimeout(() => {
            seconds.value--; // 倒计时减1
            if (flag.value === 0) {
                startCountdown(); // 递归调用，直到剩余时间为0
            }
        }, 1000); // 每隔1秒更新一次
    }
    console.log('倒计时');

    if (seconds.value === 0) {
        router.push('/home');
    }
};

//-------------------回到首页 or 继续发布---------------------

//回到首页的点击事件
const back = () => {
    flag.value = 1;
    router.push('/home');
};

//继续发布的点击事件
const continuePublic = () => {
    console.log('重新发布');
    flag.value = 1;
    router.push('/articlerelease/0');
};
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
@use '@/assets/styles/mixin.scss' as *;
.wrap {
    width: 80%;
    margin: 0 auto;
    @include flex;
    flex-direction: column;
    position: relative;
    top: 13%;
    height: 85vh;
    background-color: #fff;
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
    img {
        width: 300px;
    }
}
</style>
