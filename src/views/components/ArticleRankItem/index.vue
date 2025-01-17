<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
    articles: {
        type: Array,
        required: true,
        default: () => []
    }
});

// 确保 articles 是一个数组
const processedArticles = computed(() => {
    return props.articles.map((article, index) => ({
        ...article,
        rank: index + 1 // 给每个文章分配排名
    }));
});

// 定义一个方法来获取排名颜色
const getRankColor = (rank) => {
    const colors = ['red', 'orange', 'yellow', 'green', 'grey'];
    return colors[rank - 1] || 'black'; // 如果排名超出颜色数组，使用默认黑色
};
</script>

<template>
    <div class="article-rank-item">
        <div class="article-rank-item_container">
            <div class="article-rank-item_header">
                <span>文章榜单</span>
            </div>
            <hr class="article-rank-divider" />
            <div class="article-rank-item_content">
                <!-- 使用 v-for 循环渲染每个文章信息 -->
                <div v-for="article in processedArticles" :key="article.id" class="article-rank-item_single">
                    <div class="rank-icon">
                        <!-- 使用样式绑定来设置颜色 -->
                        <span class="article-rank-index" :style="{ color: getRankColor(article.rank) }">
                            {{ article.rank }}
                        </span>
                    </div>
                    <div class="article-rank-item_info">
                        <span class="article-rank-item_title">{{ article.title }}</span>
                    </div>
                </div>
            </div>
            <hr class="article-rank-divider" />
            <div class="article-rank-more">
                <span>查看更多</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.article-rank-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 290px;
}

.article-rank-item_single {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    padding: 3px 0;
}

.article-rank-item_container {
    width: 100%;
}

.article-rank-item_header {
    font-size: 17px;
    margin-bottom: 10px;
    text-align: left;
}

.article-rank-item_content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.rank-icon {
    margin-right: 15px;
}

.article-rank-index {
    font-size: 16px;
    font-weight: bold;
}

.article-rank-item_info {
    flex-grow: 1;
}

.article-rank-item_title {
    margin: 0;
    font-size: 15px;
}

.article-rank-divider {
    width: 100%;
    border: 0;
    height: 1px;
    background-color: #e7dfdf;
    margin: 10px 0;
}

.article-rank-more {
    text-align: center;
    color: #a9a5a5;
}
</style>
