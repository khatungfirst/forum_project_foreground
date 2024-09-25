<script setup lang="ts">
import { reactive, ref } from 'vue';
import { getNumberData } from '@/config/apis/settings.ts';
import { changeNumberData } from '@/config/apis/settings.ts';
import type { InputInst } from 'naive-ui';
import { useMessage } from 'naive-ui';

//获取到微博输入框
const weiboInputInstRef = ref<InputInst | null>(null);

///微博输入框是否禁用
const weiboStatus = ref(true);

//获取到GitHub输入框
const githubInputInstRef = ref<InputInst | null>(null);

///GitHub输入框是否禁用
const githubStatus = ref(true);

//获取到密码输入框
const passwordInputInstRef = ref<InputInst | null>(null);

///密码输入框是否禁用
const passwordStatus = ref(true);

//定义消息提示对象
const message = useMessage();

//账号设置的各个属性
const numberSettings = reactive({
    id: 0,
    email: '',
    blog_linkblog_link: '',
    weibo_link: '',
    github_link: '',
    password: ''
});

onMounted(async () => {
    const { data } = await getNumberData(numberSettings.id);
    //把data中的属性值复制给numberSettings
    Object.assign(numberSettings, data);
    // numberSettings = data;
});

//获取焦点后编辑信息
const handleFocus = (e) => {
    if (e === 'weibo_link') {
        weiboInputInstRef.value?.focus();
        weiboStatus.value = false;
    } else if (e === 'github_link') {
        githubInputInstRef.value?.focus();
        githubStatus.value = false;
    } else {
        passwordInputInstRef.value?.focus();
        passwordStatus.value = false;
    }
};

//失去焦点后的操作
const loseFocus = async (e) => {
    if (e === 'weibo_link') {
        weiboStatus.value = true;
    } else if (e === 'github_link') {
        githubStatus.value = true;
    } else {
        passwordStatus.value = true;
    }
    const { code } = await changeNumberData(numberSettings);
    if (code === 2000) {
        message.success('更改成功');
    }
};
</script>
<template>
    <n-card title="账号设置">
        <template #header-extra></template>
        <ul>
            <li>
                <span>邮箱</span>
                <n-input v-model:value="numberSettings.email" placeholder="" disabled="true" />
            </li>
            <li>
                <span>新浪微博</span>
                <n-input
                    ref="weiboInputInstRef"
                    v-model:value="numberSettings.weibo_link"
                    placeholder=""
                    clearable="true"
                    :disabled="weiboStatus"
                    @blur="loseFocus('weibo_link')"
                />
                <n-button text @click="handleFocus('weibo_link')">编辑</n-button>
            </li>
            <li>
                <span>Github</span>
                <n-input
                    ref="githubInputInstRef"
                    v-model:value="numberSettings.github_link"
                    placeholder=""
                    clearable="true"
                    :disabled="githubStatus"
                    @blur="loseFocus('github_link')"
                />
                <n-button text @click="handleFocus('github_link')">编辑</n-button>
            </li>
            <li>
                <span>密码</span>
                <n-input
                    ref="passwordInputInstRef"
                    v-model:value="numberSettings.password"
                    placeholder=""
                    clearable="true"
                    :disabled="passwordStatus"
                    @blur="loseFocus('password')"
                />
                <n-button text @click="handleFocus('password')">重置</n-button>
            </li>
        </ul>
    </n-card>
</template>
<style scoped lang="scss">
@import '@/assets/styles/mixin.scss';
.n-card {
    height: 900px;
    margin-bottom: 40px;

    li {
        display: grid;
        grid-template-columns: 1fr 10fr 1fr;
        align-items: center;
        height: 50px;
        border-bottom: 1px solid #f2f2f2;
        margin-top: 30px;
        span {
            margin-right: 20px;
        }
        .n-input {
            width: 100%;
        }

        @include border;

        .n-input--disabled {
            background-color: #fff;
        }

        .n-button {
            color: #19a094;
        }
    }
}
.n-card :deep(.n-card-header) {
    border-bottom: 1px solid #f2f2f2;
}
</style>
