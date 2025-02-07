<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
    articles: {
        type: Array,
        required: true,
        default: () => []
    },
    page: {
        type: Number,
        required: true
    },
    limit: {
        type: Number,
        required: true
    }
});
const emit = defineEmits(['refresh']);

const totalArticlesLoaded = ref(0); // 跟踪已加载的文章总数

const processedArticles = computed(() => {
    return props.articles.map((article, index) => {
        const rank = (props.page - 1) * props.limit + index + 1; // 计算排名
        return {
            ...article,
            rank: rank // 给每个文章分配排名
        };
    });
});

const getRankColor = (rank) => {
    const colors = ['red', 'orange', 'yellow', 'green', 'grey'];
    return colors[rank - 1] || 'black'; // 如果排名超出颜色数组，使用默认黑色
};

const enterArticleDetail = (id) => {
    router.push({ path: `/articledetail/${id}` });
};

const refreshArticles = () => {
    totalArticlesLoaded.value = 0; // 重置已加载的文章总数
    emit('refresh');
};

const loadMoreData = () => {
    totalArticlesLoaded.value += props.articles.length; // 更新已加载的文章总数
};
</script>

<template>
    <div class="article-rank-item">
        <div class="article-rank-item_container">
            <div class="article-rank-item_header">
                <i class="iconfont icon-zuozhe"></i>
                <span>文章榜单</span>
                <i class="iconfont icon-gengxin" @click="refreshArticles" style="cursor: pointer"></i>
            </div>
            <hr class="article-rank-divider" />
            <div class="article-rank-item_content">
                <div v-for="article in processedArticles" :key="article.id" class="article-rank-item_single">
                    <div class="rank-icon">
                        <span class="article-rank-index" :style="{ color: getRankColor(article.rank) }">
                            {{ article.rank }}
                        </span>
                    </div>
                    <div class="article-rank-item_info" @click="enterArticleDetail(article.id)">
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
    cursor: pointer;
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

.icon-zuozhe {
    font-size: 24px;
    color: #19a059;
}

.icon-gengxin {
    font-size: 24px;
    color: #a9a5a5;
    float: right;
    margin-right: 20px;
    cursor: pointer;
}
</style>
