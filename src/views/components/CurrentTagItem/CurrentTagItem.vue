// CurrentTagItem.vue
<script setup>
const emit = defineEmits(['follow']);
const props = defineProps({
    tag: {
        type: Object,
        required: true
    },
    showFollowButton: {
        type: Boolean,
        default: true // 默认显示关注按钮
    }
});

const handleFollow = () => {
    emit('follow', props.tag.id);
};
</script>

<template>
    <div class="tag-item-container">
        <div class="tag-item-single">
            <div class="tag-item-info">
                <img :src="tag.path" alt="Tag Image" class="tag-item_avatar" />
                <div class="tag-item-message">
                    <span class="tag-item_title">{{ tag.name }}</span>
                    <div class="tag-item_data">
                        文章：{{ tag.article_count }} | 热度：{{ tag.heat }} | 人数：{{ tag.fans_count }}
                    </div>
                </div>
            </div>
            <div class="tag-item-description">
                <span>{{ tag.description }}</span>
            </div>
            <div class="tag-item_follow" v-if="showFollowButton">
                <button class="tag-item_button" @click="handleFollow">
                    {{ tag.status === 1 ? '已关注√' : '关注' }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.tag-item-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    background-color: white; /* 设置背景颜色为白色 */
}

.tag-item-single {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-bottom: 20px;
    margin: 0;
    padding: 40px 0 40px 60px;
}

.tag-item-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
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
    color: #36ad6a;
    padding: 8px 30px;
    width: 100%;
    text-align: center;
    font-size: 14px;
}
</style>
