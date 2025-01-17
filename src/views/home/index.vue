<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { NTabs, NTabPane } from 'naive-ui';
import AuthorRankItem from '../components/AuthorRankItem/index.vue';
import ArticleRankItem from '../components/ArticleRankItem/index.vue';
import SearchMiddleBox from '@/views/searchPage/searchMiddleBox/index.vue';
import Article from '../components/article/index.vue';
import { author_rank } from '@/config/apis/author';
import { article_rank } from '@/config/apis/articleDetail';
import { debounce } from '../../utils/debounce';

const authors = ref([]); // 存储作者数据
const articles = ref([]); // 存储文章数据
const category_id = ref('1');
const selectData = ref([]); // 存储文章列表数据
const isLoading = ref(false);
const noMore = ref(false);
const dataObj = ref({
    keyword: '',
    category_id: '1',
    page: 1,
    limit: 4,
    kind: '0'
});

onMounted(async () => {
    await fetchAuthors();
    await fetchArticles();
    init();
});

const fetchAuthors = async () => {
    const response = await author_rank({ page: 1, limit: 5 });
    if (response.code === 2000) {
        authors.value = response.data.user_heat_rank;
    } else {
        console.error('获取作家排名失败');
    }
};

const fetchArticles = async () => {
    const response = await article_rank({ page: 1, limit: 5 });
    if (response.code === 2000) {
        articles.value = response.data.selectedList;
    } else {
        console.error('获取文章排名失败');
    }
};

const init = async () => {
    const { data } = await getSelectArticle(dataObj.value);
    if (data) {
        selectData.value = data.selectedList;
    }
};

const loadMoreData = async () => {
    if (isLoading.value || noMore.value) return;
    isLoading.value = true;
    dataObj.value.page++;
    const { data } = await getSelectArticle(dataObj.value);
    if (data) {
        selectData.value.push(...data.selectedList);
    } else {
        noMore.value = true;
        dataObj.value.page--;
    }
    isLoading.value = false;
};

const loadInitDebounce = debounce(loadMoreData, 300);

const tabTop = (value) => {
    category_id.value = value;
};

const tabMiddle = (value) => {
    dataObj.value.kind = value;
    init();
};

const followAuthor = async (id) => {
    const author = authors.value.find((author) => author.id === id);
    if (author && author.is_followed === 2) {
        alert('您无法关注自己');
        return;
    }
    try {
        const response = await concernInter(id);
        if (response.code === 2000) {
            console.log('作者关注成功');
            const index = authors.value.findIndex((author) => author.id === id);
            if (index !== -1) {
                authors.value[index].is_followed = 1;
            }
        } else {
            console.error('关注作者失败:', response.message);
        }
    } catch (error) {
        console.error('关注作者出错:', error);
    }
};
</script>

<template>
    <div class="home">
        <!-- 主内容区 -->
        <div class="main-content">
            <div class="middle">
                <n-tabs type="line" animated @update:value="tabTop" v-model:value="category_id">
                    <n-tab-pane name="1" tab="综合">
                        <SearchMiddleBox :category_id="category_id" />
                    </n-tab-pane>
                    <n-tab-pane name="2" tab="前端">
                        <SearchMiddleBox :category_id="category_id" />
                    </n-tab-pane>
                    <n-tab-pane name="3" tab="后端">
                        <SearchMiddleBox :category_id="category_id" />
                    </n-tab-pane>
                    <n-tab-pane name="4" tab="关注">
                        <SearchMiddleBox :category_id="category_id" />
                    </n-tab-pane>
                </n-tabs>
            </div>
            <div class="search-mid">
                <n-tabs type="line" animated @update:value="tabMiddle" v-model:value="dataObj.kind">
                    <n-tab-pane name="0" tab="">
                        <img src="../../../assets/images/noSelect.png" alt="" v-if="selectData.length === 0" />
                        <n-infinite-scroll style="height: 800px" :distance="10" @load="loadInitDebounce">
                            <Article :item="item" v-for="(item, index) in selectData" :key="index"></Article>
                        </n-infinite-scroll>
                    </n-tab-pane>
                    <n-tab-pane name="1" tab="">
                        <img src="../../../assets/images/noSelect.png" alt="" v-if="selectData.length === 0" />
                        <n-infinite-scroll style="height: 800px" :distance="10" @load="loadInitDebounce">
                            <Article :item="item" v-for="(item, index) in selectData" :key="index"></Article>
                        </n-infinite-scroll>
                    </n-tab-pane>
                </n-tabs>
                <div class="loading" v-if="isLoading && !noMore">
                    <span class="videos">
                        <video src="../../../assets/images/loading.mp4" autoplay loop muted></video>
                    </span>
                    <span class="text">正在全力加载中...</span>
                </div>
                <div v-if="noMore" class="loading">没有更多了 🤪</div>
            </div>
        </div>
        <!-- 侧边栏（作家榜单与文章榜单） -->
        <div class="side-bar">
            <div class="article-rank-list">
                <ArticleRankItem :articles="articles" />
            </div>
            <div class="author-rank-list">
                <AuthorRankItem :authors="authors" @follow="followAuthor" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.home {
    display: flex;
    flex-direction: row;
    height: 100vh;
}

.middle {
    background-color: #ffffff;
}

.main-content {
    flex-grow: 1;
    padding: 15px;
    overflow-y: auto;
    margin-right: 20px;
}

.side-bar {
    width: 300px; /* 侧边栏宽度 */
    background-color: #f2f3f5;
    overflow-y: auto;
    margin-left: 15px; /* 与主内容区的间距 */
}

.author-rank-list,
.article-rank-list {
    padding: 10px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.search-mid {
    display: flex;
    flex-direction: column;
}

.search-mid img {
    width: 100%;
    height: auto;
}

.loading {
    text-align: center;
    padding: 20px;
}
</style>
