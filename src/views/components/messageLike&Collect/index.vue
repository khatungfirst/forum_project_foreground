<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    messageList: {
        type: Array,
        required: true,
        default: () => []
    },
    actionType: {
        type: String,
        required: true,
        validator: (value) => ['like', 'collect'].includes(value)
    }
});
</script>

<template>
    <div v-for="message in messageList" :key="message.user_id" class="message-item">
        <div class="message-avatar">
            <img :src="message.path" alt="User avatar" />
        </div>
        <div class="message-content">
            <div class="message-header">
                <span class="nickname">{{ message.nickname }}</span>
                <span class="actioned" v-if="actionType === 'like'">赞了你的文章《{{ message.title }}》</span>
                <span class="actioned" v-else>收藏了你的文章《{{ message.title }}》</span>
            </div>
            <div class="message-actions">
                <span class="date">{{ message.created_at }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.message-item {
    display: flex;
    margin-bottom: 20px;
    align-items: center;
}

.message-avatar img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
}

.message-content {
    flex-grow: 1;
}

.nickname {
    font-size: 16px;
    color: #000000;
    margin-right: 15px;
}

.actioned {
    font-size: 16px;
    color: #474646;
}

.date {
    font-size: 14px;
    color: #666;
    padding: 5px 10px 5px 0px;
}

.message-actions {
    display: flex;
    align-items: center;
    margin-top: 10px;
}
</style>
