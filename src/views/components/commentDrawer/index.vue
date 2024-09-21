<script lang="ts" setup>
import { Icon } from '@vicons/utils';
import { SmileOutlined } from '@ant-design/icons-vue';
import { FileImageOutlined } from '@ant-design/icons-vue';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';
import { defineProps } from 'vue';
import data from 'emoji-mart-vue-fast/data/all.json';
import 'emoji-mart-vue-fast/css/emoji-mart.css';
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast/src';
import { CaretDownFilled } from '@vicons/antd';
import { CloseCircleTwotone } from '@vicons/antd';
import type { UploadFileInfo } from 'naive-ui';
import { getImageUrl } from '@/config/apis/publicArticle';

// import { useMessage } from 'naive-ui';
const prop = defineProps<{
    appear: boolean;
    childWidth: number;
    headShot: string;
}>();

// 使用ref来创建一个响应式的数据属性
const inputValue = ref('');

//输入框中的字数
const fontNumber = computed(() => inputValue.value.length);

//控制emoji表情是否出现
const emoji = ref(false);

//存放上传图片的url路径
const uploadedImages = ref<{ id: string; url: string }[]>([]);
console.log(uploadedImages);

//定义消息提示对象
// const message = useMessage();

// const fileListLengthRef = ref(0);
// const uploadRef = ref<UploadInst | null>(null);

const fileListRef = ref<UploadFileInfo[]>([]);

const emojiI18n = {
    search: '搜索',
    notfound: 'No Emoji Found',
    categories: {
        search: '搜索结果',
        recent: '经常使用',
        smileys: '表情与情感',
        people: '人物与身体',
        nature: '动物与自然',
        foods: '食物与饮料',
        activity: '活动',
        places: '旅行与地理',
        objects: '物品',
        symbols: '符号标志',
        flags: '旗帜',
        custom: 'Custom',
        joy: '哭笑'
    }
};

//控制emoji组件是否出现的点击事件
const emojiClick = () => {
    emoji.value = !emoji.value;
};
const emojiIndex = new EmojiIndex(data);
// 选中emoji
const handleEmoji = (e) => {
    console.log(e.native);
    inputValue.value = inputValue.value + e.native;
};

//  先预览再上传图片的做法
// const handleChange = (options: { fileList: UploadFileInfo[] }) => {
//     console.log(fileListRef, '222');

//     fileListLengthRef.value = options.fileList.length;
// };

// const handleClick = () => {
//     console.log('111');

//     uploadRef.value?.submit();
// };

// 创建一个模拟生成缩略图 URL 的函数
function createThumbnailUrl(file: File | null): Promise<Promise<string> | undefined> {
    if (!file) return undefined;

    // // 这里我们仅返回一个固定的 URL 字符串作为示例
    return new Promise((resolve, reject) => {
        // 假设 getImageUrl 是一个异步函数，它返回一个包含 data.url 的 Promise
        getImageUrl(file)
            .then((response) => {
                if (response && response.data && response.data.url) {
                    // 如果成功获取到 URL，则解析 Promise
                    console.log('0000'); // 调试输出
                    resolve(response.data.url);
                } else {
                    // 如果没有获取到有效的 URL，则拒绝 Promise（可选）
                    reject(new Error('Failed to retrieve thumbnail URL'));
                }
            })
            .catch((error) => {
                // 如果 getImageUrl 抛出错误，则拒绝 Promise
                reject(error);
            });
    });
}
</script>
<template>
    <div class="drawer" v-if="prop.appear" :style="{ width: prop.childWidth + 'px' }">
        <n-avatar round size="large" :src="prop.headShot" />
        <div class="textArea">
            <textarea
                type="text"
                size="large"
                placeholder="平等交流 友善表达"
                v-model="inputValue"
                :maxlength="1000"
            ></textarea>
            <div class="drawer-bottom">
                <div class="left">
                    <Icon :size="18" color="#8a919f" class="icon" @click="emojiClick" v-if="!emoji">
                        <SmileOutlined />
                    </Icon>
                    <Icon :size="18" color="#8a919f" class="icon" @click="emojiClick" v-else>
                        <CloseCircleTwotone />
                    </Icon>
                    <Icon :size="18" color="#fff" class="icon1" v-if="emoji">
                        <CaretDownFilled />
                    </Icon>
                    <Picker
                        :data="emojiIndex"
                        :emojiSize="18"
                        :showPreview="false"
                        :infiniteScroll="false"
                        :i18n="emojiI18n"
                        set="apple"
                        @select="handleEmoji"
                        v-if="emoji"
                    />
                    <!-- 先预览再上传图片的做法 -->
                    <!-- 
                    <n-upload
                        ref="upload"
                        :default-upload="false"
                        multiple
                        @change="handleChange"
                        list-type="image"
                        :create-thumbnail-url="createThumbnailUrl"
                        :default-file-list="fileListRef"
                    >
                        <Icon :size="18" color="#8a919f" class="icon">
                            <FileImageOutlined />
                        </Icon>
                    </n-upload>
                    <n-button
                        style="margin-bottom: 12px; margin-left: 200px"
                        @click="handleClick"
                        v-if="fileListLengthRef"
                    >
                        上传文件
                    </n-button> -->
                    <n-upload
                        list-type="image"
                        :create-thumbnail-url="createThumbnailUrl"
                        :default-file-list="fileListRef"
                    >
                        <Icon :size="18" color="#8a919f" class="icon">
                            <FileImageOutlined />
                        </Icon>
                    </n-upload>
                </div>
                <div class="right">
                    <span>{{ fontNumber }}/1000</span>
                    <n-tooltip placement="top" trigger="hover" style="background-color: #f2f3f5; color: #8a919f">
                        <template #trigger>
                            <Icon :size="16" color="#8a919f" class="icon">
                                <QuestionCircleOutlined />
                            </Icon>
                        </template>
                        字数不能超过1000字
                    </n-tooltip>

                    <n-button strong secondary round type="primary" size="small">发布</n-button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
@keyframes loading {
    from {
        transform: translateY(100%); /* 从下方进入 */
    }
    to {
        transform: translateY(0); /* 从下方进入 */
    }
}
.drawer {
    width: 100%;
    /* height: 200px; */
    background-color: #fff;
    padding: 60px 20px 20px 20px;
    position: fixed;
    bottom: 0;
    border-radius: 10px;
    z-index: 999;
    animation: loading 1s forwards;

    .n-avatar {
        float: left;
        margin-right: 30px;
    }

    .textArea {
        width: 90%;
        height: 120px;
        display: inline-block;
        background-color: #f7f8fa;

        textarea {
            width: 100%;
            height: 80px;
            border: none;
            background: none;
            outline: none;
            color: inherit; /* 继承父元素的文本颜色 */
            padding: 10px; /* 内边距，调整文本与边缘的距离 */
            overflow-y: auto;
            resize: none; /* 禁止用户手动调整大小 */
        }

        /* 设置评论框的侧边滑轮样式 */
        textarea::-webkit-scrollbar {
            width: 3px;
        }
        textarea::-webkit-scrollbar-thumb {
            background-color: #888; /* 滚动条的颜色 */
            border-radius: 4px; /* 滚动条的圆角 */
        }
        textarea::-webkit-scrollbar-track {
            opacity: 0.5; /* 滚动条轨道的颜色 */
        }

        .drawer-bottom {
            display: grid;
            grid-template-columns: 3fr 1fr;
            line-height: 28px;

            .left {
                padding-left: 20px;
                position: relative;

                .n-upload {
                    display: inline-block;
                    width: 48px;
                    margin-left: 50px;
                }

                .n-upload >>> .n-upload-trigger + .n-upload-file-list {
                    width: 500px;
                    display: inline-block;
                }

                .n-button {
                    position: absolute;
                    top: 40px;
                    right: -50px;
                }
                .icon {
                    margin-right: 30px;
                    position: absolute;
                    top: 10px;
                }
                .icon1 {
                    position: absolute;
                    bottom: 24px;
                    left: 20px;
                    z-index: 9999;
                }
                .icon:hover {
                    cursor: pointer;
                }
                .emoji-mart {
                    width: 30px;
                    position: absolute;
                    bottom: 36px;
                    left: -120px;
                    z-index: 999;
                }
            }

            .right {
                span {
                    margin-right: 20px;
                }
            }
        }
    }
}
</style>
