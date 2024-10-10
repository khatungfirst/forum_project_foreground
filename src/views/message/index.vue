<script setup>
import { ref, onMounted } from 'vue';
import CommentItem from '../components/messageComment/index.vue';
import LikeItem from '../components/messageLike&Collect/index.vue';
import { comment_message, like_message, collect_message, like_comment_message } from '@/config/apis/message';

const commentList = ref([]); // 存储评论消息
const likeList = ref([]); // 存储点赞消息
const collectList = ref([]); // 存储收藏消息
const followResponse = ref([]); // 存储关注消息

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
});

const likeComment = async (id) => {
    const comment = commentList.value.find((comment) => comment.id === id);
};
</script>

<template>
    <div>
        <div class="comment_list">
            <CommentItem :comment_message="commentList"></CommentItem>
            <div>
                <LikeItem :messageList="likeList" actionType="like" />
                <LikeItem :messageList="collectList" actionType="collect" />
            </div>
        </div>
    </div>
</template>
