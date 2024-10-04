<script setup lang="ts">
import { ref, reactive, defineProps } from 'vue';
import { getSelectArticle } from '@/config/apis/select';
import Article from '@/views/components/article/index.vue';
import { debounce } from '@/utils/debounce.ts';

const prop = defineProps({
    category_id: {
        type: String,
        required: true,
        default: '1' // 设置默认值
    }
});

//用来存放后端传来的相关数据
const selectData = ref([]);

//是否正在加载
const isLoading = ref(false);

//获取到最外层盒子的对象
const dataContainer = ref(null);

//表示是否还有数据
const noMore = ref(false);

const threshold = ref(200);

const dataObj = reactive({
    keyword: '',
    category_id: prop.category_id,
    page: 1,
    limit: 4,
    kind: '0'
});

onMounted(async () => {
    init();
});

//获取页面中初始化数据
const init = async () => {
    console.log(111);
    const { data } = await getSelectArticle(dataObj);
    if (data) {
        selectData.value = data.selectedList;
    }
};

//获取页面中加载后对应的数据的方法
const loadInit = async () => {
    console.log(threshold.value, '*****');

    console.log(22);
    if (isLoading.value) return;
    isLoading.value = true;
    setTimeout(async () => {
        dataObj.page++;
        const { data } = await getSelectArticle(dataObj);
        if (data) {
            selectData.value.push(...data.selectedList);
        } else {
            dataObj.page--;
        }
        isLoading.value = false;
    }, 200);
};
const loadInitDebounce = debounce(loadInit, 300);

//中间标签页改变时的触发事件
const tabMiddle = (value: string) => {
    dataObj.kind = value;
    init();
};
</script>
<template>
    <div class="search-mid">
        <n-tabs type="line" animated @update:value="tabMiddle" v-model:value="dataObj.kind">
            <n-tab-pane name="0" tab="热门" ref="dataContainer">
                <img src="../../../assets/images/noSelect.png" alt="" v-if="selectData.length === 0" />
                <n-infinite-scroll style="height: 800px" :distance="10" @load="loadInitDebounce">
                    <Article :item="item" v-for="(item, index) in selectData" :key="index"></Article>
                </n-infinite-scroll>
            </n-tab-pane>
            <n-tab-pane name="1" tab="最新" ref="dataContainer">
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
</template>
<style scoped lang="scss">
@import '@/assets/styles/mixin.scss';
.search-mid {
    .n-tabs {
        width: 100%;
        height: 800px;
        padding: 30px;
        .n-tab-pane {
            width: 100%;

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
</style>
