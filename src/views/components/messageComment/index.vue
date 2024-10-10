<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    comment_message: {
        type: Array,
        required: true,
        default: () => []
    }
});

const emit = defineEmits(['likeComment', 'showCommentBox']);
</script>

<template>
    <div class="comment-item" v-for="comment in comment_message" :key="comment.id">
        <div class="comment-avatar">
            <img src="../../../public/static/img/favicon.ico" alt="User avatar" />
        </div>
        <div class="comment-content">
            <div class="comment-header">
                <span class="nickname">{{ comment.nickname }}</span>
                <span class="commented" v-if="comment.comment">回复了你 [{{ comment.comment }}] 的评论</span>
            </div>
            <p class="comment-text">{{ comment.content }}</p>
            <div class="comment-title">
                <a href="#">{{ comment.title }}</a>
            </div>
            <div class="comment-actions">
                <span class="date">{{ comment.created_at }}</span>
                <button class="like-button" @click="() => emit('likeComment', comment)">
                    {{ comment.likes_count }} 次赞
                </button>
                <span class="comment-reply" @click="() => emit('showCommentBox', comment)">回复</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.comment-item {
    display: flex;
    margin-bottom: 20px;
}

.comment-avatar img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
}

.comment-content {
    flex-grow: 1;
}

.nickname {
    font-size: 16px;
    color: #000000;
    margin-right: 15px;
}

.commented {
    font-size: 16px;
    color: #474646;
}

.date {
    font-size: 14px;
    color: #666;
    padding: 5px 10px 5px 0px;
}

.comment-title a {
    color: rgb(143, 139, 139);
    text-decoration: none;
    font-weight: 500;
    font-size: 16px;
}

.comment-text {
    margin: 5px 0;
    color: #141414;
    font-weight: bold;
    font-size: 16px;
}

.comment-actions {
    display: flex;
    align-items: center;
    margin-top: 10px;
}

.like-button {
    background: #f0f0f0;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    color: #666;
    margin-right: 10px;
    cursor: pointer;
}

.liked {
    color: red;
}

.comment-reply {
    color: #007bff;
    cursor: pointer;
}
</style>
