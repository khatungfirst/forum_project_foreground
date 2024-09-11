<script lang="ts" setup>
import { ref } from 'vue';
import { Editor } from '@bytemd/vue-next';
import gfm from '@bytemd/plugin-gfm';
import 'bytemd/dist/index.css';
import '@/assets/css/icon/iconfont.css';
import type { UploadFileInfo } from 'naive-ui';

//标题输入的数据
const title = ref('');
//计算标题的字数
const titleNUmber = computed(() => title.value.length);

//markdown里的内容
const content = ref('');

const plugins = [gfm()];

//控制卡片显示的变量
const cardDisplay = ref(false);

//定义分类下拉框中的内容
const typeOptions = ref([]);

//定义标签下拉框中的内容
const tagOptions = ref([]);

//定义用户选择的分类
const typeValue = ref('');

// 定义用户选择的标签
const tagVaule = ref('');

//markdown是否显示
const showModalRef = ref(false);
const previewImageUrlRef = ref('');
const previewFileList = ref([]);
const showModal = showModalRef;
const previewImageUrl = previewImageUrlRef;

//获取到markdown中输入的数据
const handleChange = (v: string) => {
    content.value = v;
    console.log(v, 'v');
};

//页面上发布按钮的点击事件
const releaseCard = () => {
    cardDisplay.value = !cardDisplay.value;
};

const handlePreview = (file: UploadFileInfo) => {
    const { url } = file;
    previewImageUrlRef.value = url as string;
    showModalRef.value = true;
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
                    <n-select v-model:value="typeValue" :options="typeOptions" />
                </div>
                <div class="tag">
                    <span>标签</span>
                    <n-select v-model:value="tagVaule" :options="tagOptions" />
                </div>
                <div class="upload">
                    <span>封面图</span>
                    <n-upload
                        action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
                        :default-file-list="previewFileList"
                        list-type="image-card"
                        @preview="handlePreview"
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
                    <n-input type="textarea" maxlength="500" show-count placeholder="请输入文章摘要" />
                </div>
                <div class="bottom">
                    <n-button tertiary round type="primary" @click="releaseCard">取消</n-button>
                    <n-button strong secondary round type="primary">发布</n-button>
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
        <Editor :value="content" :plugins="plugins" @change="handleChange" style="height: 100%" />
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
            .n-select >>> .n-base-selection--selected {
                width: 90%;
                border-radius: 50px;
            }
            .n-select >>> .n-base-selection-label {
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
