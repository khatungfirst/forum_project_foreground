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
    follow_message
} from '@/config/apis/message';

const router = useRouter();

const commentList = ref([]); // 存储评论消息
const likeList = ref([]); // 存储点赞消息
const collectList = ref([]); // 存储收藏消息
const followList = ref([]); // 存储关注消息

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
    const commentResponse = await comment_message({ page: 1, limit: 5 });
    if (commentResponse.code === 2000) {
        commentList.value = commentResponse.data.comment_list;
    } else {
        console.error('获取评论消息失败');
    }

    const likeResponse = await like_message({ page: 1, limit: 5 });
    if (likeResponse.code === 2000) {
        likeList.value = likeResponse.data.like_list;
    } else {
        console.error('获取点赞消息失败');
    }

    const collectResponse = await collect_message({ page: 1, limit: 5 });
    if (collectResponse.code === 2000) {
        collectList.value = collectResponse.data.collection_list;
    } else {
        console.error('获取收藏消息失败');
    }

    const followResponse = await follow_message({ page: 1, limit: 5 });
    if (followResponse.code === 2000) {
        followList.value = followResponse.data.follow_list;
    } else {
        console.error('获取关注消息失败');
    }
});

const likeComment = async (comment) => {
    const status = likedComments.value.has(comment.id) ? 2 : 1;
    const response = await like_comment_message({ id: comment.id, status: status, user_id: comment.user_id });
    if (response.code === 2000) {
        if (status === 1) {
            comment.likes_count += 1;
            likedComments.value.add(comment.id);
        } else {
            comment.likes_count -= 1;
            likedComments.value.delete(comment.id);
        }
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
    <div>
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
                <n-tab-pane name="点赞" tab="点赞">
                    <LikeItem
                        :messageList="likeList"
                        actionType="like"
                        @goToArticleDetail="goToArticleDetail"
                        @goToMember="goToMember"
                    ></LikeItem>
                </n-tab-pane>
                <n-tab-pane name="收藏" tab="收藏">
                    <LikeItem
                        :messageList="collectList"
                        actionType="collect"
                        @goToArticleDetail="goToArticleDetail"
                        @goToMember="goToMember"
                    ></LikeItem>
                </n-tab-pane>
                <n-tab-pane name="粉丝" tab="粉丝">
                    <followItem :followList="followList" @goToMember="goToMember"></followItem>
                </n-tab-pane>
            </n-tabs>
        </n-card>
    </div>
</template>

<style scoped>
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
</style>
