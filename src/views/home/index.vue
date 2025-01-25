<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { NTabs, NTabPane } from 'naive-ui';
import AuthorRankItem from '../components/AuthorRankItem/index.vue';
import ArticleRankItem from '../components/ArticleRankItem/index.vue';
import SearchMiddleBox from '@/views/searchPage/searchMiddleBox/index.vue';
import Article from '../components/article/index.vue';
import { author_rank } from '@/config/apis/author';
import { article_rank } from '@/config/apis/articleDetail';
import { debounce } from '../../utils/debounce';
import { concernInter } from '@/config/apis/articleDetail';
import { getSelectArticle } from '@/config/apis/select';
import { follower_article } from '@/config/apis/articleDetail';
import { NButton } from 'naive-ui';

const router = useRouter();
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
const currentPage = ref(1); // 当前作者页码
const currentArticlePage = ref(1); // 当前文章页码
const isAuthorDataShort = ref(false); // 作者数据是否不足五条
const isArticleDataShort = ref(false); // 文章数据是否不足五条

onMounted(async () => {
    await fetchAuthors();
    await fetchArticles();
    init();
});

const fetchAuthors = async () => {
    const response = await author_rank({ page: currentPage.value, limit: 5 });
    if (response.code === 2000) {
        const validAuthors = response.data.user_heat_rank.filter((author) => author !== null);
        const cleanedAuthors = validAuthors.map((author) => ({
            ...author,
            avatar_path: author.avatar_path ? author.avatar_path.replace(/<[^>]*>/g, '') : null
        }));
        authors.value = cleanedAuthors;
        isAuthorDataShort.value = cleanedAuthors.length < 5; // 记录数据是否不足五条
    } else {
        console.error('获取作家排名失败');
    }
};

const fetchArticles = async () => {
    const response = await article_rank({ page: currentArticlePage.value, limit: 5 });
    if (response.code === 2000) {
        articles.value = response.data.selectedList;
        isArticleDataShort.value = response.data.selectedList.length < 5; // 记录数据是否不足五条
    } else {
        console.error('获取文章排名失败');
    }
};

const init = async () => {
    // const { data } = await getSelectArticle(dataObj.value);
    if (data) {
        selectData.value = data.selectedList;
    }
};

const loadMoreData = async () => {
    if (isLoading.value || noMore.value) return;
    isLoading.value = true;
    dataObj.value.page++;
    const response = await getArticleByTag(dataObj.value);
    if (response.code === 2000 && response.data.article_list.length > 0) {
        articles.value.push(...response.data.article_list);
        totalArticlesLoaded.value += response.data.article_list.length; // 更新已加载的文章总数
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

const followAuthor = async (payload) => {
    const { id, is_followed } = payload;
    const author = authors.value.find((author) => author.id === id);
    if (!author) return;

    try {
        const response = await concernInter({ followed_id: id });
        if (response.code === 2000) {
            console.log(`关注作者成功`);
            author.is_followed = is_followed;
        } else {
            console.error(`关注作者失败`, response.message);
            alert(`关注失败: ${response.message}`);
        }
    } catch (error) {
        console.error(`关注作者出错`, error);
        alert(`关注出错: ${error.message}`);
    }
};

const handleReleaseArticle = () => {
    router.push({ path: '/articlerelease/0' }); // 路由跳转发布文章页
};

const refreshAuthors = () => {
    if (isAuthorDataShort.value) {
        currentPage.value = 1; // 如果数据不足五条，重置页码为 1
    } else {
        currentPage.value++; // 递增页码
    }
    fetchAuthors();
};

const refreshArticles = () => {
    if (isArticleDataShort.value) {
        currentArticlePage.value = 1; // 如果数据不足五条，重置页码为 1
    } else {
        currentArticlePage.value++; // 递增页码
    }
    fetchArticles();
};
</script>

<template>
    <div class="home">
        <!-- 主内容区 -->
        <div class="main-content">
            <div class="middle">
                <div class="left">
                    <n-tabs
                        type="card"
                        animated
                        @update:value="tabTop"
                        v-model:value="category_id"
                        style="padding: 10px 20px"
                        placement="left"
                        class="red"
                    >
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
            </div>
            <div class="search-mid">
                <n-tabs type="line" animated @update:value="tabMiddle" v-model:value="dataObj.kind">
                    <n-tab-pane name="0" tab="">
                        <!-- <img src="../../assets/images/noSelect.png" alt="" v-if="selectData.length === 0" /> -->
                        <n-infinite-scroll style="height: 800px" :distance="10" @load="loadInitDebounce">
                            <Article :item="item" v-for="(item, index) in selectData" :key="index"></Article>
                        </n-infinite-scroll>
                    </n-tab-pane>
                    <n-tab-pane name="1" tab="">
                        <!-- <img src="../../assets/images/noSelect.png" alt="" v-if="selectData.length === 0" /> -->
                        <n-infinite-scroll style="height: 800px" :distance="10" @load="loadInitDebounce">
                            <Article :item="item" v-for="(item, index) in selectData" :key="index"></Article>
                        </n-infinite-scroll>
                    </n-tab-pane>
                </n-tabs>
                <div class="loading" v-if="isLoading && !noMore">
                    <!-- <span class="videos">
                        <video src="../../assets/images/loading.mp4" autoplay loop muted></video>
                    </span>
                    <span class="text">正在全力加载中...</span> -->
                </div>
                <div v-if="noMore" class="loading">没有更多了 🤪</div>
            </div>
        </div>
        <!-- 侧边栏（作家榜单与文章榜单） -->
        <div class="side-bar">
            <div class="article-rank-list">
                <ArticleRankItem :articles="articles" @refresh="refreshArticles" />
            </div>
            <div class="author-rank-list">
                <AuthorRankItem :authors="authors" @follow="followAuthor" @refresh="refreshAuthors" />
            </div>

            <div class="publish-icon-border" @click="handleReleaseArticle">
                <i class="iconfont icon-bianji"></i>
            </div>
            <n-button strong secondary round type="primary" class="button hide-button">
                <i class="iconfont icon-bianji"></i>
                <span class="publish-text">发文</span>
            </n-button>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/mixin.scss';

.red {
    color: red;
}
.home {
    display: flex;
    flex-direction: row;
    height: 100vh;
    padding: 10px 90px;
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

.iconfont {
    font-size: 24px;
    color: #19a059;
}

.publish-icon-border {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    background-color: white;
    border-radius: 50%;
    margin-top: 20px;
    margin-left: 220px;
    cursor: pointer; /* 添加鼠标停显示为手型 */
    position: relative; /* 相对定位，为子元素做准备 */
}
.button {
    display: none;
}
.publish-icon-border:hover ~ .button {
    display: block; /* 鼠标悬停上时显示按钮 */
    position: relative;
    top: -65px; /* 向上移动10px */
    left: 180px;
    transform: translateX(-50%); /* 水平居中 */
    opacity: 1; /* 文字不透明度 */
}

.iconfont.icon-bianji {
    font-size: 24px;
    color: #19a059;
}
.n-tabs :deep(.n-tabs-tab__label) {
    font-size: 16px;
}

.middle {
    width: 85%;
    height: 90%;
    margin: 0 auto;
    display: flex;
    .left {
        @include all;
        .n-tabs {
            height: 100%;
        }

        .n-tabs :deep(.n-tabs-nav) {
            background-color: #fff;
            margin-right: 15px;
        }

        .n-tabs :deep(.n-tab-pane) {
            width: 100%;
            background-color: #fff;
            padding: 0px;
        }

        .n-tabs :deep(.n-tabs-tab-wrapper) {
            width: 240px;
            border-radius: 40px;
            height: 60px;
            @include flex;
        }

        .n-tabs :deep(.n-tabs-tab) {
            background-color: #fff;
            border: none;
            border-radius: 40px;
            font-size: 15px;
            color: #8d9ec2;
        }

        .n-tabs :deep(.n-tabs-tab--active) {
            background-color: #daf0e4;
            height: 40px;
            width: 130px;
            border-radius: 40px;
            color: #1ea05a;
        }

        span {
            margin-left: 5px;
        }
    }
}
</style>
