<script lang="ts" setup>
import { ref } from 'vue';
import SearchMiddleBox from '@/views/searchPage/searchMiddleBox/index.vue';

//顶部标签选中
const category_id = ref('1');

//顶部标签页改变时的触发事件
const tabTop = (value: string) => {
    category_id.value = value;
};
</script>
<template>
    <div class="wrap">
        <div class="top-menu">
            <n-tabs type="line" animated @update:value="tabTop" v-model:value="category_id">
                <n-tab-pane name="1" tab="综合">
                    <SearchMiddleBox :category_id="category_id" />
                </n-tab-pane>
                <n-tab-pane name="2" tab="前端">
                    <SearchMiddleBox :category_id="category_id" />
                </n-tab-pane>
                <n-tab-pane name="3" tab="后端">
                    <SearchMiddleBox :category_id="category_id" />
                </n-tab-pane>
            </n-tabs>
        </div>
        <div class="middle"></div>
    </div>
</template>
<style scoped lang="scss">
@import '@/assets/styles/mixin.scss';
.wrap {
    @include all;
    background-color: #f2f3f5;
    .top-menu {
        width: 100%;
        height: 50px;
        background-color: #fff;

        .n-tabs {
            width: 70%;
            margin: 0 auto;
        }

        .n-tabs :deep(.n-tabs-nav-scroll-content) {
            height: 50px;
        }
    }

    .middle {
        width: 70%;
        height: 800px;
        background-color: #fff;
        margin: 15px auto;
    }
}
</style>
