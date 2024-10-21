<script setup>
import { ref, onMounted } from 'vue';
import { getTagList, Tag_follow } from '../../config/apis/tag';
import TagItem from '../components/tags/index.vue';

const tags = ref([]); // 使用数组初始化

onMounted(async () => {
    try {
        const response = await getTagList();
        if (response.code === 2000) {
            tags.value = response.data.tag_list;
            console.log(tags);
        } else {
            console.error('获取标签数据失败');
        }
    } catch (error) {
        console.error('请求标签数据出错:', error);
    }
});

const follow_tag = async (id) => {
    try {
        const response = await Tag_follow({ id: id });
        if (response.code === 2000) {
            // 更新本地标签数据
            const index = tags.value.findIndex((tag) => tag.id === id);
            if (index !== -1) {
                tags.value[index].is_followed = true;
            } else {
                // 如果找不到标签，可能需要添加新的标签到列表
                tags.value.push({ id, is_followed: true });
            }
            // 重新获取整个标签列表
            await getTagListAgain();
        } else {
            console.error('关注标签失败:', response.message);
        }
    } catch (error) {
        console.error('Error following tag:', error);
    }
};

const getTagListAgain = async () => {
    try {
        const response = await getTagList();
        if (response.code === 2000) {
            tags.value = response.data.tag_list;
        } else {
            console.error('重新获取标签数据失败');
        }
    } catch (error) {
        console.error('重新请求标签数据出错:', error);
    }
};
</script>

<template>
    <div class="tag-list-container">
        <TagItem v-for="tag in tags" :key="tag.id" :tag="tag" @follow="follow_tag" />
    </div>
</template>

<style scoped>
.tag-list-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 20px;
}

.tag-list-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 20px;
    gap: 20px; /* 控制标签之间的间距 */
}

.tag-item-single {
    width: calc(33% - 20px); /* 控制每个标签的宽度 */
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    background-color: #ffffff;
}
</style>
