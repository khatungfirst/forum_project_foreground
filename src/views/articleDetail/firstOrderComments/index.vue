<script setup lang="ts">
import { ref } from 'vue';
import useLike from '@/hooks/useLike';
import useDeleteComments from '@/hooks/useDeleteComments';
import SecondOrderComments from '@/views/articleDetail/secondOrderComments/index.vue';
import commentDrawer from '@/views/components/commentDrawer/index.vue';
import { getSecondOrderComments } from '@/config/apis/comments';
import { useUserStore } from '@/config/store/userStore';
import { useTouristPattern } from '@/config/store/touristPattern';
import '@/assets/css/icon/iconfont.css';
import { useMessage } from 'naive-ui';
import { Icon } from '@vicons/utils';
import { DownOutlined } from '@vicons/antd';

//--------------------统一声明的变量-------------------------

const prop = defineProps({
    item: {
        type: Object as () => {
            id: number;
            nickname: string;
            create_at: string;
            article_id: number;
            user_id: number;
            highest_id: number;
            parent_id: number;
            content: string;
            likes_count: number;
            replies_count: number;
            path: string;
            comment_path: string;
            status: number;
            parent_user_id: number;
        },
        required: true,
        default: () => ({
            id: 0,
            nickname: '',
            create_at: '',
            article_id: 0,
            user_id: 0,
            highest_id: 0,
            parent_id: 0,
            content: '',
            likes_count: 0,
            replies_count: 0,
            path: '',
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

//定义消息提示对象
const message = useMessage();

const userInfo = useUserStore();

const touristPattern = useTouristPattern();

//通过defineEmits编译器宏生成emit方法来进行组件之间通信
const emit = defineEmits(['delete-firComments', 'trigger-type']);

//-----------------------------生命周期---------------------------

// 监听窗口调整
onMounted(async () => {
    getSecondComments();
});

//-----------------------------游客模块--------------------------

//通知二级评论已经登录
const secondLogin = ref(false);

watch(
    () => prop.isLogin,
    (newVal) => {
        if (prop.isLogin) {
            isCanDelete.value = prop.item.user_id === userInfo.userInfo?.id ? true : false;
            if (touristPattern.triggerType === '点赞二级评论' || touristPattern.triggerType === '回复二级评论') {
                secondLogin.value = true;
            } else {
                performOperation(touristPattern.triggerType);
            }
        }
    }
);

//登录后的紧接操作
const performOperation = (type: string) => {
    if (type === '回复一级评论') {
        if (likeObj.id === touristPattern.triggerContent) {
            appear.value = true;
        }
    } else if (type === '点赞一级评论') {
        if (likeObj.id === touristPattern.triggerContent) {
            like(likeObj);
        }
    }
};

//-----------------------------二级评论--------------------------

//定义接收二级评论的数组
const commentList = ref([]);

//判断是否有二级评论
const isSecondComments = ref(false);

//获取评论需要的相关属性
const commentInfo = reactive({
    highest_id: prop.item.id,
    user_id: userInfo.userInfo?.id ? userInfo.userInfo?.id : 0,
    offset: 1,
    limit: 2
    // user_id: 0
});
//初始化二级评论
const getSecondComments = async () => {
    commentInfo.offset = 1;
    commentList.value = [];
    try {
        const { data } = await getSecondOrderComments(commentInfo);
        if (data) {
            if (data.second_comments_list.length > 0) {
                commentList.value = data.second_comments_list;
                isSecondComments.value = true;
            } else {
                isSecondComments.value = false;
            }
        }
    } catch (error) {
        console.error('Failed to fetch comments:', error);
        message.error('加载评论失败，请重试。');
    }
};

//加载更多二级评论
const moreSecondComments = async () => {
    commentInfo.limit = 3;
    commentInfo.offset = commentInfo.offset + 1;
    const { data } = await getSecondOrderComments(commentInfo);
    if (data) {
        if (data.second_comments_list.length > 0) {
            commentList.value.push(...data.second_comments_list);
            isSecondComments.value = true;
        } else {
            isSecondComments.value = false;
        }
    }
};

//删除二级评论
const deleteSec = (id) => {
    commentList.value = commentList.value.filter((item) => item.id !== id);
    getSecondComments();
};

//回复二级评论
const publicSecond = () => {
    getSecondComments();
};

//------------------------------一级评论---------------------------------

//回复一级评论需要的相关属性
const commentItems = reactive({
    article_id: prop.item.article_id,
    highest_id: prop.item.highest_id,
    parent_id: prop.item.parent_id,
    parent_user_id: prop.item.parent_id,
    content: '',
    path: '',
    placeholderText: `回复：${prop.item.nickname}`
});

//解构点赞方法
const { likeCounts, like, likeStatus, isTourist } = useLike(prop.item.likes_count, prop.item.status);
const likeObj = {
    id: prop.item.id,
    status: prop.item.status === 2 ? 1 : 2
};

const likeFirst = (obj: object) => {
    if (isTourist.value) {
        // triggerType.value = '点赞一级评论';
        // emit('trigger-type', triggerType);
        touristPattern.setType('点赞一级评论');
        touristPattern.setTriggerId(obj.id);
    } else {
        like(obj);
    }
};

//跳转到指定用户会员中心
const jumpMember = (id: number) => {
    router.push(`/member/${id}`);
};

//判断这个评论是否是自己的评论
const iid = ref(userInfo.userInfo?.id || 0);

//--------------------------------回复评论-----------------------------

//控制emoji框是否显示
const isEmojiDisappear = ref(false);

//得知emoji框出现
const openEmoji = () => {
    isEmojiDisappear.value = true;
};

//控制emoji表情框消失
const emojiDisappear = () => {
    isEmojiDisappear.value = false;
};

const responseComments = (obj: object) => {
    if (userInfo.token === '') {
        // triggerType.value = '回复一级评论';
        touristPattern.setType('回复一级评论');
        touristPattern.setTriggerId(obj.id);
    } else {
        appear.value = !appear.value;
        commentItems.highest_id = prop.item.id;
        commentItems.parent_id = prop.item.id;
        commentItems.parent_user_id = prop.item.user_id;
    }
};
let timer = null;

//评论框焦点消失后评论框消失
const cancelResponse = () => {
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(() => {
        appear.value = false;
        console.log(appear.value, '失去评论1');
    }, 100);
};

//--------------------------------删除、举报功能------------------------

//判断是否具有删除权力
const isCanDelete = ref(prop.item.user_id === iid.value);

//解构删除方法
const { deleteCom } = useDeleteComments();

const deleteFun = async () => {
    await deleteCom(prop.item.id);
    emit('delete-firComments', prop.item.id);
};

//举报评论
// const report = () => {
//     message.warning('举报功能暂未开发，敬请期待吧！');
// };
//-----------------------------遮罩层-----------------------------------

//控制评论框是否显示
const appear = ref(false);

//定义遮罩层的点击事件
const handleMaskClick = () => {
    appear.value = false;
    getSecondComments();
};
</script>
<template>
    <div class="f-comments" ref="boxRef">
        <div class="emojiOverlay" @click="emojiDisappear" v-if="isEmojiDisappear"></div>
        <n-avatar round size="large" :src="prop.item.path" @click="jumpMember(prop.item.user_id)" />
        <div class="avatar-other">
            <div class="first-comment">
                <div class="comments-detail">
                    <n-ellipsis style="max-width: 240px; margin-bottom: 10px; color: #5d6271">
                        {{ prop.item.nickname }}
                    </n-ellipsis>
                    <p style="font-size: 15px; margin-bottom: 10px" v-if="prop.item.content !== ''">
                        {{ prop.item.content }}
                    </p>
                    <p>
                        <img style="width: 200px" :src="prop.item.comment_path" v-if="prop.item.comment_path !== ''" />
                    </p>
                    <div class="comment-detail">
                        <span class="small-detail1">{{ prop.item.create_at }}</span>
                        <span
                            class="small-detail"
                            @click="likeFirst(likeObj)"
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
                <div class="more" v-if="isCanDelete">
                    <n-popconfirm
                        :positive-text="null"
                        :negative-text="null"
                        @positive-click="deleteFun"
                        :show-icon="false"
                    >
                        <template #trigger>
                            <i class="iconfont">&#xe61e;</i>
                        </template>
                        <template #action>
                            <p @click="deleteFun" class="deleteSty">删除</p>
                        </template>
                    </n-popconfirm>
                </div>
            </div>
            <div class="second-comment">
                <SecondOrderComments
                    :item="item"
                    v-for="(item, index) in commentList"
                    :key="index"
                    @delete-secComments="deleteSec"
                    @public-second="publicSecond"
                    :isLogin="secondLogin"
                ></SecondOrderComments>
                <p @click="moreSecondComments" v-if="isSecondComments">
                    查看更多回复
                    <Icon size="14">
                        <DownOutlined />
                    </Icon>
                </p>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
@use '@/assets/styles/mixin.scss' as *;
.f-comments {
    width: 100%;
    padding: 15px 0px;
    display: flex;

    .emojiOverlay {
        position: fixed; /* 固定定位 */
        top: 0;
        left: 0;
        @include all;
        z-index: 998;
    }
    @include overlay;
    .n-avatar {
        width: 40px;
    }

    .n-avatar:hover {
        cursor: pointer;
    }

    .avatar-other {
        width: 100%;
        .first-comment {
            display: flex;
            .comments-detail {
                flex: 1;
                padding-left: 20px;

                .small-detail {
                    margin-left: 20px;

                    span {
                        margin-left: 4px;
                    }
                }

                .small-detail:hover {
                    cursor: pointer;
                }
                .comment-detail {
                    color: #8a919f;
                    font-size: 13px;

                    .drawer :deep(.textArea) {
                        width: 100%;
                    }
                }
            }
            .more {
                width: 40px;

                .iconfont:hover {
                    cursor: pointer;
                }

                .deleteSty:hover {
                    cursor: pointer;
                }
            }
        }

        .second-comment {
            p {
                font-size: 14px;
                color: #8a919f;
                text-align: center;
            }

            p:hover {
                cursor: pointer;
            }
        }
    }
}
</style>
