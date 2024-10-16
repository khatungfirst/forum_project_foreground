<script setup>
import { defineProps, computed, defineEmits } from 'vue';
const emit = defineEmits(['follow']);
const props = defineProps({
    tag: {
        type: Object,
        required: true
    }
});

const handleFollow = () => {
    emit('follow', props.tag.id);
};

// 截取标签描述的长度
const truncatedDescriptions = computed(() => {
    return props.tags.map((tag) => {
        // 假设限制长度为20个字符
        const truncatedDescription =
            tag.description.length > 39 ? tag.description.slice(0, 39) + '...' : tag.description;
        return { ...tag, description: truncatedDescription };
    });
});
</script>

<template>
    <div class="tag-item">
        <div class="tag-item-container">
            <div class="tag-item-single">
                <div class="tag-item-info">
                    <img :src="props.tag.path" alt="tag image" class="tag-item_avatar" />
                    <div class="tag-item-message">
                        <span class="tag-item_title">{{ props.tag.name }}</span>
                        <div class="tag-item_data">
                            文章：{{ props.tag.article_count }} | 热度：{{ props.tag.heat }} | 人数：{{
                                props.tag.fans_count
                            }}
                        </div>
                    </div>
                </div>
                <div class="tag-item-description">
                    <span>{{ props.tag.description }}</span>
                </div>
                <div class="tag-item_follow">
                    <button class="tag-item_button" @click="handleFollow">
                        {{ props.tag.status === 1 ? '已关注√' : '关注' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.tag-item {
    display: flex;
    /* flex-direction: column; */
    align-items: center;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 320px;
    background-color: #ffffff;
}

.tag-item-container {
    display: flex;
    /* flex-direction: column; */
    align-items: center;
}

.tag-item-single {
    display: flex;
    align-items: center;
    flex-direction: column;
}

.tag-item-info {
    margin-top: 2px;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.tag-item_avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-right: 15px;
}

.tag-item-message {
    flex-grow: 1;
}

.tag-item_title {
    margin: 0;
    font-size: 18px;
    color: #4a4949;
}

.tag-item_data {
    color: #7d7b7b;
    margin: 7px auto;
    font-size: 14px;
}

.tag-item-description {
    margin: 1px 0;
    font-size: 14px;
    color: #7d7b7b;
    width: 100%;
}

.tag-item_button {
    cursor: pointer;
    background-color: #f0f0f0;
    border: none;
    border-radius: 50px;
    outline: none;
    color: #19a059;
    /* padding: 8px 125px; */
    margin: 6px 0;
    padding: 8px 0;
    width: 270px;
}
</style>
