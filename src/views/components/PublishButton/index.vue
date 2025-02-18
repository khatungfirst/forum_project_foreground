<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isHover = ref(false);

const handleReleaseArticle = () => {
    router.push({ path: '/articlerelease/0' }); // 路由跳转到发布文章页面
};
</script>

<template>
    <div class="publish">
        <div class="publish-icon-border" @click="handleReleaseArticle">
            <i class="iconfont icon-bianji"></i>
        </div>
        <n-button strong secondary round type="primary" class="button hide-button">
            <i class="iconfont icon-bianji"></i>
            <span class="publish-text">发文</span>
        </n-button>
    </div>
</template>

<style scoped>
.publish {
    position: fixed;
    right: 25px;
    bottom: 6px;
}

.publish-icon-border {
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    background-color: white;
    border-radius: 50%;
    margin-top: 20px;
    margin-left: 220px;
    cursor: pointer; /* 添加鼠标停显示为手型 */
    bottom: 71px;
    right: 78px;
}

.button {
    display: none;
}
.publish-icon-border:hover ~ .button {
    display: block; /* 鼠标悬停上时显示按钮 */
    position: absolute;
    top: -82px; /* 向上移动88px */
    left: 112px;
    transform: translateX(-50%); /* 水平居中 */
    opacity: 1; /* 文字不透明度 */
}

.iconfont.icon-bianji {
    font-size: 24px;
    color: #19a059;
}
/* .button {
    display: none;
    position: absolute;
    top: -65px;
    left: 180px;
    transform: translateX(-50%);
    opacity: 1;
} */

.publish-icon-border:hover .button {
    display: block;
}
</style>
