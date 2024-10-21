<script setup>
import { ref, onMounted } from 'vue';
import Article from '../components/article/index.vue';
import TagItem from '../components/tagDetail/index.vue';
import { getTagList, Tag_follow } from '../../config/apis/tag';

const tags = ref([]); // 使用数组初始化

onMounted(async () => {
    try {
        console.log('111');
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
        const response = await Tag_follow({ id: id });
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

const articles = ref([
    {
        id: '1',
        title: 'GSAdmin一键代码生成工具',
        summary: 'GSAdmin是一个基于Vue3的后台管理系统模板，支持一键代码生成。',
        nickname: '作者名',
        published_at: '2024-04-24',
        views_count: 1000,
        likes_count: 50,
        image_url: 'path/to/image1.jpg',
        tags: [{ ID: 101 }, { ID: 102 }],
        status: false
    }
]);
</script>

<template>
    <div class="tag-list-container">
        <tagItem :tags="tags" @follow="follow_tag" />
    </div>
    <div class="tag-articl">
        <Article v-for="article in articles" :key="article.id" :item="article" />
    </div>
</template>

<style scoped>
.article-list-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;
}
</style>
