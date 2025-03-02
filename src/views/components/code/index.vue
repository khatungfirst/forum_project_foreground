<script setup lang="ts">
// debugger;
import { ref } from 'vue';

const contents = ref('## 哇 真的是你呀 哈哈 哎呀\n # 全名制作人们大家好，我是练习时长两年半的个人练习生蔡徐坤，喜欢唱、跳、rap、篮球，music\n ```javascript \n console.log("hello,world!!!!! ")\n```');
const handleCopyCodeSuccess = () => {
    console.log('复制');
};
</script>
<template>
    <div class="wrap">
        <v-md-editor v-model="contents" mode="preview"  @copy-code-success="handleCopyCodeSuccess"></v-md-editor>
    </div>
</template>
<style lang="scss">
.wrap {
    width: 100%;
    margin-top: 100px;
}
</style>
