<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import CommentItem from '../components/messageComment/index.vue';
import LikeItem from '../components/messageLike&Collect/index.vue';
import followItem from '../components/messageFollow/index.vue';
import commentDrawer from '../components/commentDrawer/index.vue';
import {
    comment_message,
    like_message,
    collect_message,
    like_comment_message,
    follow_message,
    comment_like_message
} from '@/config/apis/message';

import { concernInter } from '@/config/apis/articleDetail';
import PublishButton from '../components/PublishButton/index.vue';
import messageLikeComment from '../components/messageLikeComment/index.vue';

const router = useRouter();

const commentList = ref([]); // 存储评论消息
const likeList = ref([]); // 存储点赞消息
const collectList = ref([]); // 存储收藏消息
const followList = ref([]); // 存储关注消息
const likeCommentList = ref([]); // 存储点赞评论消息

const likedComments = ref(new Set()); // 存储已点赞的评论ID

// 定义控制评论页面的出现
const appear = ref(false);

// 定义是否显示遮罩层的方法
const isOverlayVisible = ref(false);

// 定义评论子盒子的宽度
const childWidth = ref('430px');

// 定义当前登录人的id
const user_id = ref(0);

// 定义作者对象
const authorInfo = reactive({
    author_id: 0, // 当前作者的id
    head: '', // 作者头像
    nickname: '', // 作者昵称
    signature: '', // 作者个签
    author_article: 0, // 作者文章数
    author_read: 0, // 作者阅读数
    fans_count: 0, // 作者粉丝数
    concern_status: false // 定义是否关注该作者的状态
});

// 确保 currentTab 在顶层作用域中声明
const currentTab = ref('评论'); // 默认显示“评论”标签页

// 评论的方法
const review = () => {
    appear.value = true; // 显示评论盒子
    isOverlayVisible.value = true;
    console.log('review');
};

// 定义遮罩层的点击事件
const handleMaskClick = () => {
    isOverlayVisible.value = false;
    appear.value = false;
};

onMounted(async () => {
    getcommentResponse();

    getlikeResponse();

    getcollectResponse();

    getfollowResponse();

    getlikeCommentResponse();
});

const getcommentResponse = async () => {
    const commentResponse = await comment_message({ page: 1, limit: 10 });
    if (commentResponse.code === 2000) {
        commentList.value = commentResponse.data.comment_list;
    } else {
        console.error('获取评论消息失败');
    }
};

const getlikeResponse = async () => {
    const likeResponse = await like_message({ page: 1, limit: 5 });
    if (likeResponse.code === 2000) {
        likeList.value = likeResponse.data.like_list;
    } else {
        console.error('获取点赞消息失败');
    }
};

const getcollectResponse = async () => {
    const collectResponse = await collect_message({ page: 1, limit: 5 });
    if (collectResponse.code === 2000) {
        collectList.value = collectResponse.data.collection_list;
    } else {
        console.error('获取收藏消息失败');
    }
};

const getfollowResponse = async () => {
    const followResponse = await follow_message({ page: 1, limit: 5 });
    if (followResponse.code === 2000) {
        followList.value = followResponse.data.follow_list;
    } else {
        console.error('获取关注消息失败');
    }
};

const getlikeCommentResponse = async () => {
    const likeCommentResponse = await comment_like_message({ page: 1, limit: 5 });
    if (likeCommentResponse.code === 2000) {
        likeCommentList.value = likeCommentResponse.data.like_list;
    } else {
        console.error('获取点赞评论消息失败');
    }
};

const likeComment = async (comment) => {
    comment.likeStatus = !comment.likeStatus; // 切换点赞状态

    if (comment.likeStatus) {
        comment.likes_count++; // 点赞+1
    } else {
        comment.likes_count--; // 点赞-1
    }
    console.log('b评论点赞状态:', comment.likeStatus);
    // 调用接口更新点赞状态
    const data = {
        id: comment.id,
        status: comment.likeStatus ? 2 : 1,
        user_id: comment.user_id
    };
    console.log('传递的点赞状态:', data.status);

    // const status = likedComments.value.has(comment.id) ? 2 : 1;
    const response = await like_comment_message(data);
    if (response.code === 2000) {
        // if (status === 1) {
        //     comment.likes_count += 1;
        //     likedComments.value.add(comment.id);
        // } else {
        //     comment.likes_count -= 1;
        //     likedComments.value.delete(comment.id);
        // }
        getcommentResponse();
        console.log(111, commentResponse.data.comment_list);
        console.log('点赞评论操作成功');
    } else {
        console.error('点赞操作失败:', response.message);
    }
};

const goToMember = (userId) => {
    router.push(`/member/${userId}`);
};

const goToArticleDetail = (articleId) => {
    router.push(`/articledetail/${articleId}`);
};
</script>

<template>
    <div class="container">
        <n-card title="" style="margin-bottom: 16px">
            <n-tabs type="line" animated v-model="currentTab">
                <n-tab-pane name="评论" tab="评论">
                    <CommentItem
                        :comment_message="commentList"
                        @likeComment="likeComment"
                        @showCommentBox="review"
                        @goToArticleDetail="goToArticleDetail"
                        @goToMember="goToMember"
                    ></CommentItem>
                </n-tab-pane>
                <n-tab-pane name="点赞" tab="点赞" class="custom-tab">
                    <LikeItem
                        :messageList="likeList"
                        actionType="like"
                        @goToArticleDetail="goToArticleDetail"
                        @goToMember="goToMember"
                    ></LikeItem>
                    <messageLikeComment
                        :likeCommentList="likeCommentList"
                        @goToArticleDetail="goToArticleDetail"
                        @goToMember="goToMember"
                    ></messageLikeComment>
                </n-tab-pane>
                <n-tab-pane name="收藏" tab="收藏" class="custom-tab">
                    <LikeItem
                        :messageList="collectList"
                        actionType="collect"
                        @goToArticleDetail="goToArticleDetail"
                        @goToMember="goToMember"
                    ></LikeItem>
                </n-tab-pane>
                <n-tab-pane name="粉丝" tab="粉丝" class="custom-tab">
                    <followItem :followList="followList" @goToMember="goToMember"></followItem>
                </n-tab-pane>
            </n-tabs>
        </n-card>
        <PublishButton></PublishButton>
    </div>
</template>

<style scoped lang="scss">
.container {
    width: 80%;
    margin: 0 auto;
    margin-top: 75px;
}
.right {
    /* ... 其他样式 ... */

    /* 评论盒子的样式 */
    .reviewModule {
        padding: 20px;
        background-color: #fff;
        h3 {
            margin-bottom: 20px;
        }

        .loginRegist {
            height: 180px;
            display: grid;
            grid-template-columns: 1fr 14fr;
            .loginBgc {
                width: 90%;
                height: 120px;
                float: right;
                background-color: #f7f8fa;
                text-align: center;
                line-height: 120px;
                border-radius: 5px;

                .n-button {
                    margin-right: 5px;
                }
            }
        }
    }
}
.n-tabs:deep(.n-tabs-tab__label) {
    font-size: 18px; /* 你想要的字体大小 */
}
</style>
