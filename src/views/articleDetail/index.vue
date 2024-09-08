<script lang="ts" setup>
import { LikeTwotone } from '@vicons/antd'; // 导入点赞的图标
import { MessageTwotone } from '@vicons/antd'; //导入评论的图标
import { StarTwotone } from '@vicons/antd'; //导入收藏的图标
import { WarningFilled } from '@vicons/antd'; //导入注意的图标
import IconWrapper from '@/views/components/icon/IconWrapper.vue'; //导入图标组件
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import commentDrawer from '@/views/components/commentDrawer/index.vue';
import { useMessage } from 'naive-ui';
//定义图标颜色的属性
const iconColor = '#8A919F';
//定义一个响应式数组来跟踪每个图标的状态
const currentIcon = ref([false, false]);

//定义router
const router = useRouter();

//定义控制评论页面的出现
const appear = ref(false);

//定义是否显示遮罩层的方法
const isOverlayVisible = ref(false);

//定义一个变量接收中间盒子的宽度
const centerRef = ref<HTMLElement | null>(null);

//定义评论子盒子的宽度
const childWidth = ref(0);

//定义简洁作者简介是否出现
const isAuthorInfo = ref(false);

//定义消息提示对象
const message = useMessage();

//点赞的方法
const like = () => {
    currentIcon.value[0] = !currentIcon.value[0];
    console.log('like');
};

//评论的方法
const review = () => {
    appear.value = !appear.value;
    isOverlayVisible.value = !isOverlayVisible.value;
    console.log('review');
};

//收藏的方法
const collect = () => {
    currentIcon.value[1] = !currentIcon.value[1];
    console.log('collect');
};

//注意的方法
const attention = () => {
    console.log('attention');
};

//跳转到登录页面的方法
const login = () => {
    router.push('/login');
};

//私信的方法
const personalLetter = () => {
    message.warning('私信功能暂未开放，敬请期待吧！');
};

//定义遮罩层的点击事件
const handleMaskClick = () => {
    isOverlayVisible.value = false;
    appear.value = false;
};

// 获取中间盒子的宽度
const updateChildWidth = () => {
    if (centerRef.value) {
        childWidth.value = centerRef.value.clientWidth;
    }
};

//页面滚动到一定位置触发的事件
const handleScroll = () => {
    if (window.scrollY >= 200) {
        isAuthorInfo.value = true;
    } else {
        isAuthorInfo.value = false;
    }
};

// 监听窗口调整
onMounted(async () => {
    await nextTick(); // 确保 DOM 更新完成
    updateChildWidth();
    //监听中间窗口的变化
    window.addEventListener('resize', updateChildWidth);
    //监听页面滚动到位置
    window.addEventListener('scroll', handleScroll);
});

// 移除监听
onBeforeUnmount(() => {
    window.removeEventListener('resize', updateChildWidth);
    window.removeEventListener('scroll', handleScroll);
});
</script>
<template>
    <div class="wrap">
        <div v-if="isOverlayVisible" class="overlay" @click="handleMaskClick"></div>
        <div class="left">
            <div class="left-contains">
                <div class="laconicAuthorInfo" v-if="isAuthorInfo">
                    <n-avatar round size="large" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
                    <span>作者名</span>
                </div>
                <IconWrapper
                    :icon="LikeTwotone"
                    :color="currentIcon[0] ? '#19A059' : iconColor"
                    :size="24"
                    @click="like"
                    :badgeValue="0"
                    :showBadge="true"
                />
                <IconWrapper
                    :icon="MessageTwotone"
                    :size="24"
                    @click="review"
                    color="#8A919F"
                    :badgeValue="0"
                    :showBadge="true"
                />
                <IconWrapper
                    :icon="StarTwotone"
                    :color="currentIcon[1] ? '#19A059' : iconColor"
                    :size="24"
                    @click="collect"
                    :badgeValue="0"
                    :showBadge="true"
                />
                <IconWrapper
                    :icon="WarningFilled"
                    :size="24"
                    @click="attention"
                    color="#8A919F"
                    :showBadge="false"
                    :badgeValue="0"
                />
            </div>
        </div>
        <div class="middle" ref="centerRef">
            <div class="article-detail">
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
            </div>
            <div class="reviewModule">
                <h3>评论</h3>
                <div class="loginRegist">
                    <n-avatar round size="large" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
                    <div class="loginBgc">
                        <n-button strong secondary round type="primary" @click="login">登录注册</n-button>
                        <span>登录后可评论</span>
                    </div>
                </div>
                <div class="review-detail">
                    <p>最新</p>
                </div>
            </div>
            <!-- 评论的盒子 -->
            <commentDrawer :appear="appear" :childWidth="childWidth"></commentDrawer>
        </div>
        <div class="right">
            <div class="author-detail" ref="authorDetail">
                <div class="top">
                    <n-avatar round size="large" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
                    <div class="authorName">
                        <p class="name">作者名</p>
                        <p class="tag">标签</p>
                    </div>
                </div>
                <div class="middle">
                    <div class="article">
                        <p>130</p>
                        <p class="second">文章</p>
                    </div>
                    <div class="read">
                        <p>130</p>
                        <p class="second">阅读</p>
                    </div>
                    <div class="fan">
                        <p>130</p>
                        <p class="second">粉丝</p>
                    </div>
                </div>
                <div class="bottom">
                    <n-button strong secondary round type="primary">关注</n-button>
                    <n-button tertiary round type="primary" @click="personalLetter">私信</n-button>
                </div>
            </div>
            <div class="catalogue">
                <div class="catalogue-top">
                    <span>目录</span>
                    <span class="pack_up">收起</span>
                </div>
                <div class="catalogue-detail"></div>
            </div>
            <div class="advertisement"></div>
            <div class="relevant_recommendation">
                <div class="recommendation-top">
                    <p>相关推荐</p>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
* {
    box-sizing: border-box;
}
.wrap {
    width: 100%;
    display: flex;
    background-color: #f2f3f5;

    //遮罩层
    .overlay {
        position: fixed; /* 固定定位 */
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色 */
        z-index: 998; /* 确保在最上层 */
    }

    .left {
        width: 10%;
        padding-top: 15vh;

        .left-contains {
            width: 10%;
            position: fixed;
            .laconicAuthorInfo {
                height: 100px;
                display: flex;
                align-items: center;
                justify-content: center;
                .n-avatar {
                    margin-right: 20px;
                }
            }
        }
    }
    .middle {
        position: relative; /* 使子元素可以绝对定位 */
        width: 60%;
        flex: 1;
        margin: 0px 20px;
        .article-detail {
            padding: 30px;
            background-color: #fff;
            margin-bottom: 20px;
        }

        .reviewModule {
            padding: 20px;
            background-color: #fff;
            h3 {
                margin-bottom: 20px;
            }

            .loginRegist {
                height: 140px;
                display: grid;
                grid-template-columns: 1fr 14fr;
                .loginBgc {
                    width: 90%;
                    height: 120px;
                    float: right;
                    background-color: #f7f8fa;
                    text-align: center;
                    line-height: 120px;
                    border-radius: 5px;

                    .n-button {
                        margin-right: 5px;
                    }
                }
            }
        }

        .n-drawer {
            max-width: 100%;
        }
    }
    .right {
        width: 25%;

        .author-detail {
            width: 70%;
            height: 200px;
            background-color: #fff;
            margin-bottom: 20px;
            padding: 10px;

            .top {
                padding-left: 15px;
                .n-avatar {
                    float: left;
                    margin-right: 10px;
                }

                .authorName {
                    p {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .name {
                        font-size: 16px;
                    }
                    .tag {
                        font-size: 12px;
                        color: #707070;
                    }
                }
            }

            .middle {
                width: 100%;
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                margin: 15px 0px;
                text-align: center;
                p {
                    margin: 5px;
                }

                .second {
                    color: #8a919f;
                }
            }

            .bottom {
                display: flex;
                justify-content: space-around;
                .n-button {
                    width: 100px;
                }
            }
        }

        .catalogue {
            width: 70%;
            background-color: #fff;
            padding: 10px;
            margin-bottom: 20px;

            .catalogue-top {
                border-bottom: #e7ecf4 1px solid;
                padding-bottom: 3px;
                .pack_up {
                    font-size: 14px;
                    color: #8a919f;
                    float: right;
                }

                .pack_up:hover {
                    cursor: pointer;
                }
            }
        }

        .advertisement {
            width: 70%;
            height: 130px;
            background-color: #fff;
            margin-bottom: 20px;
        }

        .relevant_recommendation {
            width: 70%;
            background-color: #fff;
            padding: 10px;

            .recommendation-top {
                border-bottom: #e7ecf4 1px solid;
                padding-bottom: 3px;
            }
        }
    }
}
</style>
