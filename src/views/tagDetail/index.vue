<script setup>
import { ref, onMounted, watch } from 'vue';
import Article from '../components/article/index.vue';
import CurrentTagItem from '../components/CurrentTagItem/CurrentTagItem.vue';
import { getTagList, Tag_follow, getArticleByTag } from '../../config/apis/tag';
import { useRoute } from 'vue-router';
import { NTabs, NTabPane, NInfiniteScroll } from 'naive-ui';
import _ from 'lodash'; // 导入 Lodash

const route = useRoute();
const tags = ref([]); // 使用数组初始化
const dataObj = ref({
    id: route.params.id,
    kind: 0,
    page: 1,
    limit: 4
});

const currentTag = ref(null); // 存储当前标签的详细信息
const articles = ref([]); // 存储文章数据
const isLoading = ref(false);
const noMore = ref(false);
const currentTab = ref('0'); // 当前选中的标签

onMounted(async () => {
    try {
        const response = await getTagList();
        if (response.code === 2000 && Array.isArray(response.data.tag_list)) {
            tags.value = response.data.tag_list;
            fetchCurrentTag(route.params.id); // 初始加载时获取当前标签信息
        } else {
            console.error('获取标签数据失败');
        }
    } catch (error) {
        console.error('请求标签数据出错:', error);
    }
    await fetchArticles();
});

watch(
    () => route.params.id,
    (newId, oldId) => {
        if (newId !== oldId) {
            fetchCurrentTag(newId);
            fetchArticles();
        }
    }
);

watch(currentTab, async (newTab) => {
    dataObj.value.kind = newTab === '0' ? 0 : 1;
    dataObj.value.page = 1; // 重置页码
    articles.value = []; // 清空文章列表
    await fetchArticles();
});

const fetchCurrentTag = (tagId) => {
    const tag = tags.value.find((tag) => tag.id === parseInt(tagId));
    if (tag) {
        currentTag.value = tag;
    } else {
        console.error('未找到当前标签');
    }
};

const follow_tag = async (id) => {
    try {
        const response = await Tag_follow({ id: id });
        if (response.code === 2000) {
            // 重新获取标签列表
            const tagsResponse = await getTagList();
            if (tagsResponse.code === 2000 && Array.isArray(tagsResponse.data.tag_list)) {
                tags.value = tagsResponse.data.tag_list;
                // 更新当前标签的详细信息
                fetchCurrentTag(route.params.id);
            } else {
                console.error('获取标签数据失败');
            }
        } else {
            console.error('关注标签失败:', response.message);
        }
    } catch (error) {
        console.error('Error following tag:', error);
    }
};

const fetchArticles = async () => {
    try {
        const response = await getArticleByTag(dataObj.value);
        if (response.code === 2000) {
            articles.value = response.data.article_list;
        } else {
            console.error('获取标签下的文章失败');
        }
    } catch (error) {
        console.error('请求标签下的文章出错:', error);
    }
};

const loadMoreData = async () => {
    if (isLoading.value || noMore.value) return;
    isLoading.value = true;
    dataObj.value.page++;
    const response = await getArticleByTag(dataObj.value);
    if (response.code === 2000 && response.data.article_list.length > 0) {
        articles.value.push(...response.data.article_list);
    } else {
        noMore.value = true;
        dataObj.value.page--;
    }
    isLoading.value = false;
};

const loadInitDebounce = _.debounce(loadMoreData, 300); // 使用 Lodash 的 debounce 函数
</script>

<template>
    <div class="content">
        <div class="container">
            <div class="tag-list-container">
                <CurrentTagItem v-if="currentTag" :tag="currentTag" @follow="follow_tag" />
            </div>
            <div class="search-mid">
                <n-tabs type="line" animated v-model:value="currentTab">
                    <n-tab-pane name="0" tab="热门">
                        <img src="../../assets/images/noSelect.png" alt="" v-if="articles.length === 0" />
                        <n-infinite-scroll style="height: 800px" :distance="10" @load="loadInitDebounce">
                            <Article v-for="article in articles" :key="article.id" :item="article" />
                        </n-infinite-scroll>
                    </n-tab-pane>
                    <n-tab-pane name="1" tab="最新">
                        <img src="../../assets/images/noSelect.png" alt="" v-if="articles.length === 0" />
                        <n-infinite-scroll style="height: 800px" :distance="10" @load="loadInitDebounce">
                            <Article v-for="article in articles" :key="article.id" :item="article" />
                        </n-infinite-scroll>
                    </n-tab-pane>
                </n-tabs>
                <div class="loading" v-if="isLoading && !noMore">
                    <!-- <span class="videos">
                    <video src="../../assets/images/loading.mp4" autoplay loop muted></video>
                </span> -->
                    <span class="text">正在全力加载中...</span>
                </div>
                <div v-if="noMore" class="loading">-没有更多了-</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.content {
    display: flex;
    /* justify-content: center; */
}
.wrapper {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    min-height: 100vh; /* 使 wrapper 至少占满视口高度 */
    padding: 20px; /* 可以根据需要调整内边距 */
}

.container {
    width: 100%;
    max-width: 1200px; /* 最大宽度，防止内容过宽 */
    padding: 0;
    box-sizing: border-box; /* 确保 padding 不影响宽度 */
    margin: 0 auto; /* 让 container 水平居中 */
}

.tag-list-container {
    width: 100%;
}

.search-mid {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    background-color: white;
    margin-top: 20px;
    /* 根据需要调整宽度 */
    margin: 20px auto; /* 水平居中 */
    text-align: left; /* 确保内容不居中 */
}

.loading {
    text-align: center;
    padding: 20px;
}

.iconfont {
    font-size: 24px;
    color: #19a059;
}
</style>
