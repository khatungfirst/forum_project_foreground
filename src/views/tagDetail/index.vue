<script setup>
import { ref, onMounted, watch } from 'vue';
import Article from '../components/article/index.vue';
import CurrentTagItem from '../components/CurrentTagItem/CurrentTagItem.vue';
import { getTagList, Tag_follow, getArticleByTag } from '../../config/apis/tag';
import { useRoute } from 'vue-router';
import { NTabs, NTabPane, NInfiniteScroll } from 'naive-ui';
import _ from 'lodash'; // 导入 Lodash
import { useUserStore } from '@/config/store/userStore';
import PublishButton from '../components/PublishButton/index.vue';
// import { debounce } from '@/utils/debounce.ts';
const userStore = useUserStore();
const user_id = userStore.userInfo?.id || 0;
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
        const response = await getTagList({ user_id: user_id });
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
        console.log('currentTag', currentTag);
    } else {
        console.error('未找到当前标签');
    }
};

const follow_tag = async (id) => {
    try {
        const response = await Tag_follow({ id: id });
        if (response.code === 2000) {
            // 重新获取标签列表
            const tagsResponse = await getTagList({ user_id: user_id });
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
// 应用防抖到关注函数
// const debouncedConcernPost = debounce(concern, 500);
const currentTagStatus = computed(() => {
    const tag = tags.value.find((tag) => tag.id === currentTag.value.id);
    return tag?.status || 1; // 默认值为 1（未关注）
});
</script>

<template>
    <CurrentTagItem v-if="currentTag" :tag="currentTag" @follow="follow_tag" :showFollowButton="false"></CurrentTagItem>

    <div class="container">
        <div class="search-mid">
            <n-tabs type="line" animated v-model:value="currentTab">
                <template #suffix>
                    <div class="button">
                        <n-button
                            strong
                            secondary
                            round
                            type="primary"
                            @click="follow_tag(currentTag.id)"
                            icon-placement="right"
                            v-if="currentTagStatus === 1"
                        >
                            关注
                        </n-button>
                        <n-button
                            v-else
                            strong
                            secondary
                            round
                            type="primary"
                            :loading="loadButton"
                            icon-placement="right"
                            @click="follow_tag(currentTag.id)"
                        >
                            已关注
                        </n-button>
                    </div>
                </template>
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
                <div class="tag-item_follow" v-if="showFollowButton">
                    <button class="tag-item_button" @click="handleFollow">
                        {{ tag.status === 1 ? '已关注√' : '关注' }}
                    </button>
                </div>
            </n-tabs>
            <div class="loading" v-if="isLoading && !noMore">
                <!-- <span class="videos">
                    <video src="../../assets/images/loading.mp4" autoplay loop muted></video>
                </span> -->
                <span class="text">加载中，数据正在飞速赶来~</span>
            </div>
            <div v-if="noMore" class="loading">-已经触及俺的底线啦~-</div>
        </div>
    </div>
    <PublishButton></PublishButton>
</template>

<style scoped>
:deep(.tag-item-single) {
    margin-top: 33px;
    padding: 40px 0 30px 220px;
}
.n-tabs :deep(.n-tabs-tab__label) {
    font-size: 16px;
}

.button {
    cursor: pointer;
    background-color: #f0f0f0;
    border: none;
    border-radius: 50px;
    outline: none;
    color: #19a059;
    /* padding: 8px 125px; */
    /* margin: 6px 0; */
    /* padding: 5px 0; */
    width: 40%;
}

.container {
    box-sizing: border-box; /* 确保 padding 不影响宽度 */
    margin: 0 auto;
    margin-top: 20px;
    width: 80%;
}

.search-mid {
    display: flex;
    flex-direction: column;
    /* gap: 20px; */
    padding: 20px;
    background-color: white;
    margin-top: 20px;
    /* 根据需要调整宽度 */
    margin: 20px 0;
    text-align: left; /* 确保内容不居中 */
    /* max-width: 1200px; */
}

.loading {
    text-align: center;
    padding: 20px;
}

.iconfont {
    font-size: 24px;
    color: #19a059;
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
