<script setup>
import { useRouter } from 'vue-router';
import { Tag_follow } from '../../../config/apis/tag';
const router = useRouter();
const emit = defineEmits(['follow']);
const props = defineProps({
    tag: { type: Object, required: true },
    isFollowing: { type: Boolean, default: false } // 接收父组件的加载状态
});

const isFollowed = ref(props.isFollowing);
const loadingState = ref(false); // 存储每个标签的加载状态
// const handleFollow = () => {
//     emit('follow', props.tag.id);
// };

const handleFollow = async () => {
    try {
        // 设置加载状态
        loadingState.value = true;
        const response = await Tag_follow({ id: props.tag.id });
        if (response.code === 2000) {
            // 更新本地关注状态
            isFollowed.value = !isFollowed.value;

            // 触发父组件的 follow 事件
            emit('follow', props.tag.id);
        } else {
            console.error('关注标签失败:', response.message);
        }
    } catch (error) {
        console.error('Error following tag:', error);
    } finally {
        // 请求完成后，解除加载状态
        loadingState.value = false;
    }
};

// 截取标签描述的长度
const truncatedDescriptions = computed(() => {
    return props.tags.map((tag) => {
        const truncatedDescription =
            tag.description.length > 16 ? tag.description.slice(0, 16) + '...' : tag.description;
        return { ...tag, description: truncatedDescription };
    });
});

// 点击标签跳转到此标签的标签详情页，携带id
const handleDetail = (id) => {
    router.push({ path: `/tagDetail/${id}` });
};
</script>

<template>
    <div class="tag-item">
        <div class="tag-item-single">
            <div class="tag-item-info" @click="handleDetail(tag.id)">
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
                <button class="tag-item_button" :disabled="loadingState" @click="handleFollow">
                    {{ isFollowed ? '已关注' : '关注' }}
                    <n-spin :size="12" v-if="loadingState" />
                </button>
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
    transition: background-color 0.2s ease, box-shadow 0.2s ease; /* 添加过渡效果 */
}

.tag-item:hover {
    background-color: #e4e6eb; /* 鼠标悬浮时背景变灰 */
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1); /* 添加轻微阴影，模拟凸起效果 */
}

.tag-item-single {
    display: flex;
    /* align-items: center; */
    flex-direction: column;
    justify-content: center;
    margin: auto;
}

.tag-item-info {
    margin-top: 2px;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
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
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* 限制显示两行 */
    -webkit-box-orient: vertical;
}
.tag-item_follow {
    display: flex;
    align-items: center;
    justify-content: center;
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
    padding: 5px 0;
    width: 270px;
}
</style>
