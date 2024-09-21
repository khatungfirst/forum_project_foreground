<script lang="ts" setup>
import { ref, watch } from 'vue';
import 'bytemd/dist/index.css';
import '@/assets/css/icon/iconfont.css';
import type { UploadFileInfo } from 'naive-ui';
import { getTypeTag } from '@/config/apis/publicArticle.ts';
import { publicArticles } from '@/config/apis/publicArticle.ts';
import markdown from '@/views/components/markdown/index.vue';
import { useMessage } from 'naive-ui';
import { useDialog } from 'naive-ui';
import { onBeforeRouteLeave } from 'vue-router';
import { Icon } from '@vicons/utils';
import { CheckCircleTwotone } from '@vicons/antd';
import { useRouter } from 'vue-router';
import { getArticleDetail } from '../../config/apis/articleDetail';

//标题输入的数据
const title = ref('');

//计算标题的字数
const titleNUmber = computed(() => title.value.length);

//markdown里的内容
const content = ref('');

//接受上次markdown中的数据
const content1 = ref('');

//定义用户选择的分类
const category_id = ref(null);

// 定义用户选择的标签
const tag = ref([]);

//定义文章摘要
const summary = ref('');

//定义文章的状态(初始是草稿状态)
const status = ref('');

//定义封面图的路径
const image_url = ref('');

//控制卡片显示的变量
const cardDisplay = ref(false);

//定义分类下拉框中的内容
const typeOptions = ref([]);

//定义标签下拉框中的内容
const tagOptions = ref([]);

//定义消息提示对象
const message = useMessage();

//定义弹窗对象
const dialog = useDialog();

//定义路由对象
const router = useRouter();

// 定义变量来存储定时器ID
// const timer = ref(null);

//判断当前处于编辑状态还是保存状态
const isSave = ref(false);

//存放当前文章的id
const article_id = ref(0);

//文章发布字段
const published_at = ref('');

//将文章的各个属性放到一个对象中
const articleData = reactive({
    user_id: 1,
    article_id,
    title: '',
    status: '',
    category_id: 0,
    summary: '',
    content: '',
    tags: [],
    image_url: '',
    published_at: ''
});

// 路由离开守卫
onBeforeRouteLeave(async (to, from, next) => {
    console.log(status.value, '****');

    if (status.value === 'private') {
        next();
    } else {
        console.log(status.value, '****');
        const shouldLeave = await new Promise((resolve) => {
            dialog.warning({
                title: '注意',
                content: '您的文章还没保存，是否要保存？',
                positiveText: '保存',
                negativeText: '取消',
                maskClosable: false,
                onEsc: () => {
                    console.log('通过 esc 关闭');
                    resolve(false); // 假设 ESC 也被视为取消
                },
                onPositiveClick: () => {
                    console.log('222');
                    resolve(true); // 用户确认离开
                }
            });
        });

        if (shouldLeave) {
            next(); // 用户确认离开，继续路由跳转
        } else {
            next(false); // 用户选择不离开，阻止路由跳转
        }
    }
});

//文件上传声明的属性
const showModalRef = ref(false);
const previewImageUrlRef = ref('');
const previewFileList = ref([]);
const showModal = showModalRef;
const previewImageUrl = previewImageUrlRef;

//生命周期
onMounted(async () => {
    const { data } = await getTypeTag();
    typeOptions.value = data.categories;
    tagOptions.value = data.tags;
    init();
    window.addEventListener('beforeunload', beforeUnloadHandler);
    window.addEventListener('unload', unloadHandler);
    // 添加键盘事件监听器
    document.addEventListener('keydown', saveContent);
    // 设置定时器
    // timer.value = setInterval(() => {
    //     save('timer');
    // }, 10 * 10000);
});

// 在组件卸载时移除事件监听器，防止内存泄漏
onUnmounted(() => {
    window.removeEventListener('beforeunload', beforeUnloadHandler);
    window.removeEventListener('unload', unloadHandler);
    // 移除键盘事件监听器
    document.removeEventListener('keydown', saveContent);
    // 清除定时器
    // if (timer.value) {
    //     clearInterval(timer.value);
    // }
});

//用watch去监控标题是否发生更改
watch(title, (newValue, oldValue) => {
    console.log(newValue, oldValue);
    isSave.value = false;
});

//初始化的方法
const init = async () => {
    const id = {
        article_id: article_id.value
    };
    const articleData = await getArticleDetail(id);
    const data = articleData.data.article;
    title.value = data.title;
    content.value = data.content;
    category_id.value = data.category_id;
    tag.value = data.tags;
    image_url.value = data.image_url;
    summary.value = data.summary;
    article_id.value = data.id;
    published_at.value = data.published_at;
};

// 保存内容的方法
const save = async () => {
    console.log(`content saved by`);
    articleData.title = title.value;
    articleData.status = 'draft';
    articleData.category_id = category_id.value;
    articleData.summary = summary.value;
    articleData.content = content.value;
    articleData.tags = tag.value;
    articleData.image_url = image_url.value;
    articleData.article_id = article_id.value;
    articleData.published_at = published_at.value;
    const { data } = await publicArticles(articleData);
    article_id.value = data.id;
    isSave.value = true;
    status.value = 'draft';
    console.log('save2');
};

// 监听键盘事件以保存内容
const saveContent = (e) => {
    const key = e.keyCode || e.which;
    if (key === 83 && e.ctrlKey) {
        if (title.value === '' && content.value === '<p><br></p>') {
            isSave.value = false;
            console.log('目前为空');
        } else {
            save();
        }
        e.preventDefault();
    }
};

//获取到markdown中输入的数据
const getMessage = (msg: string) => {
    content.value = msg;
    if (content1.value === content.value && content1.value !== '<p><br></p>' && status.value === 'draft') {
        isSave.value = true;
        console.log('save1');
    } else {
        isSave.value = false;
        content1.value = content.value;
    }
};

//页面上发布按钮的点击事件
const releaseCard = () => {
    cardDisplay.value = !cardDisplay.value;
};

//真正发布的按钮的点击事件
const publicArticle = async () => {
    console.log(articleData, '111111');
    articleData.title = title.value;
    articleData.status = 'private';
    articleData.category_id = category_id.value;
    articleData.summary = summary.value;
    articleData.content = content.value;
    articleData.tags = tag.value;
    articleData.image_url = image_url.value;
    articleData.published_at = published_at.value;
    if (
        articleData.category_id !== null &&
        articleData.summary !== '' &&
        articleData.title !== '' &&
        articleData.content !== ''
    ) {
        const { code } = await publicArticles(articleData);
        if (code === 200) {
            message.success('发布成功');
            status.value = 'private';
            console.log(status.value, '****');
            router.push('/transferPage');
        }
    } else {
        message.error('请把信息补充完整');
    }
};

//文件上传的相关方法
const handlePreview = (file: UploadFileInfo) => {
    const { url } = file;
    console.log(url, 'url');

    previewImageUrlRef.value = url as string;
    showModalRef.value = true;
};

//定义文件上传后的图片显示
const handleFinish = ({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
    const { data } = JSON.parse((event?.target as XMLHttpRequest).response);
    image_url.value = data.url;
    console.log(data.url);
    // message.success((event?.target as XMLHttpRequest).response);
    const ext = file.name.split('.')[1];
    file.name = `更名.${ext}`;
    file.url = data.url;
    return file;
};

// 定义事件处理函数
const beforeUnloadHandler = (e) => {
    e.preventDefault(); // 阻止默认行为（在某些浏览器中可能不起作用）
    e.returnValue = ''; // 设置返回值（但请注意，现代浏览器可能不支持直接修改returnValue）
    return '您页面上的修改还未保存，确定离开页面吗？'; // 返回一个字符串可能不会在所有浏览器中触发对话框
};

const unloadHandler = (e) => {
    // 注意：unload事件的处理函数通常不会阻止页面卸载，
    // 因为浏览器会忽略事件处理函数中阻止默认行为的尝试。
    // 这里主要是为了演示如何添加和移除事件监听器。
    console.log(e, '页面正在卸载...');
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
                <div class="type">
                    <span>
                        <i class="iconfont">&#xe640;</i>
                        分类
                    </span>
                    <n-select v-model:value="category_id" :options="typeOptions" placeholder="必填" />
                </div>
                <div class="tag">
                    <span>标签</span>
                    <n-select v-model:value="tag" multiple :options="tagOptions" placeholder="支持选择多个标签" />
                </div>
                <div class="upload">
                    <span>封面图</span>
                    <n-upload
                        action="http://127.0.0.1:4523/m1/4891553-4547208-default/produce_image_url"
                        method="get"
                        :default-file-list="previewFileList"
                        list-type="image-card"
                        @preview="handlePreview"
                        @finish="handleFinish"
                        max="1"
                    />
                    <n-modal v-model:show="showModal" preset="card" style="width: 600px" title="一张很酷的图片">
                        <img :src="previewImageUrl" style="width: 100%" />
                    </n-modal>
                </div>
                <n-p depth="3" style="margin: 8px 0 0 0">格式：png,jpg,gif 大小不大于：2M尺寸：192*128px</n-p>
                <div class="abstract">
                    <span>
                        <i class="iconfont">&#xe640;</i>
                        文章摘要
                    </span>
                    <n-input
                        type="textarea"
                        maxlength="500"
                        show-count
                        placeholder="请输入文章摘要（必填）"
                        v-model:value="summary"
                    />
                </div>
                <div class="bottom">
                    <n-button tertiary round type="primary" @click="releaseCard">取消</n-button>
                    <n-button strong secondary round type="primary" @click="publicArticle">发布</n-button>
                </div>
            </div>
        </n-card>
        <div class="top">
            <input maxlength="30" placeholder="请输入标题" v-model="title" />
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
        <markdown @get-message="getMessage" :article_id="article_id"></markdown>
    </div>
</template>
<style scoped>
.wrap {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 1fr 18fr;
    overflow: hidden;
    position: relative;

    .n-card {
        width: 30%;
        /* height: 60vh; */
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
        box-shadow: 4px 5px 7px 0px rgba(0, 0, 0, 0.4);

        .contain {
            .type {
                display: grid;
                grid-template-columns: 1fr 6fr;
                margin: 20px 0px 30px 0px;
                padding-left: 20px;
                span {
                    height: 34px;
                    line-height: 34px;
                    margin-right: 10px;
                }
            }
            .tag {
                display: grid;
                grid-template-columns: 1fr 9fr;
                padding-left: 40px;
                margin: 20px 0px;
                span {
                    width: 30px;
                    height: 34px;
                    line-height: 34px;
                    margin-right: 10px;
                }
            }
            .n-select >>> .n-base-selection--selected,
            .n-select >>> .n-base-selection {
                width: 90%;
                border-radius: 50px;
            }
            .n-select >>> .n-base-selection-label,
            .n-select >>> .n-base-selection {
                border-radius: 50px;
            }

            .upload {
                display: grid;
                grid-template-columns: 1fr 6fr;
                padding-left: 30px;

                .n-upload >>> .n-upload-file-list--grid {
                    display: flex;
                }

                .n-upload >>> .n-upload-trigger--image-card {
                    width: 85%;
                    height: 140px;
                }
            }

            .n-p {
                text-align: center;
            }

            .abstract {
                display: grid;
                grid-template-columns: 1fr 5fr;
                margin: 20px 0px 50px 3px;
                font-size: 13px;

                .n-input {
                    width: 85%;
                    margin-left: 10px;
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

    .n-card >>> .n-card__content {
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
