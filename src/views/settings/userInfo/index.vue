<script setup lang="ts">
import { reactive } from 'vue';
import { getUserInfo, changeUserInfo } from '@/config/apis/settings.ts';
import { getImageUrl } from '@/config/apis/publicArticle';
import { useMessage } from 'naive-ui';
import '@/assets/css/icon/iconfont.css';

//定义消息提示对象
const message = useMessage();

// const showModalRef = ref(false);

//定义个人资料的所有信息
const userInfo = reactive({
    id: 0,
    nickname: '',
    career_direction: '',
    user_home_page: '',
    user_signature: '',
    user_tags: [],
    all_tag_names: [],
    path: ''
});

//定义更改前的个人资料的所有信息
const oldUserInfo = reactive({ ...userInfo });

//定义表单的校验规则
const rules = {
    nickname: {
        required: true,
        trigger: ['blur', 'change'],
        message: '请填写用户名'
    },
    career_direction: {
        required: true,
        trigger: ['blur', 'change'],
        message: '请填写职业方向'
    }
};

onMounted(async () => {
    const { data } = await getUserInfo(userInfo.id);
    if (data) {
        Object.assign(userInfo, data);
    }
});

//计算属性，处理过的标签
const processedTags = computed(() => {
    return userInfo.all_tag_names.map((tag) => {
        console.log(tag);

        const isSelected = userInfo.user_tags.includes(tag);
        return { tag, isSelected };
    });
});

//将更新用户数据的操作提取成一个方法
const update = async (msg1, msg2) => {
    const { code } = await changeUserInfo(userInfo);
    if (code === 2000) {
        message.success(msg1);
    } else {
        message.error(msg2);
    }
};

//更新用户表单数据
const changeForm = (item) => {
    console.log(userInfo, '111');
    console.log(oldUserInfo, '3');

    if (userInfo[item] !== oldUserInfo[item] && oldUserInfo[item] !== '') {
        update('信息更改成功', '信息更改失败');
    }
    Object.assign(oldUserInfo, userInfo);
};

//添加标签的方法
const addTags = async (item) => {
    userInfo.user_tags.push(item.tag);
    update('添加标签成功', '添加标签失败');
};

//删除标签的方法
const handleClose = async (e) => {
    userInfo.user_tags = userInfo.user_tags.filter((item) => item !== e);
    update('删除标签成功', '删除标签失败');
};

//上传图片预览图
const handlePreview = async () => {
    const { data } = await getImageUrl();
    userInfo.path = data.url;
    update('更改头像成功', '更改头像失败');
    // showModalRef.value = true;
};
</script>
<template>
    <n-card title="个人资料">
        <template #header-extra></template>
        <P>基本信息</P>
        <div class="top">
            <n-form
                ref="formRef"
                :model="userInfo"
                :rules="rules"
                label-placement="left"
                label-width="auto"
                require-mark-placement="left"
                size="medium"
                :style="{
                    maxWidth: '640px'
                }"
            >
                <n-form-item label="用户名" path="nickname" name="nickname">
                    <n-input
                        v-model:value="userInfo.nickname"
                        show-count
                        maxlength="20"
                        placeholder=""
                        @blur="changeForm('nickname')"
                    />
                </n-form-item>
                <n-form-item label="职业方向" path="career_direction" name="career_direction">
                    <n-input
                        v-model:value="userInfo.career_direction"
                        placeholder=""
                        @blur="changeForm('career_direction')"
                    />
                </n-form-item>
                <n-form-item label="个人主页" path="user_home_page">
                    <n-input
                        v-model:value="userInfo.user_home_page"
                        show-count
                        maxlength="50"
                        placeholder=""
                        @blur="changeForm('user_home_page')"
                    />
                </n-form-item>
                <n-form-item label="个人签名" path="user_signature">
                    <n-input
                        v-model:value="userInfo.user_signature"
                        placeholder=""
                        type="textarea"
                        :autosize="{
                            minRows: 3,
                            maxRows: 5
                        }"
                        show-count
                        maxlength="200"
                        @blur="changeForm('user_signature')"
                    />
                </n-form-item>
            </n-form>
            <div class="head">
                <n-upload list-type="image-card" @change="handlePreview">
                    <n-avatar round size="large" :src="userInfo.path" style="width: 100%; height: 100%" />
                </n-upload>
                <p>上传头像</p>
                <p class="small">格式：支持JPG、PNG、JPEG</p>
                <p class="small">大小：5M以内</p>
            </div>
        </div>
        <P>标签管理</P>
        <div class="tag">
            <span>
                <i class="iconfont">&#xe640;</i>
                兴趣标签
            </span>
            <div class="tag-right">
                <div class="selecteduser_tags" v-for="(item, index) in userInfo.user_tags" :key="index">
                    <n-tag closable @close="handleClose(item)">{{ item }}</n-tag>
                </div>
                <n-infinite-scroll style="height: 240px" :distance="10">
                    <div
                        v-for="(item, index) in processedTags"
                        :key="index"
                        class="message"
                        :class="{ reverse: index % 5 === 0 }"
                    >
                        <n-tag style="background-color: #daf0e4" disabled="true" v-if="item.isSelected">
                            {{ item.tag }}
                        </n-tag>
                        <n-tag @click="addTags(item)" v-else>
                            {{ item.tag }}
                        </n-tag>
                    </div>
                </n-infinite-scroll>
            </div>
        </div>
    </n-card>
</template>
<style lang="scss" scoped>
@import '@/assets/styles/mixin.scss';
.n-card {
    height: 900px;
    // @include all;
    margin-bottom: 40px;

    .top {
        display: grid;
        grid-template-columns: 3fr 1fr;
    }

    p {
        margin: 15px 0px;
        font-size: 16px;
    }

    @include border;

    .n-input {
        border-radius: 5px;
        background-color: #f7f8fa;
    }

    .head {
        margin: 0 auto;

        .n-upload {
            border-radius: 50px;
            width: 95px;
            margin: 0 auto;
        }

        .n-upload :deep(.n-upload-dragger) {
            border-radius: 50px;
        }

        .n-upload :deep(.n-upload-file.n-upload-file--image-card-type) {
            display: none;
        }

        p {
            text-align: center;
        }

        .small {
            font-size: 14px;
            margin: 2px 0px;
            color: #a8919f;
            text-align: left;
        }
    }

    .tag {
        width: 66%;
        display: grid;
        grid-template-columns: 83px 1fr;

        .n-tag {
            float: left;
            margin: 0px 15px 15px 10px;
        }
    }
    .tag :deep(.n-scrollbar-container) {
        // flex-grow: 1;
        border: 1px solid #dbdbdb;
        border-radius: 5px;
        padding: 15px;
    }
}

@include headBorder;
</style>
