<!-- <script lang="ts" setup>
import { ref } from 'vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const text = ref('# Hello Editor');
console.log(text);

//标题输入的数据
const title = ref('');
//计算标题的字数
const titleNUmber = computed(() => title.value.length);
</script>
<template>
    <div class="wrap">
        <div class="top">
            <input maxlength="30" placeholder="请输入标题" v-model="title" />
            <span>{{ titleNUmber }}/30</span>
            <div class="top-right">
                <n-button strong secondary round type="primary">发布</n-button>
                <span>ctrl+s保存草稿</span>
            </div>
        </div>
        <MdEditor v-model="text" style="height: 100%" />
    </div>
</template>
<style scoped lang="scss">
.wrap {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 1fr 18fr;
    overflow: hidden;

    .top {
        display: flex;
        align-items: center;
        span {
            color: #8a919f;
        }

        input {
            height: 40px;
            width: 80%;
            border: none !important;
            margin: 0px 60px;
        }

        .top-right {
            width: 20%;
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            padding-right: 20px;
            span {
                color: #9da4a8;
                font-size: 14px;
                margin-right: 15px;
            }

            .n-button {
                width: 80px;
                height: 30px;
            }
        }
    }
}
</style> -->
