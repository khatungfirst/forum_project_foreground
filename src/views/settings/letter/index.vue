<script setup lang="ts">
import { ref } from 'vue';
import { getLetterStatus, changeLetterStatus } from '@/config/apis/settings.ts';
import { useMessage } from 'naive-ui';

//用户id
const user_id = ref(0);

//定义私信设置选中项
const letterSelect = ref('');

//定义消息提示对象
const message = useMessage();

//定义私信设置的选择项
const letterArr = [
    {
        value: '所有人',
        label: '所有人'
    },
    {
        value: '粉丝',
        label: '粉丝'
    },
    {
        value: '我关注',
        label: '我关注'
    },
    {
        value: '关闭',
        label: '关闭'
    }
];

onMounted(async () => {
    const { data } = await getLetterStatus(user_id.value);
    if (data) {
        letterSelect.value = data.private_settings;
    }
});

//改变私信设置
const change = async () => {
    const obj = {
        id: user_id.value,
        private_settings: letterSelect.value
    };
    const { code } = await changeLetterStatus(obj);
    if (code) {
        message.success('私信设置成功');
    }
};
</script>
<template>
    <n-card title="私信设置">
        <template #header-extra></template>
        <span class="letter">允许给我</span>
        <n-radio-group v-model:value="letterSelect" name="radiogroup" @change="change">
            <n-space>
                <n-radio v-for="song in letterArr" :key="song.value" :value="song.value">
                    {{ song.label }}
                </n-radio>
            </n-space>
        </n-radio-group>
    </n-card>
</template>
<style scoped lang="scss">
@import '@/assets/styles/mixin.scss';
.n-card {
    height: 900px;

    .letter,
    .n-radio-group {
        margin: 20px 20px 0px 0px;
    }
}
@include headBorder;
</style>
