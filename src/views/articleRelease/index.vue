<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { getTypeTag, publicArticles, getImageUrl } from '@/config/apis/publicArticle';
import markdown from '@/views/components/markdown/index.vue';
import { getArticleDetail } from '@/config/apis/articleDetail';
import useUpload from '@/hooks/useUpload';
import 'bytemd/dist/index.css';
import { useMessage, useDialog } from 'naive-ui';
import { Icon } from '@vicons/utils';
import { CheckCircleTwotone } from '@vicons/antd';

//定义消息提示对象
const message = useMessage();

//定义路由对象
const router = useRouter();

// 定义事件处理函数
const beforeUnloadHandler = (e) => {
    e.preventDefault(); // 阻止默认行为（在某些浏览器中可能不起作用）
    e.returnValue = ''; // 设置返回值（但请注意，现代浏览器可能不支持直接修改returnValue）
    return '您页面上的修改还未保存，确定离开页面吗？'; // 返回一个字符串可能不会在所有浏览器中触发对话框
};

//---------------------------------生命周期---------------------------------

onMounted(async () => {
    const { data } = await getTypeTag();
    if (data) {
        typeOptions.value = data.categories;
        tagOptions.value = data.tags;
    }
    init();
    window.addEventListener('beforeunload', beforeUnloadHandler);
    // 添加键盘事件监听器
    document.addEventListener('keydown', saveContent);
    // 设置定时器
});

// 在组件卸载时移除事件监听器，防止内存泄漏
onUnmounted(() => {
    window.removeEventListener('beforeunload', beforeUnloadHandler);
    // 移除键盘事件监听器
    document.removeEventListener('keydown', saveContent);
});

//----------------------------------初始化----------------------------------

//将文章的各个属性放到一个对象中
const articleData = reactive({
    user_id: 1,
    article_id: 0, //存放当前文章的id
    title: '', //标题输入的数据
    status: '', //定义文章的状态(初始是草稿状态)
    category_id: 0, //定义用户选择的分类
    summary: '', //定义文章摘要
    content: '', //markdown里的内容
    tags: [], // 定义用户选择的标签
    image_url: '', //定义封面图的路径
    published_at: '' //文章发布时间字段
});

const init = async () => {
    const id = {
        article_id: articleData.article_id
    };
    const articleDatas = await getArticleDetail(id);
    if (articleDatas) {
        const data = articleDatas.data.article;
        articleData.title = data.title;
        articleData.content = data.content;
        articleData.category_id = data.category_id;
        articleData.tags = data.tags;
        articleData.image_url = data.image_url;
        articleData.summary = data.summary;
        articleData.article_id = data.id;
        articleData.published_at = data.published_at;
    }
};

//----------------------------------保存文章内容------------------------------

//判断当前处于编辑状态还是保存状态
const isSave = ref(false);

// 保存内容的方法
const save = async () => {
    articleData.status = 'draft';
    const { data } = await publicArticles(articleData);
    if (data) {
        articleData.article_id = data.id;
    }
    isSave.value = true;
    articleData.status = 'draft';
    console.log('save2');
};

// 监听键盘事件以保存内容
const saveContent = (e) => {
    const key = e.keyCode || e.which;
    if (key === 83 && e.ctrlKey) {
        if (articleData.title === '' && articleData.content === '<p><br></p>') {
            isSave.value = false;
        } else {
            save();
        }
        e.preventDefault();
    }
};

//--------------------------------发布文章-------------------------------------

//计算标题的字数
const titleNUmber = computed(() => articleData.title.length);

//接受上次markdown中的数据
const content1 = ref('');

//定义上次的标题
const title1 = ref('');

//控制卡片显示的变量
const cardDisplay = ref(false);

//定义分类下拉框中的内容
const typeOptions = ref([]);

//定义标签下拉框中的内容
const tagOptions = ref([]);

//制定表单的的校验规则
const rules = {
    categories: { required: true, trigger: ['blur', 'input'], message: '请输入要选择的分类' },
    text: { required: true, trigger: ['blur', 'input'], message: '请输入文章摘要' }
};

//用watch去监控标题是否发生更改
watch(
    () => articleData.title, //articleData.title 本身不是一个响应式引用（ref），而是一个响应式对象（reactive）的属性
    (newValue, oldValue) => {
        console.log(newValue, oldValue);
        title1.value = newValue;
        isSave.value = false;
    }
);

//获取到markdown中输入的数据
const getMessage = (msg: string) => {
    articleData.content = msg;
    if (
        content1.value === articleData.content &&
        content1.value !== '<p><br></p>' &&
        articleData.status === 'draft' &&
        title1.value === articleData.title
    ) {
        isSave.value = true;
    } else {
        isSave.value = false;
        content1.value = articleData.content;
    }
};

//获取上传封面图的链接
const { image_url, getUrl } = useUpload();
const getImage = async (item) => {
    await getUrl(item);
    articleData.image_url = image_url.value;
};

//页面上发布按钮的点击事件
const releaseCard = () => {
    cardDisplay.value = !cardDisplay.value;
};

//真正发布的按钮的点击事件
const publicArticle = async () => {
    console.log(articleData, '111111');
    articleData.status = 'private';
    if (
        articleData.category_id !== null &&
        articleData.summary !== '' &&
        articleData.title !== '' &&
        articleData.content !== ''
    ) {
        const { code } = await publicArticles(articleData);
        if (code === 200) {
            message.success('发布成功');
            articleData.status = 'private';
            router.push('/transferPage');
        }
    } else {
        message.error('请把信息补充完整');
    }
};
</script>
<template>
    <div class="wrap">
        <!-- 发布文章的卡片 -->
        <n-card
            v-if="cardDisplay"
            title="发布文章"
            :segmented="{
                content: true,
                footer: 'soft'
            }"
        >
            <div class="contain">
                <n-form
                    ref="formRef"
                    label-placement="left"
                    label-width="auto"
                    :rule="rules"
                    size="medium"
                    :style="{
                        maxWidth: '640px'
                    }"
                >
                    <n-form-item
                        label="分类"
                        show-require-mark
                        require-mark-placement="left"
                        required
                        path="categories"
                    >
                        <n-select v-model:value="articleData.category_id" placeholder="必填" :options="typeOptions" />
                    </n-form-item>
                    <n-form-item label="标签">
                        <n-select v-model:value="articleData.tags" placeholder="多选" :options="tagOptions" multiple />
                    </n-form-item>
                    <div class="upload">
                        <span>封面图</span>
                        <n-upload @change="getImage" list-type="image-card" max="1" />
                        <n-modal preset="card" style="width: 600px" title="封面图">
                            <img :src="articleData.image_url" style="width: 100%" />
                        </n-modal>
                    </div>
                    <n-p depth="3" style="margin: 8px 0 0 0">格式：png,jpg,gif 大小不大于：2M尺寸：192*128px</n-p>
                    <n-form-item
                        label="文章摘要"
                        show-require-mark
                        require-mark-placement="left"
                        required
                        class="text"
                        path="text"
                    >
                        <n-input
                            v-model:value="articleData.summary"
                            placeholder="请输入文章摘要（必填）"
                            type="textarea"
                            maxlength="500"
                            show-count
                            :autosize="{
                                minRows: 3,
                                maxRows: 5
                            }"
                        />
                    </n-form-item>
                </n-form>
                <div class="bottom">
                    <n-button tertiary round type="primary" @click="releaseCard">取消</n-button>
                    <n-button strong secondary round type="primary" @click="publicArticle">发布</n-button>
                </div>
            </div>
        </n-card>
        <div class="top">
            <input maxlength="30" placeholder="请输入标题" v-model="articleData.title" />
            <span>{{ titleNUmber }}/30</span>
            <div class="top-right">
                <n-button strong secondary round type="primary" @click="releaseCard">发布</n-button>
                <span v-if="!isSave" class="save">ctrl+s保存草稿</span>
                <span v-else>
                    <Icon>
                        <CheckCircleTwotone />
                        已保存
                    </Icon>
                </span>
            </div>
        </div>
        <markdown @get-message="getMessage" :article_id="articleData.article_id"></markdown>
    </div>
</template>
<style scoped lang="scss">
@import '@/assets/styles/mixin.scss';
.wrap {
    @include all;
    display: grid;
    grid-template-rows: 1fr 18fr;
    overflow: hidden;
    position: relative;

    .n-card {
        width: 30%;
        /* height: 60vh; */
        @include absolute;
        z-index: 1000;
        box-shadow: 4px 5px 7px 0px rgba(0, 0, 0, 0.4);

        .contain {
            .n-select :deep(.n-base-selection--selected),
            .n-select :deep(.n-base-selection) {
                width: 90%;
                border-radius: 50px;
            }
            .n-select :deep(.n-base-selection-label),
            .n-select :deep(.n-base-selection) {
                border-radius: 50px;
            }

            .upload {
                display: grid;
                grid-template-columns: 1fr 6fr;
                padding-left: 30px;

                .n-upload :deep(.n-upload-file-list--grid) {
                    display: flex;
                }

                .n-upload :deep(.n-upload-trigger--image-card) {
                    width: 85%;
                    height: 140px;
                }
            }

            .n-p {
                text-align: center;
            }

            .text {
                margin-top: 25px;

                .n-input {
                    width: 85%;
                    margin-left: 10px;
                }

                .n-input :deep(.n-form-item-label--left-mark) {
                    width: 90px;
                }
            }
        }

        .bottom {
            float: right;
            margin-bottom: 30px;

            .n-button {
                width: 80px;
                margin-right: 30px;
            }
        }
    }

    .n-card :deep(.n-card__content) {
        padding: 0px;
    }

    .top {
        display: flex;
        align-items: center;
        span {
            color: #8a919f;
        }

        input {
            height: 40px;
            width: 80%;
            border: none !important;
            margin: 0px 60px;
        }

        .top-right {
            width: 20%;
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            padding-right: 20px;
            span {
                width: 80px;
                color: #9da4a8;
                margin-right: 15px;
                display: flex;
                align-items: center;
                justify-content: space-around;
                font-size: 14px;
            }

            .save {
                width: 120px;
            }

            .n-button {
                width: 80px;
                height: 30px;
            }
        }
    }
}
</style>
