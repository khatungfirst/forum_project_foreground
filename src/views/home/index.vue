<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { NTabs, NTabPane } from 'naive-ui';
import AuthorRankItem from '../components/AuthorRankItem/index.vue';
import ArticleRankItem from '../components/ArticleRankItem/index.vue';
import SearchMiddleBox from '@/views/searchPage/searchMiddleBox/index.vue';
import followArticle from '../components/followArticle/followArticle.vue';
import Article from '../components/article/index.vue';
import { author_rank } from '@/config/apis/author';
import { article_rank } from '@/config/apis/articleDetail';
import { debounce } from '../../utils/debounce';
import { concernInter } from '@/config/apis/articleDetail';
import { getSelectArticle } from '@/config/apis/select';
import { follower_article } from '@/config/apis/articleDetail';
import { NButton } from 'naive-ui';
import PublishButton from '../components/PublishButton/index.vue';

import { useTouristPattern } from '@/config/store/touristPattern';
import { useUserStore } from '@/config/store/userStore';
import author from '@/views/components/Author/index.vue';
const userStore = useUserStore();
const user_id = userStore.userInfo?.id || 0;
const router = useRouter();
const authors = ref([]); // 存储作者数据
const articles = ref([]); // 存储文章数据
const categoryMapping = ref({
    综合: '0',
    前端: '1',
    后端: '2'
});
const selectedTab = ref('综合'); // 当前选中的 Tab
const category_id = ref(categoryMapping.value[selectedTab.value]);
const selectData = ref([]); // 存储文章列表数据
const isLoading = ref(false);
const noMore = ref(false);
const dataObj = ref({
    keyword: '',
    category_id: categoryMapping.value[selectedTab.value],
    page: 1,
    limit: 4,
    kind: '0'
});
const currentPage = ref(1); // 当前作者页码
const currentArticlePage = ref(1); // 当前文章页码
const isAuthorDataShort = ref(false); // 作者数据是否不足五条
const isArticleDataShort = ref(false); // 文章数据是否不足五条
// 增加 authorToFollow 响应式变量,用于存储即将关注的作者 ID
const authorToFollow = ref<number | null>(null);

const useTourist = useTouristPattern();
//控制显示骨架屏
// const isSkeletonAuthor = ref(false);

//----------------------------游客模式---------------------------------

//控制登录组件是否出现
const loginAppear = ref(false);

//触发登录的事件类型
const triggerType = ref('');

//告知子组件是否已经登录完毕
const isLogin = ref(false);

//登录后继续执行操作
// const performOperation = (type: string) => {
//     loginAppear.value = false;
//     switch (type) {
//         case '关注':
//             // 实现自动关注的方法
//             isLogin.value = true;
//             break;
//     }
// };
const performOperation = (type: string) => {
    loginAppear.value = false;
    switch (type) {
        case '关注':
            // 自动关注
            if (authorToFollow.value !== null) {
                followAuthor({
                    id: authorToFollow.value,
                    is_followed: 1
                });
            }
            isLogin.value = true;
            break;
    }
};
watch(
    () => useTourist.triggerType,
    (newVal) => {
        loginAppear.value = true;
        triggerType.value = newVal;
    }
);

const handleCloseAuthor = () => {
    loginAppear.value = false;
};

onMounted(async () => {
    await fetchAuthors();
    await fetchArticles();
    init();
});

const fetchAuthors = async () => {
    if (currentPage.value > 4) {
        currentPage.value = 1;
    }
    // isSkeletonAuthor.value = true;
    // console.log('isSkeletonAuthor.value:'.isSkeletonAuthor.value);
    const response = await author_rank({ page: currentPage.value, limit: 5, id: user_id });
    if (response.code === 2000) {
        // isSkeletonAuthor.value = false;
        // console.log('isSkeletonAuthor.value:'.isSkeletonAuthor.value);
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
    if (currentArticlePage.value > 4) {
        currentArticlePage.value = 1;
    }
    const response = await article_rank({ page: currentArticlePage.value, limit: 5 });
    if (response.code === 2000) {
        articles.value = response.data.selectedList;
        isArticleDataShort.value = response.data.selectedList.length < 5; // 记录数据是否不足五条
    } else {
        console.error('获取文章排名失败');
    }
};

// const init = async () => {
//     const { data } = await getSelectArticle(dataObj.value);
//     if (data) {
//         selectData.value = data.selectedList;
//     }
// };

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
    selectedTab.value = value;
    category_id.value = categoryMapping.value[value];
};

const tabMiddle = (value) => {
    dataObj.value.kind = value;
    init();
};

const followAuthor = async (payload: { id: number; is_followed: number }) => {
    if (userStore.token === '') {
        // 存储当前作者 ID
        authorToFollow.value = payload.id;
        loginAppear.value = true;
        triggerType.value = '关注';
    } else {
        const { id, is_followed } = payload;
        const author = authors.value.find((author) => author.id === id);
        if (!author) return;

        try {
            const response = await concernInter({ followed_id: id });
            if (response.code === 2000) {
                console.log(`关注作者成功`);
                author.is_followed = is_followed;
                // 清空 authorToFollow
                authorToFollow.value = null;
            } else {
                console.error(`关注作者失败`, response.message);
                alert(`关注失败: ${response.message}`);
            }
        } catch (error) {
            console.error(`关注作者出错`, error);
            alert(`关注出错: ${error.message}`);
        }
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
    <div class="content">
        <div class="container">
            <div class="overlay" v-if="loginAppear"></div>
            <author
                v-if="loginAppear"
                class="loginCom"
                :type="triggerType"
                @trigger-type="performOperation"
                @close-author="handleCloseAuthor"
            ></author>
            <div class="home">
                <!-- 主内容区 -->
                <div class="main-content">
                    <div class="middle">
                        <div class="left">
                            <n-tabs
                                type="card"
                                animated
                                @update:value="tabTop"
                                v-model:value="selectedTab"
                                placement="left"
                                tab-class="father-tab"
                                class="fatherrr"
                            >
                                <n-tab-pane name="综合" tab="综合">
                                    <SearchMiddleBox :category_id="category_id" />
                                </n-tab-pane>
                                <n-tab-pane name="前端" tab="前端">
                                    <SearchMiddleBox :category_id="category_id" />
                                </n-tab-pane>
                                <n-tab-pane name="后端" tab="后端">
                                    <SearchMiddleBox :category_id="category_id" />
                                </n-tab-pane>
                                <n-tab-pane name="关注" tab="关注">
                                    <followArticle></followArticle>
                                </n-tab-pane>
                            </n-tabs>
                            <!-- <div class="search-mid">
                            <n-tabs type="line" animated @update:value="tabMiddle" v-model:value="dataObj.kind">
                                <n-tab-pane name="0" tab="">
                                    <Article :item="item" v-for="(item, index) in selectData" :key="index"></Article>
                                </n-tab-pane>
                                <n-tab-pane name="1" tab="">
                                    <Article :item="item" v-for="(item, index) in selectData" :key="index"></Article>
                                </n-tab-pane>
                            </n-tabs>
                        </div> -->
                        </div>
                    </div>
                </div>
                <!-- 侧边栏（作家榜单与文章榜单） -->
                <div class="side-bar">
                    <div class="article-rank-list">
                        <ArticleRankItem
                            :articles="articles"
                            :page="currentArticlePage"
                            :limit="5"
                            @refresh="refreshArticles"
                        />
                        <!-- :isSkeletonAuthor="isSkeletonAuthor" -->
                    </div>
                    <div class="author-rank-list">
                        <AuthorRankItem
                            :authors="authors"
                            :page="currentPage"
                            :limit="5"
                            @follow="followAuthor"
                            @refresh="refreshAuthors"
                        />
                    </div>
                    <PublishButton></PublishButton>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixin.scss' as *;
.red {
    color: red;
}

.content {
    display: flex;
    justify-content: center;
}

.container {
    padding: 0 20px 20px 20px;

    // text-align: center;
    // margin: 0 auto;
    width: 80%;
    margin-top: 55px;
}
@include overlay;
.loginCom {
    z-index: 1000;
    position: fixed;
    left: 50%;
    top: 50px;
    transform: translateX(-50%);
    background-color: #fff;
}
.home {
    display: flex;
    flex-direction: row;
    height: 100vh;
    // padding: 0 90px;
    width: 100%;
    // margin: 0 auto;
}

.main-content {
    flex-grow: 1;
    // padding: 15px;
    overflow: hidden;
    margin-right: 20px;
    border-radius: 5px;
    width: 74%;
}

.side-bar {
    width: 21%;
    background-color: #f2f3f5;
    // overflow-y: auto;
}

.author-rank-list,
.article-rank-list {
    padding: 10px;
    background-color: #fff;
    border-radius: 5px;
    // box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.search-mid {
    display: flex;
    flex-direction: column;
    border-radius: 5px;
}

.search-mid img {
    width: 100%;
    height: auto;
}

.load-ing {
    text-align: center;
    padding: 20px;
}

.iconfont {
    font-size: 24px;
    color: #19a059;
}

.n-tabs :deep(.n-tabs-tab__label) {
    font-size: 16px;
}

// ::v-deep(.n-scrollbar-content) {
//     padding-bottom: 140px;
// }

.load-ing {
    margin-top: 15px;
    text-align: center;
    width: 100%;
    color: #7d8791;
    bottom: 25px;
}

.middle {
    width: 100%;
    // height: 90%;
    margin: 0 auto;
    display: flex;
    .left {
        @include all;
        .n-tabs {
            height: 100%;
        }
        .n-tabs :deep(.n-tabs-nav) {
            margin-right: 22px;
        }

        .n-tabs :deep(.n-tab-pane) {
            width: 100%;
            background-color: #fff;
            padding: 0px;
            border-radius: 5px;
        }

        .n-tabs :deep(.n-tabs-wrapper) {
            display: flex;
            // justify-content: center;
            flex-wrap: nowrap;
            position: relative;
            padding: 0 15px;
        }

        .n-tabs :deep(.n-tabs-tab) {
            background-color: #fff;
            border: none;
            border-radius: 40px;

            margin: 0 auto;
            margin-top: 15px;
        }
        :deep(.father-tab.n-tabs-tab) {
            // background-color: #daf0e4;
            color: #8d9ec2;
            font-size: 15px;
        }
        :deep(.father-tab.n-tabs-tab--active) {
            background-color: #daf0e4;
            height: 40px;
            width: 130px;
            border-radius: 40px;
            color: #1ea05a;
            text-align: center;
            justify-content: center;
        }
        .n-tab-pane :deep(.search-mid) {
            width: 100%;
        }
        .n-tab-pane :deep(.search-mid .n-tabs) {
            padding: 10px 20px 0px 30px;
        }
        .fatherrr.n-tabs :deep(.n-tabs-nav-y-scroll) {
            height: 260px;
            background-color: #fff;
            border-radius: 5px;
        }

        span {
            margin-left: 5px;
        }
    }
}
:deep(.n-tabs-nav--card-type n-tabs-nav--left n-tabs-nav) {
    height: 240px;
}
</style>
