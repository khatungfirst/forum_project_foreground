<script setup lang="ts">
import { ref } from 'vue';
//定义分类下拉框中的内容
const typeOptions = ref([]);
//定义标签下拉框中的内容
const tagOptions = ref([]);
//定义用户选择的分类
const typeValue = ref('');
// 定义用户选择的标签
const tagVaule = ref('');
</script>
<template>
    <div class="publicCard">
        <div class="top">发布文章</div>
        <div class="contain">
            <n-select v-model:value="typeValue" :options="typeOptions" />
            <n-select v-model:value="tagVaule" :options="tagOptions" />
        </div>
    </div>
</template>
<style scoped lang="scss">
.n-select >>> .n-base-selection-label {
    width: 80%;
    border-radius: 50px;
}
.publicCard {
    width: 30%;
    height: 60vh;
    background-color: pink;
    z-index: 1000;

    .top {
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid rgb(200, 195, 195);
    }

    .contain {
        .n-select {
            width: 80%;
            border-radius: 50px !important;
        }
        .n-base-selection {
            border-radius: 10px !important;
        }
        ::v-deep(.n-select) {
            border-radius: 20px;
        }
    }
}
</style>
