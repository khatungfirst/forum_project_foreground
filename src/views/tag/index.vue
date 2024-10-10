<script setup>
import { ref, onMounted } from 'vue';
import { getTagList, Tag_follow } from '../../config/apis/tag';
import TagItem from '../components/tags/index.vue';

const tags = ref([]); // 使用数组初始化

onMounted(async () => {
    try {
        const response = await getTagList();
        if (response.code === 2000 && Array.isArray(response.data.tag_list)) {
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
        const response = await Tag_follow(id);
        if (response.code === 2000) {
            // 更新本地标签数据
            const index = tags.value.findIndex((tag) => tag.id === id);
            if (index !== -1) {
                tags.value[index].is_followed = true;
            } else {
                // 处理错误情况
                console.error('Failed to follow tag:', response.message);
            }
        } else {
            console.error('关注标签失败:', response.message);
        }
    } catch (error) {
        console.error('Error following tag:', error);
    }
};
</script>

<template>
    <TagItem :tags="tags" @follow="follow_tag" />
</template>

<style scoped>
/* 样式代码 */
</style>
