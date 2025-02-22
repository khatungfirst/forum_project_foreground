<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '@/config/store/userStore';
import { useTouristPattern } from '@/config/store/touristPattern';
import useLike from '@/hooks/useLike';
import useDeleteComments from '@/hooks/useDeleteComments';
import commentDrawer from '@/views/components/commentDrawer/index.vue';
import '@/assets/css/icon/iconfont.css';

//---------------------------------统一声明的变量-----------------------------
const prop = defineProps({
    item: {
        type: Object as () => {
            id: number;
            nickname: string;
            parent_nickname: string;
            create_at: string;
            article_id: number;
            user_id: number;
            highest_id: number;
            parent_id: number;
            content: string;
            likes_count: number;
            path: string;
            parent_path: string;
            comment_path: string;
            status: number;
            parent_user_id: number;
        },
        required: true,
        default: () => ({
            id: 6,
            nickname: '',
            parent_nickname: '',
            create_at: '',
            article_id: 0,
            user_id: 0,
            highest_id: 0,
            parent_id: 0,
            content: '',
            likes_count: 0,
            path: '',
            parent_path: '',
            comment_path: '',
            status: 1,
            parent_user_id: 0
        })
    },
    isLogin: {
        type: Boolean,
        default: false
    }
});

const router = useRouter();

const userInfo = useUserStore();

const touristPattern = useTouristPattern();

//定义消息提示对象
// const message = useMessage();
const emit = defineEmits(['delete-secComments', 'public-second']);

//-----------------------------游客模块--------------------------

watch(
    () => prop.isLogin,
    (newVal) => {
        if (prop.isLogin) {
            isSelf.value = prop.item.user_id === userInfo.userInfo?.id ? true : false;
            performOperation(touristPattern.triggerType);
        }
    }
);

//登录后的紧接操作
const performOperation = (type: string) => {
    console.log(prop.item.user_id, userInfo.userInfo?.id, 'ppp');
    if (type === '回复二级评论') {
        if (likeObj.id === touristPattern.triggerContent) {
            appear.value = true;
        }
    } else if (type === '点赞二级评论') {
        console.log(likeObj.id, touristPattern.triggerContent, '1111');
        if (likeObj.id === touristPattern.triggerContent) {
            like(likeObj);
        }
    }
};

//--------------------------------评论有关方法--------------------------------

//控制评论框是否显示
const appear = ref(false);

//判断回复的是自己的评论还是其他人的评论
const isResponseSelf = prop.item.user_id === prop.item.parent_user_id ? true : false;

//判断这个评论是否是自己的评论
const isSelf = ref(prop.item.user_id === userInfo.userInfo?.id ? true : false);

//控制emoji框是否显示
const isEmojiDisappear = ref(false);

//发表评论需要的相关属性
const commentItems = reactive({
    article_id: prop.item.article_id,
    highest_id: prop.item.highest_id,
    parent_id: prop.item.id,
    parent_user_id: prop.item.user_id,
    content: '',
    path: '',
    placeholderText: `回复：${prop.item.nickname}`
});

//解构点赞评论方法
const { likeCounts, like, likeStatus, isTourist } = useLike(prop.item.likes_count, prop.item.status);

const likeObj = {
    id: prop.item.id,
    status: prop.item.status === 2 ? 1 : 2
};

const likeSecond = (obj: object) => {
    if (isTourist) {
        touristPattern.setType('点赞二级评论');
        touristPattern.setTriggerId(obj.id);
    } else {
        like(obj);
    }
};

//删除评论
const { deleteCom } = useDeleteComments();

const deleteFun = async () => {
    await deleteCom(prop.item.id);
    emit('delete-secComments', prop.item.id);
};

//举报评论
// const report = () => {
//     message.warning('举报功能暂未开发，敬请期待吧！');
// };

//跳转到指定用户会员中心
const jumpMember = (id: number) => {
    router.push(`/member/${id}`);
};

//得知emoji框出现
const openEmoji = () => {
    isEmojiDisappear.value = true;
};

//控制emoji表情框消失
const emojiDisappear = () => {
    isEmojiDisappear.value = false;
};

//回复评论的准备工作
const responseComments = (obj: string) => {
    if (userInfo.token === '') {
        // triggerType.value = '回复一级评论';
        touristPattern.setType('回复二级评论');
        touristPattern.setTriggerId(obj.id);
    } else {
        appear.value = !appear.value;
        commentItems.highest_id = prop.item.highest_id;
        commentItems.parent_id = prop.item.id;
        commentItems.parent_user_id = prop.item.user_id;
    }
};

let timer = null;
//评论框焦点消失后评论框消失
const cancelResponse = () => {
    console.log(appear.value, '失去评论2');
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(() => {
        appear.value = false;
        console.log(appear.value, '失去评论1');
    }, 100);
};

//定义发表评论的方法
const handleMaskClick = () => {
    appear.value = false;
    emit('public-second');
};
</script>
<template>
    <div class="comments" ref="boxRef">
        <div class="overlay" @click="emojiDisappear" v-if="isEmojiDisappear"></div>
        <n-avatar round size="large" :src="prop.item.path" @click="jumpMember(prop.item.user_id)" />
        <div class="comments-detail">
            <n-ellipsis style="max-width: 240px">
                <div style="margin-bottom: 7px">
                    <span class="nickname" @click="jumpMember(prop.item.user_id)" style="color: #5d6271">
                        {{ prop.item.nickname }}
                    </span>
                    <span v-if="!isResponseSelf">回复</span>
                    <span
                        class="nickname1"
                        @click="jumpMember(prop.item.parent_user_id)"
                        v-if="!isResponseSelf"
                        style="margin-bottom: 7px; color: #5d6271"
                    >
                        {{ prop.item.parent_nickname }} ：
                    </span>
                </div>
                <p style="font-size: 15px; margin-bottom: 7px">
                    {{ prop.item.content }}
                </p>
                <p><img style="width: 200px" :src="prop.item.comment_path" v-if="prop.item.comment_path !== ''" /></p>
            </n-ellipsis>
            <div class="comment-detail">
                <span class="small-detail1">{{ prop.item.create_at }}</span>
                <span
                    class="small-detail"
                    @click="likeSecond(likeObj)"
                    :style="{ color: likeStatus === 1 ? '#19A059' : '#8a919f' }"
                >
                    <i class="iconfont">&#xe616;</i>
                    <span v-if="likeCounts === 0">点赞</span>
                    <span v-else>{{ likeCounts }}</span>
                </span>
                <span class="small-detail" @click="responseComments(likeObj)">
                    <i class="iconfont">&#xe6b3;</i>
                    <span>{{ appear ? '取消回复' : '回复' }}</span>
                </span>
                <commentDrawer
                    :appear="appear"
                    :headShot="prop.item.path"
                    :item="commentItems"
                    :emojiDisappear="isEmojiDisappear"
                    @close-comment="handleMaskClick"
                    @open-emoji="openEmoji"
                    @cancel-response="cancelResponse"
                ></commentDrawer>
            </div>
        </div>
        <div class="more" v-if="isSelf">
            <n-popconfirm :positive-text="null" :negative-text="null" :show-icon="false">
                <template #trigger>
                    <i class="iconfont">&#xe61e;</i>
                </template>
                <div class="button-container">
                    <n-button text :block="true" @click="deleteFun" style="margin-top: 10px">删除</n-button>
                    <!-- <n-button text :block="true" @click="report" style="margin-top: 10px">举报</n-button> -->
                </div>
            </n-popconfirm>
        </div>
    </div>
</template>
<style scoped lang="scss">
@use '@/assets/styles/mixin.scss' as *;
.comments {
    width: 100%;
    padding: 20px 0px 20px 20px;
    @include flex;
    align-items: start;
    margin-top: 5px;
    .overlay {
        position: fixed; /* 固定定位 */
        top: 0;
        left: 0;
        @include all;
        z-index: 998;
    }

    .n-avatar {
        width: 35px;
        height: 35px;
    }

    .small-detail:hover,
    .n-avatar:hover {
        cursor: pointer;
    }

    .comments-detail {
        flex: 1;
        padding-left: 20px;

        .comment-detail {
            color: #8a919f;

            .drawer :deep(.textArea) {
                width: 100%;
            }
        }

        .small-detail {
            margin-left: 20px;
            span {
                margin-left: 4px;
            }
        }

        .nickname {
            margin-right: 10px;
        }

        .nickname1 {
            margin-left: 10px;
        }

        .nickname:hover,
        .nickname1:hover {
            cursor: pointer;
            color: #19a059;
        }

        .comment-detail {
            color: #8a919f;
            font-size: 13px;
        }
    }
    .more {
        width: 40px;

        .iconfont:hover {
            cursor: pointer;
        }
    }
}
</style>
