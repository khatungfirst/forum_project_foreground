<script lang="ts" setup>
import { Icon } from '@vicons/utils';
import { SmileOutlined } from '@ant-design/icons-vue';
import { FileImageOutlined } from '@ant-design/icons-vue';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';
import { defineProps } from 'vue';
const prop = defineProps<{
    appear: boolean;
    childWidth: number;
}>();

// 使用ref来创建一个响应式的数据属性
const inputValue = ref('');

//输入框中的字数
const fontNumber = computed(() => inputValue.value.length);
</script>
<template>
    <div class="drawer" v-if="prop.appear" :style="{ width: prop.childWidth + 'px' }">
        <n-avatar round size="large" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
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
                    <Icon :size="18" color="#8a919f" class="icon">
                        <SmileOutlined />
                    </Icon>
                    <Icon :size="18" color="#8a919f" class="icon">
                        <FileImageOutlined />
                    </Icon>
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
<style scoped lang="scss">
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
    height: 200px;
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

        //设置评论框的侧边滑轮样式
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
            grid-template-columns: 4fr 1fr;
            line-height: 28px;

            .left {
                padding-left: 20px;
                .icon {
                    margin-right: 30px;
                }
                .icon:hover {
                    cursor: pointer;
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
