<script setup>
import { ref, onMounted } from 'vue';
import CommentItem from '../components/messageComment/index.vue';
import { comment_message, like_comment_message } from '@/config/apis/message';

const commentList = ref([]); // 存储点赞消息
const likeResponse = ref([]); // 存储点赞消息
const collectResponse = ref([]); // 存储收藏消息
const followResponse = ref([]); // 存储关注消息

onMounted(async () => {
    console.log('111');
    const commentResponse = await comment_message({ page: 1, limit: 5 });
    console.log('222');
    if (commentResponse.code === 2000) {
        commentList.value = commentResponse.data.comment_list;
    } else {
        console.error('获取评论消息失败');
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
        </div>
    </div>
</template>
