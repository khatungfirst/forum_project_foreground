<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
//导入api
import { getTypeTag, publicArticles, getCompressImage } from '@/config/apis/publicArticle';
import { getArticleDetail } from '@/config/apis/articleDetail';
import { getImageUrl } from '@/config/apis/publicArticle';
//导入公共hook函数
import useUpload from '@/hooks/useUpload';
//导入全局状态管理
import { useUserStore } from '@/config/store/userStore';
//导入第三方组件
import 'bytemd/dist/index.css';
import { useMessage } from 'naive-ui';
import { Icon } from '@vicons/utils';
import { CheckCircleTwotone } from '@vicons/antd';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

//定义消息提示对象
const message = useMessage();

//定义路由对象
const router = useRouter();

const route = useRoute();

const userInfo = useUserStore();

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
    user_id: userInfo.userInfo?.id || 0,
    article_id: 0, //存放当前文章的id
    title: '', //标题输入的数据
    status: '', //定义文章的状态(初始是草稿状态)
    category_id: null, //定义用户选择的分类
    summary: '', //定义文章摘要
    content: '', //markdown里的内容
    tags: [], // 定义用户选择的标签
    image_url: '' //定义封面图的路径
});

const init = async () => {
    articleData.article_id = +route.params.id;
    if (articleData.article_id !== 0) {
        const id = {
            id: articleData.article_id
        };
        const articleDatas = await getArticleDetail(id);
        if (articleDatas) {
            const data = articleDatas.data.article;
            articleData.title = data.title;
            articleData.content = data.content;
            articleData.category_id = data.category_id;
            articleData.image_url = data.image_url;
            articleData.summary = data.summary;
            articleData.article_id = data.id;
            for (const tag of data.tags) {
                articleData.tags.push(tag.name);
            }
        }
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
};

// 监听键盘事件以保存内容
const saveContent = (e) => {
    const key = e.keyCode || e.which;
    if (key === 83 && e.ctrlKey) {
        if (articleData.title === '' && articleData.content === '') {
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

//控制卡片显示的变量
const cardDisplay = ref(false);

//定义分类下拉框中的内容
const typeOptions = ref([]);

//定义标签下拉框中的内容
const tagOptions = ref([]);

//选择发布文章的状态
const checkedValue = ref<string | null>(null);

//存放封面图的数组
const fileList = ref([]);

//控制发布文章按钮的加载效果
const publicLoadButton = ref(false);

//制定表单的的校验规则
const rules = {
    categories: { required: true, trigger: ['blur', 'input'], message: '请输入要选择的分类' },
    text: { required: true, trigger: ['blur', 'input'], message: '请输入文章摘要' }
};

//用watch去监控标题是否发生更改
watch(
    [() => articleData.title, () => articleData.content], //articleData.title 本身不是一个响应式引用（ref），而是一个响应式对象（reactive）的属性
    (newValue, oldValue) => {
        console.log(newValue, oldValue);
        // title1.value = newValue[0];
        isSave.value = false;
    }
);

//切换文章发布类型
const handleChange = (e: Event) => {
    checkedValue.value = (e.target as HTMLInputElement).value;
    articleData.status = checkedValue.value;
};

//封面图上传前阻止默认上传行为
const handleBeforeUpload = (rawFile) => {
    console.log('999');
    if (fileList.value.length === 0) {
        console.log(fileList.value.length, '======');
        getImage(rawFile);
    }
    return false;
};

//获取上传封面图的链接
const { image_url, getUrl, isFit } = useUpload('文章封面');
const getImage = async (item) => {
    await getUrl(item);
    if (isFit.value) {
        fileList.value.push({
            url: image_url.value,
            status: 'finished'
        });
        if (image_url.value !== '') {
            articleData.image_url = fileList.value[0].url;
        }
    } else {
        message.warning('上传的图片比例不符合3：2，请重新选择图片');
    }
};

//删除封面图
const removeImage = () => {
    console.log('777');
    fileList.value.pop();
    return false;
};

//页面上发布按钮的点击事件
const releaseCard = () => {
    if (articleData.title !== '' && articleData.content !== '') {
        cardDisplay.value = !cardDisplay.value;
    } else {
        message.error('文章标题和内容可不能为空哦~');
    }
};

//编辑文章时的上传图片
const onUploadImg = async (files, callback) => {
    const res = await Promise.all(
        files.map((file) => {
            return new Promise((rev, rej) => {
                const form = new FormData();
                form.append('files', file);

                form.append('type', '文章');
                // TS 语法
                getImageUrl(form)
                    .then((result) => {
                        rev(result.data[0]);
                    })
                    .catch((error) => {
                        rej(error);
                    });
            });
        })
    );

    callback(res.map((item) => item.url));
};

//真正发布的按钮的点击事件
const publicArticle = async () => {
    // articleData.status = 'private';
    publicLoadButton.value = true;
    if (articleData.category_id !== null && articleData.summary !== '' && articleData.status !== '') {
        const { code } = await publicArticles(articleData);
        if (code === 2000) {
            message.success('发布成功');
            // articleData.status = 'private';
            router.push('/transferPage');
        }
    } else {
        message.error('千万不要忘记填写文章的类目、摘要和发布类型！');
    }
    publicLoadButton.value = false;
};
</script>
<template>
    <div class="wrap">
        <!-- 遮罩层 -->
        <div class="overlay" v-if="cardDisplay"></div>
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
                        style="margin-top: 25px"
                    >
                        <n-select v-model:value="articleData.category_id" placeholder="必填" :options="typeOptions" />
                    </n-form-item>
                    <n-form-item label="标签">
                        <n-select v-model:value="articleData.tags" placeholder="多选" :options="tagOptions" multiple />
                    </n-form-item>
                    <div class="upload">
                        <span>封面图</span>
                        <n-upload
                            @change="getImage"
                            list-type="image-card"
                            max="1"
                            :file-list="fileList"
                            @before-upload="handleBeforeUpload"
                            @remove="removeImage"
                        />
                        <n-modal preset="card" style="width: 600px" title="封面图">
                            <img :src="articleData.image_url" style="width: 100%" />
                        </n-modal>
                    </div>
                    <n-p depth="3" style="margin: 8px 0 0 0">
                        格式：png、jpg、gif，大小不大于：2M，尺寸比例必须为：3：2
                    </n-p>
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
                    <n-space>
                        <n-radio
                            :checked="checkedValue === 'public'"
                            value="public"
                            name="basic-demo"
                            @change="handleChange"
                        >
                            公开发布
                        </n-radio>
                        <n-radio
                            :checked="checkedValue === 'private'"
                            value="private"
                            name="basic-demo"
                            @change="handleChange"
                        >
                            私有发布
                        </n-radio>
                    </n-space>
                </n-form>
                <div class="bottom">
                    <n-button tertiary round type="primary" @click="releaseCard">取消</n-button>
                    <n-button
                        strong
                        secondary
                        round
                        type="primary"
                        @click="publicArticle"
                        :loading="publicLoadButton"
                        icon-placement="right"
                    >
                        发布
                    </n-button>
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
        <!-- <markdown @get-message="getMessage" :article_id="articleData.article_id"></markdown> -->
        <MdEditor v-model="articleData.content" @onUploadImg="onUploadImg" />
    </div>
</template>
<style scoped lang="scss">
@use '@/assets/styles/mixin.scss' as *;
.wrap {
    @include overlay;
    @include all;
    display: grid;
    grid-template-rows: 1fr 13fr;
    overflow: hidden;
    position: relative;
    margin-top: 55px;
    .n-card {
        width: 30%;
        /* height: 60vh; */
        @include absolute;
        z-index: 1000;
        box-shadow: 4px 5px 7px 0px rgba(0, 0, 0, 0.4);
        border-radius: 5px;

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
                font-size: 12px;
                padding-left: 30px;
            }

            .text {
                margin-top: 25px;
                padding-left: 20px;

                .n-input {
                    width: 85%;
                }

                .n-input :deep(.n-form-item-label--left-mark) {
                    width: 90px;
                }
            }

            .n-space {
                width: 190px;
                margin: 0 auto;
                margin-bottom: 30px;
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

    .n-card :deep(.n-card-header) {
        font-size: 16px;
    }

    .n-card :deep(.n-card__content) {
        padding: 0px;
    }

    .top {
        display: flex;
        align-items: center;
        background-color: #fff;
        span {
            color: #8a919f;
        }

        input {
            height: 40px;
            width: 80%;
            border: none !important;
            margin: 0px 60px 0px 0px;
            text-indent: 2em;
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

    .md-editor {
        height: 80vh;
    }
}
</style>
