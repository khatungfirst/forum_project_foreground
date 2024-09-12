<script lang="ts" setup>
import { ref } from 'vue';
// import { Editor } from '@bytemd/vue-next';
// import gfm from '@bytemd/plugin-gfm';
import 'bytemd/dist/index.css';
import '@/assets/css/icon/iconfont.css';
import type { UploadFileInfo } from 'naive-ui';
import { getTypeTag } from '@/config/apis/publicArticle.ts';
import { publicArticles } from '@/config/apis/publicArticle.ts';
import markdown from '@/views/components/markdown/index.vue';
import { useMessage } from 'naive-ui';

//标题输入的数据
const title = ref('');

//计算标题的字数
const titleNUmber = computed(() => title.value.length);

//markdown里的内容
const content = ref('');

//定义用户选择的分类
const category_id = ref(null);

// 定义用户选择的标签
const tag = ref([]);

//定义文章摘要
const summary = ref('');

//定义文章的状态(初始是草稿状态)
const status = ref('draft');

//定义封面图的路径
const image = ref('');

//控制卡片显示的变量
const cardDisplay = ref(false);

//定义分类下拉框中的内容
const typeOptions = ref([]);

//定义标签下拉框中的内容
const tagOptions = ref([]);

//定义消息提示对象
const message = useMessage();

//文件上传声明的属性
const showModalRef = ref(false);
const previewImageUrlRef = ref('');
const previewFileList = ref([]);
const showModal = showModalRef;
const previewImageUrl = previewImageUrlRef;

//生命周期
onMounted(async () => {
    const { data } = await getTypeTag();
    typeOptions.value = data.categoryList;
    tagOptions.value = data.tagList;
});

//将文章的各个属性放到一个对象中
const articleData = reactive({
    user_id: 1,
    title: '',
    status: '',
    category_id: 0,
    summary: '',
    content: '',
    tag: [],
    image: ''
});

//获取到markdown中输入的数据
const getMessage = (msg: string) => {
    content.value = msg;
    console.log(content.value, 'msg');
};

//页面上发布按钮的点击事件
const releaseCard = () => {
    cardDisplay.value = !cardDisplay.value;
};

//真正发布的按钮的点击事件
const publicArticle = async () => {
    console.log(articleData, '111111');
    articleData.title = title.value;
    articleData.status = status.value;
    articleData.category_id = category_id.value;
    articleData.summary = summary.value;
    articleData.content = content.value;
    articleData.tag = tag.value;
    articleData.image = image.value;
    const { code } = await publicArticles(articleData);
    if (code === 200) {
        message.success('发布成功');
        cardDisplay.value = false;
        title.value = '';
        status.value = '';
        category_id.value = null;
        summary.value = '';
        content.value = '';
        tag.value = [];
        image.value = '';
    }
};

//文件上传的相关方法
const handlePreview = (file: UploadFileInfo) => {
    const { url } = file;
    console.log(url, 'url');

    previewImageUrlRef.value = url as string;
    showModalRef.value = true;
};

const handleFinish = ({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
    const { data } = JSON.parse((event?.target as XMLHttpRequest).response);
    image.value = data.url;
    console.log(data.url);
    message.success((event?.target as XMLHttpRequest).response);
    const ext = file.name.split('.')[1];
    file.name = `更名.${ext}`;
    file.url = data.url;
    return file;
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
                        action="http://127.0.0.1:4523/m1/4891553-0-default/produce_image_url"
                        :default-file-list="previewFileList"
                        list-type="image-card"
                        @preview="handlePreview"
                        @finish="handleFinish"
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
                <span>ctrl+s保存草稿</span>
            </div>
        </div>
        <markdown @get-message="getMessage"></markdown>
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
                color: #9da4a8;
                font-size: 14px;
                margin-right: 15px;
            }

            .n-button {
                width: 80px;
                height: 30px;
            }
        }
    }
}
</style>
