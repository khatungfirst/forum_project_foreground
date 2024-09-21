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
import { getArticleDetail } from '../../config/apis/articleDetail';
import { getAuthorDetail } from '../../config/apis/articleDetail';
import { likeInter } from '../../config/apis/articleDetail';
import { collectionInter } from '../../config/apis/articleDetail';
import { concernInter } from '../../config/apis/articleDetail';
// import MarkdownIt from 'markdown-it';
import { Icon } from '@vicons/utils';
import { EyeOutlined } from '@vicons/antd';
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

//当前作者的id
const author_id = ref(0);

//定义消息提示对象
const message = useMessage();

//定义本文章的点赞数
const likeTotal = ref(0);

//定义本文章的收藏数
const collections = ref(0);

//定义是否关注该作者的状态
const concern_status = ref(false);

//定义本篇文章的id
const id = ref(0);

//文章标题
const title = ref('');

//发布日期
const time = ref('');

//浏览量
const views_count = ref(0);

//标签
const tags = ref([]);

//作者头像
const head = ref('');

//作者昵称
const nickname = ref('');

//作者个签
const signature = ref('');

//作者文章数
const author_article = ref(0);

//作者阅读数
const author_read = ref(0);

//作者粉丝数
const fans_count = ref(0);

//点击文章的id
// const article_id = ref(0);

//相关推荐的内容
const about = ref([]);

const content = ref('<p><br><p/>');

//当前登录人的id
const user_id = ref(0);

//文章内容（计算属性来转换markdown语言）
// const contents = computed(() => {
//     const md = new MarkdownIt();
//     const result = md.render(content.value);
//     console.log(result);
//     return result;
// });

onMounted(async () => {
    initArticle();
    authorInit();
});

//防抖的函数
const debounce = (func, wait) => {
    let timeout = null;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.call(this, ...args);
        }, wait);
    };
};

//文章相关内容初始化的方法
const initArticle = async () => {
    const articleId = {
        id: id.value
    };
    const articleData = await getArticleDetail(articleId);
    const article = articleData.data.article;
    likeTotal.value = article.likes_count;
    collections.value = article.collections_count;
    currentIcon.value[0] = article.like_status;
    currentIcon.value[1] = article.collection_status;
    time.value = article.published_at;
    title.value = article.title;
    content.value = article.content;
    tags.value = article.tags;
    about.value = articleData.data.about;
};

//作者相关内容的初始化方法
const authorInit = async () => {
    const authorId = {
        author_id: author_id.value
    };
    const authorData = await getAuthorDetail(authorId);
    const data = authorData.data;
    head.value = data.head_shot;
    nickname.value = data.nickname;
    signature.value = data.signature;
    author_article.value = data.author_article;
    author_read.value = data.author_read;
    concern_status.value = data.concern_status;
};

//点赞的方法
const like = async () => {
    currentIcon.value[0] = !currentIcon.value[0];
    if (currentIcon.value[0]) {
        likeTotal.value = likeTotal.value + 1;
    } else {
        likeTotal.value = likeTotal.value - 1;
    }
    const data = ref({
        article_id: id.value,
        like_status: currentIcon.value[0]
    });
    const { code } = await likeInter(data);
    if (code === 200 && currentIcon.value[0] === true) {
        message.success('点赞成功');
    } else {
        message.success('取消点赞成功');
    }
};

// 应用防抖到点赞函数
const debouncedLikePost = debounce(like, 500);

// 直接返回防抖后的函数作为事件处理函数
const handleLike = debouncedLikePost;

//评论的方法
const review = () => {
    appear.value = !appear.value;
    isOverlayVisible.value = !isOverlayVisible.value;
    console.log('review');
};

//收藏的方法
const collect = async () => {
    //
    currentIcon.value[1] = !currentIcon.value[1];
    if (currentIcon.value[1]) {
        collections.value = collections.value + 1;
    } else {
        collections.value = collections.value - 1;
    }
    const data = ref({
        article_id: id.value,
        collection_status: currentIcon.value[1]
    });
    const { code } = await collectionInter(data);
    if (code === 200 && currentIcon.value[1] === true) {
        message.success('收藏成功');
    } else {
        message.success('取消收藏成功');
    }
};

// 应用防抖到收藏函数
const debouncedCollectionPost = debounce(collect, 500);

// 直接返回防抖后的函数作为事件处理函数
const handleCollection = debouncedCollectionPost;

//注意的方法
const attention = () => {
    console.log('attention');
};

//跳转到登录页面的方法
const login = () => {
    router.push('/login');
};

//关注的方法
const concern = async () => {
    concern_status.value = !concern_status.value;
    if (!concern_status.value) {
        if (fans_count.value > 0) {
            fans_count.value--;
        }
    } else {
        fans_count.value++;
    }
    const data = ref({
        user_id: user_id.value,
        concern_status: concern_status.value
    });
    const { code } = await concernInter(data);
    if (code === 200 && concern_status.value === true) {
        message.success('关注成功');
    } else {
        message.success('取消关注成功');
    }
};
// 应用防抖到关注函数
const debouncedConcernPost = debounce(concern, 500);

// 直接返回防抖后的函数作为事件处理函数
const handleConcern = debouncedConcernPost;

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
                    @click="handleLike"
                    :badgeValue="likeTotal"
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
                    @click="handleCollection"
                    :badgeValue="collections"
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
                <h2>{{ title }}</h2>
                <div class="message">
                    <span class="nickName">{{ nickname }}</span>
                    <span class="nickName">{{ time }}</span>
                    <span class="icon">
                        <Icon>
                            <EyeOutlined />
                        </Icon>
                        {{ views_count }}
                    </span>
                </div>
                <p v-html="content"></p>
                <div class="tags">
                    <span>标签：</span>
                    <ul>
                        <li v-for="(item, index) in tags" :key="index">{{ item }}</li>
                    </ul>
                </div>
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
            <commentDrawer :appear="appear" :childWidth="childWidth" :head-shot="head"></commentDrawer>
        </div>
        <div class="right">
            <div class="author-detail" ref="authorDetail">
                <div class="top">
                    <n-avatar round size="large" :src="head" />
                    <div class="authorName">
                        <p class="name">{{ nickname }}</p>
                        <p class="tag">{{ signature }}</p>
                    </div>
                </div>
                <div class="middle">
                    <div class="article">
                        <p>{{ author_article }}</p>
                        <p class="second">文章</p>
                    </div>
                    <div class="read">
                        <p>{{ author_read }}</p>
                        <p class="second">阅读</p>
                    </div>
                    <div class="fan">
                        <p>{{ fans_count }}</p>
                        <p class="second">粉丝</p>
                    </div>
                </div>
                <div class="bottom">
                    <n-button strong secondary round type="primary" @click="handleConcern" v-if="!concern_status">
                        关注
                    </n-button>
                    <n-button strong secondary round type="primary" @click="concern" v-else>已关注</n-button>
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
                <ul>
                    <li class="about-detail" v-for="(item, index) in about" :key="index">
                        <p>{{ item.title }}</p>
                        <p class="bottom">
                            <span>{{ item.views_count }}阅读</span>
                            -
                            <span>{{ item.likes_count }}点赞</span>
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<style scoped>
* {
    box-sizing: border-box;
}
.wrap {
    width: 100%;
    height: 100%;
    display: flex;
    background-color: #f2f3f5;

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
            width: 100%;
            padding: 30px;
            background-color: #fff;
            margin-bottom: 20px;

            .message {
                display: flex;
                align-items: center;
                margin-bottom: 50px;
                .nickName {
                    margin-right: 20px;
                }
                .icon {
                    position: relative;
                }

                .icon >>> svg {
                    height: 16px;
                    position: absolute;
                    top: 5px;
                }
            }

            p {
                margin-bottom: 50px;
            }

            .tags {
                display: flex;
                margin-bottom: 20px;

                span {
                    height: 36px;
                    line-height: 36px;
                }

                li {
                    padding: 5px 10px;
                    display: inline-block;
                    margin-left: 20px;
                    background-color: #ededee;
                    border-radius: 5px;
                }
            }
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
                    width: 40%;
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

            li {
                margin-bottom: 20px;
                p {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;

                    span {
                        color: #999fbb;
                        font-size: 14px;
                    }
                }
            }

            li:hover {
                cursor: pointer;
            }

            .recommendation-top {
                border-bottom: #e7ecf4 1px solid;
                padding-bottom: 3px;
                margin-bottom: 10px;
            }
        }
    }
}
</style>
