<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import Article from '@/views/components/article/index.vue';
import { follower_article } from '@/config/apis/articleDetail';
import { debounce } from '@/utils/debounce.ts';
import { useUserStore } from '@/config/store/userStore';
import skeleton from '@/views/components/skeleton/index.vue';
// 存储关注的人的文章数据
const followedArticles = ref([]);
const userStore = useUserStore();
const emit = defineEmits(['follow']);

// 获取关注的人的文章
const fetchFollowedArticles = async () => {
    if (userStore.token === '') {
        emit('follow');
        isSkeleton.value = false; // 确保骨架屏隐藏
        return;
    } else {
        console.log('触发获取关注的人文章', 111);
        const response = await follower_article({
            page: dataObj.page,
            limit: dataObj.limit,
            kind: dataObj.kind
        });
        if (response.code === 2000) {
            followedArticles.value = response.data.article_list;
        } else {
            console.error('获取关注的人的文章失败', response.message);
        }
        isSkeleton.value = false; // 数据加载完成后隐藏骨架屏
    }
};
//控制显示骨架屏
const isSkeleton = ref(true);
//--------------------------------------生命周期-------------------------------------

onMounted(async () => {
    init();
    fetchFollowedArticles();
    window.addEventListener('scroll', scrollLoad);
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', scrollLoad);
});

//---------------------------------------初始化-------------------------------------
// 用来存放后端传来的相关数据
const selectData = ref([]);

// 表示是否有数据
const isHaveData = ref(true);

const dataObj = reactive({
    page: 1,
    limit: 5,
    kind: '0'
});

const init = async () => {
    selectData.value = [];
    isSkeleton.value = true;
    console.log('关注:', isLoading);
    const { data } = await follower_article(dataObj);
    if (data && data.article_list.length > 0) {
        console.log('关注111:', isLoading);
        selectData.value = data.article_list;
        isHaveData.value = false;
        if (!data.next) {
            noMore.value = true;
        }
    } else {
        isHaveData.value = true;
    }
    isSkeleton.value = false; // 数据加载完成后隐藏骨架屏
};

//----------------------------------加载后获取数据-------------------------------------
// 是否正在加载
const isLoading = ref(false);

// 表示是否还有数据
const noMore = ref(false);

// 获取到最外层盒子的对象
const dataContainer = ref(null);

const loadInit = async () => {
    if (isLoading.value) return;
    isLoading.value = true;
    console.log('关注:', isLoading);
    if (!noMore.value) {
        setTimeout(async () => {
            dataObj.page++;
            const { data } = await follower_article(dataObj);
            if (data && data.article_list.length > 0 && selectData) {
                selectData.value.push(...data.article_list);
            } else {
                dataObj.page--;
                noMore.value = true;
            }
            isLoading.value = false;
        }, 200);
    }
};
const loadInitDebounce = debounce(loadInit, 300);

// 中间标签页改变时的触发事件
const tabMiddle = (value: string) => {
    dataObj.kind = value;
    init();
};

const scrollLoad = () => {
    // 获取当前滚动位置
    const scrollTop = window.scrollY;
    // 获取页面的总高度
    const windowHeight = window.innerHeight;
    // 获取页面的滚动高度
    const scrollHeight = document.documentElement.scrollHeight;

    // 判断是否滚动到页面底部
    if (scrollTop + windowHeight + 1 >= scrollHeight) {
        console.log('滚动到底部');
        loadInitDebounce();
    }
};
</script>

<template>
    <div class="search-mid">
        <n-tabs type="line" animated @update:value="tabMiddle" v-model:value="dataObj.kind">
            <n-tab-pane name="0" tab="热门" ref="dataContainer" style="min-height: 750px">
                <skeleton v-if="isSkeleton"></skeleton>
                <img src="../../../assets/images/noSelect.png" alt="" v-if="isHaveData && !isSkeleton" class="img" />
                <n-infinite-scroll
                    style="min-height: 750px"
                    :distance="20"
                    @load="loadInitDebounce"
                    v-if="!isHaveData && !isSkeleton"
                >
                    <Article :item="item" v-for="(item, index) in selectData" :key="index"></Article>
                    <div class="load-ing">
                        <span class="text" v-if="isLoading && !noMore">加载中，数据正在飞速赶来~</span>
                        <span v-if="noMore" class="text">-已经触及俺的底线啦~-</span>
                    </div>
                </n-infinite-scroll>
            </n-tab-pane>
            <n-tab-pane name="1" tab="最新" ref="dataContainer" style="min-height: 750px">
                <skeleton v-if="isSkeleton"></skeleton>
                <img src="../../../assets/images/noSelect.png" alt="" v-if="isHaveData && !isSkeleton" />
                <n-infinite-scroll style="min-height: 750px" :distance="20" @load="loadInitDebounce">
                    <Article :item="item" v-for="(item, index) in selectData" :key="index"></Article>
                    <div class="load-ing">
                        <span class="text" v-if="isLoading && !noMore">加载中，数据正在飞速赶来~</span>
                        <span v-if="noMore" class="text">-已经触及俺的底线啦~-</span>
                    </div>
                </n-infinite-scroll>
            </n-tab-pane>
        </n-tabs>
    </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixin.scss' as *;
.search-mid {
    width: 80%;
    margin: 0 auto;
    .n-tabs {
        width: 100%;
        background-color: #fff;
        padding: 10px 20px 0px 20px;
        :deep(.n-tabs-tab__label) {
            font-size: 16px;
        }

        .n-tab-pane {
            width: 100%;
            position: relative;

            .n-infinite-scroll {
                width: 80%;
            }
        }

        img {
            width: 50%;
            height: 80vh;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            object-fit: contain;
        }

        .load-ing {
            margin: 15px 0px 15px 0px;
            text-align: center;
            width: 100%;
            color: #7d8791;
            bottom: 0px;
        }
    }

    .n-tabs :deep(.n-tabs-nav-scroll-content) {
        border: none;
    }

    .n-divider {
        display: block;
    }
}
</style>
