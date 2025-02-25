<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import Article from '@/views/components/article/index.vue';
import { follower_article } from '@/config/apis/articleDetail';
import { debounce } from '@/utils/debounce.ts';
import { useUserStore } from '@/config/store/userStore';
// 存储关注的人的文章数据
const followedArticles = ref([]);
const userStore = useUserStore();
const emit = defineEmits(['follow']);
// 获取关注的人的文章
const fetchFollowedArticles = async () => {
    if (userStore.token === '') {
        // 存储当前作者 ID
        console.log(809347);
        emit('follow');
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
    }
};

// 生命周期钩子：组件挂载时获取数据
onMounted(() => {
    init();
    fetchFollowedArticles();
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
    const { data } = await follower_article(dataObj);
    if (data && data.article_list.length > 0) {
        selectData.value = data.article_list;
        isHaveData.value = false;
    }
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
};
const loadInitDebounce = debounce(loadInit, 300);

// 中间标签页改变时的触发事件
const tabMiddle = (value: string) => {
    dataObj.kind = value;
    init();
};
</script>

<template>
    <div class="search-mid">
        <n-tabs type="line" animated @update:value="tabMiddle" v-model:value="dataObj.kind">
            <n-tab-pane name="0" tab="热门" ref="dataContainer" style="min-height: 850px">
                <img src="../../../assets/images/noSelect.png" alt="" v-if="isHaveData" class="img" />
                <n-infinite-scroll style="height: 800px" :distance="20" @load="loadInitDebounce">
                    <Article :item="item" v-for="(item, index) in selectData" :key="index"></Article>
                    <div class="load-ing">
                        <span class="text" v-if="isLoading && !noMore">加载中，数据正在飞速赶来~</span>
                        <span v-if="noMore" class="text">-已经触及俺的底线啦~-</span>
                    </div>
                </n-infinite-scroll>
            </n-tab-pane>
            <n-tab-pane name="1" tab="最新" ref="dataContainer" style="min-height: 850px">
                <img src="../../../assets/images/noSelect.png" alt="" v-if="isHaveData" />
                <n-infinite-scroll style="height: 800px" :distance="20" @load="loadInitDebounce">
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
    .n-tabs {
        width: 100%;
        height: 740px;
        padding: 10px 20px 0px 20px;
        .n-tab-pane {
            width: 100%;
            position: relative;

            .n-infinite-scroll {
                width: 80%;
            }
        }

        .img {
            // width: 100%;
            // height: auto;
            // position: absolute;
            // left: 50%;
            // transform: translateX(-50%);
            // object-fit: contain;
            width: 65%;
            height: 70vh;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            object-fit: contain;
        }

        ::v-deep(.n-scrollbar-content) {
            padding-bottom: 160px;
        }

        .load-ing {
            margin-top: 15px;
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
