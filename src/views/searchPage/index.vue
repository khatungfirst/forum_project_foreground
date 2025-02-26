<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/config/store/userStore';
import author from '@/views/components/Author/index.vue';
import SearchMiddleBox from '@/views/searchPage/searchMiddleBox/index.vue';
import PublishButton from '@/views/components/PublishButton/index.vue';

const router = useRouter();

const userInfo = useUserStore();

//顶部标签选中
const category_id = ref('0');

//监听屏幕的宽度
const screenWidth = ref(0);

onMounted(() => {
    windowResizeHandler();
    window.addEventListener('resize', windowResizeHandler);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', windowResizeHandler);
});

const windowResizeHandler = () => {
    screenWidth.value = window.innerWidth;
};

//顶部标签页改变时的触发事件
const tabTop = (value: string) => {
    category_id.value = value;
};

//---------------------------游客模式----------------------
//控制登录组件的出现
const loginAppear = ref(false);

const triggerType = ref('');

const pubicArticle = () => {
    if (userInfo.token === '') {
        triggerType.value = '发布文章';
        loginAppear.value = true;
    } else {
        router.push(`/articlerelease/0`);
    }
};

const performOperation = () => {
    router.push(`/articlerelease/0`);
};

//关闭登录组件
const handleCloseAuthor = () => {
    loginAppear.value = false;
};
</script>
<template>
    <div class="wrap">
        <div class="overlay" v-if="loginAppear"></div>
        <author
            v-if="loginAppear"
            class="loginCom"
            :type="triggerType"
            @trigger-type="performOperation"
            @close-author="handleCloseAuthor"
        ></author>
        <div class="top-menu">
            <n-tabs
                type="line"
                animated
                @update:value="tabTop"
                v-model:value="category_id"
                :tabs-padding="screenWidth * 0.108"
            >
                <n-tab-pane name="0" tab="综合" style="font-size: 16px">
                    <SearchMiddleBox :category_id="category_id" class="aw" />
                </n-tab-pane>
                <n-tab-pane name="1" tab="前端" style="font-size: 16px">
                    <SearchMiddleBox :category_id="category_id" />
                </n-tab-pane>
                <n-tab-pane name="2" tab="后端" style="font-size: 16px">
                    <SearchMiddleBox :category_id="category_id" />
                </n-tab-pane>
            </n-tabs>
        </div>
        <div class="middle"></div>
        <PublishButton @click="pubicArticle"></PublishButton>
    </div>
</template>
<style scoped lang="scss">
@use '@/assets/styles/mixin.scss' as *;

.wrap {
    @include all;
    background-color: #fff;
    @include overlay;

    .loginCom {
        z-index: 999;
        position: fixed;
        left: 50%;
        top: 50px;
        transform: translateX(-50%);
        background-color: #fff;
    }
    .top-menu {
        width: 100%;
        background-color: #f2f3f5;
        border-radius: 5px;
        padding-top: 50px;

        .n-tabs :deep(.n-tabs-nav-scroll-content) {
            height: 50px;
            background-color: #fff;
        }
        .n-tabs :deep(.n-tabs-tab__label) {
            font-size: 16px;
        }
        .my-tab-f :deep(.n-tabs-nav) {
            background-color: #fff;
            padding: 0 calc(5%);
        }
    }
}
</style>
