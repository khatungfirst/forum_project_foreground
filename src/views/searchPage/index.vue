<script lang="ts" setup>
import { ref } from 'vue';
import { getSelectArticle } from '@/config/apis/select';
import Article from '@/views/components/article/index.vue';
//用来存放后端传来的相关数据
const selectData = ref([]);

//搜索的字条
const keyword = ref('');

//顶部标签页的选中值
const activeTab = ref('1');

//中间标签页的选中值
const middleActiveTab = ref('0');

//定义当前的页数
const page = ref(0);

//定义每页的数量
const limit = ref(4);

//是否正在加载
const isLoading = ref(false);

//获取到最外层盒子的对象
const dataContainer = ref(null);

//表示是否还有数据
const noMore = ref(false);

onMounted(async () => {
    init();
});

//获取页面中初始化数据
const init = async () => {
    const dataObj = {
        keyword: keyword.value,
        category_id: activeTab.value,
        page: 1,
        limit: limit.value,
        kind: middleActiveTab.value
    };
    const { data } = await getSelectArticle(dataObj);
    if (data) {
        selectData.value = data.selectedList;
    }
};

//获取页面中加载后对应的数据的方法
const loadInit = async () => {
    if (isLoading.value) return;
    isLoading.value = true;

    setTimeout(async () => {
        const dataObj = {
            keyword: keyword.value,
            category_id: activeTab.value,
            page: page.value,
            limit: limit.value,
            kind: middleActiveTab.value
        };
        const { data } = await getSelectArticle(dataObj);
        if (data) {
            selectData.value.push(...data.selectedList);
            page.value++;
            isLoading.value = false;
        }
    }, 1000);
};

//顶部标签页改变时的触发事件
const tabTop = (value: string) => {
    activeTab.value = value;
    init();
};

//中间标签页改变时的触发事件
const tabMiddle = (value: string) => {
    middleActiveTab.value = value;
    init();
};

//滚动触发事件
const handleScroll = () => {
    loadInit();
};
</script>
<template>
    <div class="wrap">
        <div class="top-menu">
            <n-tabs type="line" animated @update:value="tabTop" v-model:value="activeTab">
                <n-tab-pane name="1" tab="综合"></n-tab-pane>
                <n-tab-pane name="2" tab="前端"></n-tab-pane>
                <n-tab-pane name="3" tab="后端"></n-tab-pane>
            </n-tabs>
        </div>
        <div class="middle">
            <n-tabs type="line" animated @update:value="tabMiddle" v-model:value="middleActiveTab">
                <n-tab-pane name="0" tab="热门" ref="dataContainer">
                    <img src="../../assets/images/noSelect.png" alt="" v-if="selectData.length === 0" />
                    <n-infinite-scroll style="height: 800px" :distance="10" @load="handleScroll">
                        <Article :item="item" v-for="(item, index) in selectData" :key="index"></Article>
                    </n-infinite-scroll>
                </n-tab-pane>
                <n-tab-pane name="1" tab="最新" ref="dataContainer">
                    <img src="../../assets/images/noSelect.png" alt="" v-if="selectData.length === 0" />
                    <n-infinite-scroll style="height: 800px" :distance="10" @load="handleScroll">
                        <Article :item="item" v-for="(item, index) in selectData" :key="index"></Article>
                    </n-infinite-scroll>
                </n-tab-pane>
            </n-tabs>
            <div class="loading" v-if="isLoading && !noMore">
                <span class="videos">
                    <video src="../../assets/images/loading.mp4" autoplay loop muted></video>
                </span>
                <span class="text">正在全力加载中...</span>
            </div>
            <div v-if="noMore" class="loading">没有更多了 🤪</div>
        </div>
    </div>
</template>
<style scoped lang="scss">
@import '@/assets/styles/mixin.scss';
.wrap {
    @include all;
    background-color: #f2f3f5;
    .top-menu {
        width: 100%;
        height: 50px;
        background-color: #fff;

        .n-tabs {
            width: 70%;
            margin: 0 auto;
        }

        .n-tabs :deep(.n-tabs-nav-scroll-content) {
            height: 50px;
        }
    }

    .middle {
        width: 70%;
        height: 800px;
        background-color: #fff;
        /* height: 500px; */
        margin: 15px auto;

        .n-tabs {
            width: 100%;
            height: 800px;
            padding: 30px;
            .n-tab-pane {
                /* display: flex;
                justify-content: center; */
                width: 100%;
                /* overflow: scroll; */

                .n-infinite-scroll {
                    width: 80%;
                }
            }
            img {
                width: 80%;
                height: 80vh;
            }
        }

        .n-tabs :deep(.n-tabs-nav-scroll-content) {
            border: none;
        }

        .n-divider {
            display: block;
        }

        @include loading;
    }
}
</style>
