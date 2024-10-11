<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    followList: {
        type: Array,
        required: false,
        default: () => []
    }
});

const emit = defineEmits(['goToMember']);
</script>

<template>
    <div v-for="follow in followList" :key="follow.follower_id" class="follow-item">
        <div class="follow-avatar" @click="() => emit('goToMember', follow.follower_id)">
            <img :src="follow.path" alt="User avatar" />
        </div>
        <div class="follow-content">
            <div class="follow-header">
                <span class="nickname" @click="() => emit('goToMember', follow.follower_id)">
                    {{ follow.nickname }}
                </span>
                <span class="actioned">关注了你</span>
            </div>
            <div class="follow-actions">
                <span class="date">{{ follow.created_at }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.follow-item {
    display: flex;
    margin-bottom: 20px;
    align-items: center;
}

.follow-avatar img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
}

.follow-content {
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

.follow-actions {
    display: flex;
    align-items: center;
    margin-top: 10px;
}
</style>
