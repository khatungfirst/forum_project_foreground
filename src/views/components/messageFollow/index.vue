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
        <div class="follow-button">
            <button class="common-button" :class="{ 'is-followed': follow.is_followed === 1 }">
                {{ follow.is_followed === 1 ? '已关注√' : '关注' }}
            </button>
        </div>
    </div>
</template>

<style scoped>
.follow-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
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

.follow-header {
    display: flex;
    align-items: center;
}

.nickname {
    font-size: 16px;
    color: #000000;
    margin-right: 15px;
    cursor: pointer;
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

.follow-button {
    margin-left: 10px;
}

.common-button {
    width: auto;
    background-color: #c5e2d4;
    color: #19a059;
    border: none;
    padding: 10px 20px;
    border-radius: 25px;
    cursor: pointer;
}

.is-followed {
    background-color: #dcdcdc;
    color: #666;
}
</style>
