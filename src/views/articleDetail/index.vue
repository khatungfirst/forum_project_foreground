<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
    getArticleDetail,
    getAuthorDetail,
    likeInter,
    collectionInter,
    concernInter
} from '@/config/apis/articleDetail';
import { getFirstOrderComments } from '@/config/apis/comments';
import { debounce } from '@/utils/debounce.ts';
import { useUserStore } from '@/config/store/userStore';
import IconWrapper from '@/views/components/icon/IconWrapper.vue';
import commentDrawer from '@/views/components/commentDrawer/index.vue';
import authorMessage from '@/views/articleDetail/authorMessage/index.vue';
import FirstOrderComments from '@/views/articleDetail/firstOrderComments/index.vue';
import { useMessage } from 'naive-ui';
import { LikeFilled, MessageTwotone, StarFilled, EyeOutlined, PlusCircleFilled, CheckCircleFilled } from '@vicons/antd';
import { Icon } from '@vicons/utils';
import MarkdownIt from 'markdown-it';
import PublishButton from '../components/PublishButton/index.vue';

//定义router
const router = useRouter();

const route = useRoute();

//定义消息提示对象
const message = useMessage();

//区分该文章作者是否是当前登录的用户
const isPerson = ref(false);

const userInfo = useUserStore();

// ---------------------------生命周期---------------------------------

onMounted(async () => {
    initArticle();
    // authorInit();
    initComments();
    await nextTick(); // 确保 DOM 更新完成
    //监听页面滚动到位置
    window.addEventListener('scroll', handleScroll);
    // 生成文章标题列表
    await getTitle();
    // 监听页面滚动事件
    window.addEventListener('scroll', scroll());
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('scroll', scroll());
});

// ---------------------------文章模块---------------------------------

//定义图标颜色的属性
const iconColor = '#8A919F';

//定义一个响应式数组来跟踪每个图标的状态
const currentIcon = ref([false, false]);

//定义路由变量
const paramId = ref(+route.params.id);

//文章对象
const articleInfo = reactive({
    id: paramId.value, //定义本篇文章的id
    likeTotal: 0, //定义本文章的点赞数
    collections: 0, // //定义本文章的收藏数
    title: 0, //文章标题
    time: '', //发布日期
    views_count: 0, //浏览量
    tags: [], //标签
    content: '<p><br><p/>', //文章内容
    author_id: 0,
    nickname: ''
});

//文章相关内容初始化的方法
const initArticle = async () => {
    const articleId = {
        id: articleInfo.id
    };
    const articleData = await getArticleDetail(articleId);
    if (articleData) {
        const article = articleData.data.article;
        articleInfo.likeTotal = article.likes_count;
        articleInfo.collections = article.collections_count;
        currentIcon.value[0] = article.like_status;
        currentIcon.value[1] = article.collection_status;
        articleInfo.time = article.daily_time;
        articleInfo.title = article.title;
        articleInfo.content = article.content;
        articleInfo.tags = article.tags;
        articleInfo.views_count = article.views_count;
        about.value = articleData.data.about;
        articleInfo.author_id = article.user_id;
        articleInfo.nickname = article.nickname;
        authorInit();
        getTitle();
    }
};

//文章内容（计算属性来转换markdown语言）
const contents = computed(() => {
    const md = new MarkdownIt();
    const result = md.render(articleInfo.content);
    return result;
});

//点赞的方法
const like = async () => {
    currentIcon.value[0] = !currentIcon.value[0];
    if (currentIcon.value[0]) {
        articleInfo.likeTotal = articleInfo.likeTotal + 1;
    } else {
        articleInfo.likeTotal = articleInfo.likeTotal - 1;
    }
    const data = {
        article_id: articleInfo.id,
        like_status: currentIcon.value[0]
    };
    const { code } = await likeInter(data);
    console.log(currentIcon.value[0], '点赞状态');
    if (code === 2000 && currentIcon.value[0] === true) {
        message.success('点赞成功');
    } else {
        message.success('取消点赞成功');
    }
};

// 应用防抖到点赞函数
const debouncedLikePost = debounce(like, 300);

//收藏的方法
const collect = async () => {
    //
    currentIcon.value[1] = !currentIcon.value[1];
    if (currentIcon.value[1]) {
        articleInfo.collections = articleInfo.collections + 1;
    } else {
        articleInfo.collections = articleInfo.collections - 1;
    }
    const data = {
        article_id: articleInfo.id,
        collection_status: currentIcon.value[1]
    };
    const { code } = await collectionInter(data);
    if (code === 2000 && currentIcon.value[1] === true) {
        message.success('收藏成功');
    } else {
        message.success('取消收藏成功');
    }
};

// 应用防抖到收藏函数
const debouncedCollectionPost = debounce(collect, 500);

//注意的方法
// const attention = () => {
//     console.log('attention');
// };

// ---------------------------作者、相关推荐模块---------------------------------

//相关推荐的内容
const about = ref([]);

//定义简洁作者简介是否出现
const isAuthorInfo = ref(false);

//当前登录作者id
const personId = JSON.parse(localStorage.getItem('userInfo'));

//作者对象
const authorInfo = reactive({
    author_id: articleInfo.author_id, //当前作者的id
    head: '', //作者头像
    nickname: '', //作者昵称
    signature: '', //作者个签
    author_article: 0, //作者文章数
    author_read: 0, //作者阅读数
    fans_count: 0, //作者粉丝数
    concern_status: false //定义是否关注该作者的状态
});

//作者相关内容的初始化方法
const authorInit = async () => {
    const authorId = {
        author_id: articleInfo.author_id
    };
    const authorData = await getAuthorDetail(authorId);
    if (authorData) {
        const data = authorData.data;
        authorInfo.author_id = articleInfo.author_id;
        authorInfo.head = data.head_shot;
        authorInfo.nickname = data.nickname;
        authorInfo.signature = data.signature;
        authorInfo.author_article = data.article_count;
        authorInfo.author_read = data.reads_count;
        authorInfo.concern_status = data.concern_status;
        authorInfo.fans_count = data.fans_count;
    }
    if (personId && articleInfo.author_id === +personId.id) {
        isPerson.value = true;
    }
};

//关注的方法
const concern = async () => {
    authorInfo.concern_status = !authorInfo.concern_status;
    if (!authorInfo.concern_status) {
        if (authorInfo.fans_count > 0) {
            authorInfo.fans_count--;
        }
    } else {
        authorInfo.fans_count++;
    }
    const data = {
        followed_id: articleInfo.author_id
    };
    const { code } = await concernInter(data);
    if (code === 2000 && authorInfo.concern_status === true) {
        message.success('关注成功');
    } else {
        message.success('取消关注成功');
    }
};
// 应用防抖到关注函数
const debouncedConcernPost = debounce(concern, 500);

//私信的方法
const personalLetter = () => {
    message.warning('私信功能暂未开放，敬请期待吧！');
};

//页面滚动到一定位置触发的事件：作者信息的位置
const handleScroll = () => {
    if (window.scrollY >= 260) {
        isAuthorInfo.value = true;
    } else {
        isAuthorInfo.value = false;
    }
};

//跳转到对应推荐文章的文章详情
const recommendedArtical = (id) => {
    router.push(`/articledetail/${id}`);
    articleInfo.id = id;
    commentInfo.article_id = id;
    initArticle();
    initComments();
};

// ---------------------------评论模块---------------------------------

//一级评论接收数组
const commentsList = ref([]);

//评论总条数
const commentTotal = ref(0);

//控制是否显示去登录模块
const LoginVis = ref(true);

//判断新加载是否获得了数据
const isHavaData = ref(false);

//控制emoji框是否显示
const isEmojiDisappear = ref(false);

//获取到评论框对象
const reviewBox = ref(null);

//获取当前登录人的头像
const head_shot = JSON.parse(localStorage.getItem('userInfo')).avatar_path;

//评论相关数据
const commentInfo = reactive({
    article_id: paramId.value,
    user_id: userInfo.userInfo.id ? userInfo.userInfo.id : 0,
    offset: 1,
    limit: 4
});

//评论相关初始化方法
const initComments = async () => {
    commentInfo.offset = 1;
    commentsList.value = [];
    if (localStorage.getItem('token')) {
        LoginVis.value = false;
    }
    const { data } = await getFirstOrderComments(commentInfo);
    if (data) {
        if (data.first_comments_list.length > 0) {
            commentsList.value = data.first_comments_list;
            isHavaData.value = true;
        }
        commentTotal.value = data.comments_total;
    }
};

//跳转到登录页面的方法
const login = () => {
    router.push('/login');
};

//点击评论图标的事件
const review = () => {
    const targetBox = reviewBox.value;
    targetBox.scrollIntoView({
        behavior: 'smooth', // 平滑滚动
        block: 'center' // 目标盒子垂直居中
    });
};

//得知emoji框出现
const openEmoji = () => {
    isEmojiDisappear.value = true;
};

//控制emoji表情框消失
const emojiDisappear = () => {
    isEmojiDisappear.value = false;
};

//发表评论
const handleMaskClick = () => {
    commentTotal.value++;
    initComments();
};

//删除评论
const deleteFirst = (id) => {
    commentsList.value = commentsList.value.filter((item) => item.id !== id);
    initComments();
};

//评论的下拉事件
const handleLoad = async () => {
    if (isHavaData.value) {
        commentInfo.offset = commentInfo.offset + 1;
        const { data } = await getFirstOrderComments(commentInfo);
        if (data) {
            if (data.first_comments_list.length > 0) {
                commentsList.value.push(...data.first_comments_list);
                isHavaData.value = true;
            } else {
                isHavaData.value = false;
                commentInfo.offset = commentInfo.offset - 1;
            }
        }
    }
};
const handleLoadComment = debounce(handleLoad, 200);

// ---------------------------目录模块---------------------------------

// 目录框是否收起的按钮
const catalogueButton = ref('收起');

//控制目录框是否展开
const catalogueControl = () => {
    if (catalogueButton.value === '收起') {
        catalogueButton.value = '展开';
    } else {
        catalogueButton.value = '收起';
        getTitle();
    }
};

// markdown-对象
const editor = ref(null);

// markdown-文章标题列表
const titleList = ref([]);

// markdown-当前高亮的标题index
const heightTitle = ref(0);

// markdown-生成标题
const getTitle = async () => {
    await nextTick();
    // 使用js选择器，获取对应的h标签，组合成列表
    const anchors = editor.value.querySelectorAll('h1,h2,h3,h4,h5,h6');
    anchors.forEach((heading, index) => {
        heading.setAttribute('data-v-md-line', `line-${index}`);
    });

    // 删除标题头尾的空格
    const titles = Array.from(anchors).filter((title) => !!title.innerText.trim());
    // 当文章h标签为空时，直接返回
    if (!titles.length) {
        titleList.value = [];
        return;
    }
    // 从h标签属性中，提取相关信息
    const hTags = Array.from(new Set(titles.map((title) => title.tagName))).sort();

    titleList.value = titles.map((el) => ({
        // 标题内容
        title: el.innerText,
        // 标签line id
        lineIndex: el.getAttribute('data-v-md-line'),
        // 标签层级
        indent: hTags.indexOf(el.tagName),
        // 标签距离顶部距离
        height: el.offsetTop
    }));
};

// markdown-标题跳转
const rollTo = (anchor, index) => {
    // 获取要跳转的标签的lineIndex
    const { lineIndex } = anchor;
    // 查找lineIndex对应的元素对象
    const heading = editor.value.querySelector(`.v-md-editor-preview [data-v-md-line="${lineIndex}"]`);
    // 页面跳转
    if (heading) {
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // 修改当前高亮的标题
    heightTitle.value = index;
};

// markdown-页面滚动。
const scroll = () => {
    // 监听屏幕滚动时防抖（在规定的时间内触发的事件，只执行最后一次，降低性能开销）
    let timeOut = null;
    return () => {
        // 频繁操作，一直清空先前的定时器
        clearTimeout(timeOut);
        timeOut = setTimeout(() => {
            // 只执行最后一次事件
            const scrollTop = window.pageYOffset;
            // 各个h标签与当前距离绝对值
            const absList = [];
            titleList.value.forEach((item) => {
                absList.push(Math.abs(item.height - scrollTop));
            });
            // 屏幕滚动距离与标题高度最近的index高亮
            heightTitle.value = absList.indexOf(Math.min.apply(null, absList));
        }, 500);
    };
};
watchEffect(async () => {
    // 当 Markdown 内容变化时重新生成标题列表
    await getTitle();
});
</script>
<template>
    <div class="wrap">
        <div class="overlay" @click="emojiDisappear" v-if="isEmojiDisappear"></div>
        <div class="left">
            <div class="left-contains">
                <transition name="scale">
                    <div class="laconicAuthorInfo" v-if="isAuthorInfo">
                        <n-avatar round size="large" :src="authorInfo.head" style="width: 55px; height: 55px" />
                        <div class="iconDiv" v-if="!isPerson">
                            <Icon :color="'#19A059'" :size="22" @click="concern">
                                <component :is="!authorInfo.concern_status ? PlusCircleFilled : CheckCircleFilled" />
                            </Icon>
                        </div>
                        <!-- <span>{{ authorInfo.nickname }}</span> -->
                    </div>
                </transition>
                <IconWrapper
                    :icon="LikeFilled"
                    :color="currentIcon[0] ? '#19A059' : iconColor"
                    :size="24"
                    @click="debouncedLikePost"
                    :badgeValue="articleInfo.likeTotal"
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
                    :icon="StarFilled"
                    :color="currentIcon[1] ? '#19A059' : iconColor"
                    :size="24"
                    @click="debouncedCollectionPost"
                    :badgeValue="articleInfo.collections"
                    :showBadge="true"
                />
                <!-- <IconWrapper
                    :icon="WarningFilled"
                    :size="24"
                    @click="attention"
                    color="#8A919F"
                    :showBadge="false"
                    :badgeValue="0"
                /> -->
            </div>
        </div>
        <div class="middle" ref="centerRef">
            <div class="article-detail">
                <h1 style="font-size: 35px; margin-bottom: 10px">{{ articleInfo.title }}</h1>
                <div class="message">
                    <n-ellipsis style="max-width: 240px">
                        {{ articleInfo.nickname }}
                    </n-ellipsis>
                    <!-- <span class="nickName">{{ authorInfo.nickname }}</span> -->
                    <span class="nickName">{{ articleInfo.time }}</span>
                    <span class="icon">
                        <Icon class="icon1">
                            <EyeOutlined />
                        </Icon>
                        {{ articleInfo.views_count }}
                    </span>
                </div>
                <!-- <p v-html="contents"></p> -->
                <div ref="editor">
                    <v-md-preview :text="contents" />
                </div>
                <div class="tags">
                    <span>标签：</span>
                    <ul>
                        <li v-for="(item, index) in articleInfo.tags" :key="index">{{ item.name }}</li>
                    </ul>
                </div>
            </div>
            <div class="reviewModule">
                <h2>评论 {{ commentTotal }}</h2>
                <div class="loginRegist" v-if="LoginVis" ref="reviewBox">
                    <n-avatar round size="large" :src="authorInfo.head" />
                    <div class="loginBgc">
                        <n-button strong secondary round type="primary" @click="login">登录注册</n-button>
                        <span>登录后可评论</span>
                    </div>
                </div>
                <div v-else ref="reviewBox">
                    <n-avatar round size="large" :src="head_shot" />
                    <!-- 评论的盒子 -->
                    <commentDrawer
                        :appear="true"
                        :emojiDisappear="isEmojiDisappear"
                        @close-comment="handleMaskClick"
                        @open-emoji="openEmoji"
                    ></commentDrawer>
                </div>

                <div class="review-detail">
                    <p>最新</p>
                    <div class="alone-comments">
                        <n-infinite-scroll :distance="0" @load="handleLoadComment">
                            <FirstOrderComments
                                :item="item"
                                v-for="(item, index) in commentsList"
                                :key="index"
                                @delete-firComments="deleteFirst"
                            ></FirstOrderComments>
                        </n-infinite-scroll>
                    </div>
                </div>
            </div>
        </div>
        <div class="right">
            <div class="author-detail" ref="authorDetail" v-if="!isAuthorInfo">
                <authorMessage :authorInfo="authorInfo"></authorMessage>
                <div class="bottom" v-if="!isPerson">
                    <n-button
                        strong
                        secondary
                        round
                        type="primary"
                        @click="debouncedConcernPost"
                        v-if="!authorInfo.concern_status"
                    >
                        关注
                    </n-button>
                    <n-button strong secondary round type="primary" @click="debouncedConcernPost" v-else>
                        已关注
                    </n-button>
                    <n-button tertiary round type="primary" @click="personalLetter">私信</n-button>
                </div>
            </div>
            <div :class="{ fixed: isAuthorInfo }" class="right-second">
                <div class="catalogue">
                    <n-collapse :default-expanded-names="['收起']">
                        <template #header>
                            <div class="collapse-header" style="border-bottom: 1px solid black"></div>
                        </template>
                        <template #header-extra>
                            <span style="color: #8a91b8; font-size: 13px" @click="catalogueControl">
                                {{ catalogueButton }}
                            </span>
                        </template>
                        <n-collapse-item title="目录" name="收起">
                            <div class="catalogue-detail">
                                <!-- <MarkdownViewer :content="contents" /> -->
                                <div
                                    v-for="(item, index) in titleList"
                                    :key="index"
                                    :style="{ paddingLeft: item.indent * 15 + 15 + 'px' }"
                                    @click.stop="rollTo(item, index)"
                                    :class="index === heightTitle ? 'title-active' : ''"
                                >
                                    <a style="cursor: pointer">{{ item.title }}</a>
                                </div>
                            </div>
                        </n-collapse-item>
                    </n-collapse>
                </div>
                <!-- <div class="advertisement"></div> -->
                <div class="relevant_recommendation">
                    <div class="recommendation-top">
                        <p>相关推荐</p>
                    </div>
                    <ul>
                        <li
                            class="about-detail"
                            v-for="(item, index) in about"
                            :key="index"
                            @click="recommendedArtical(item.id)"
                        >
                            <p>{{ item.title }}</p>
                            <p class="bottom">
                                <span>{{ item.views_count }}阅读</span>
                                ·
                                <span>{{ item.likes_count }}点赞</span>
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <PublishButton></PublishButton>
    </div>
</template>
<style scoped lang="scss">
@use '@/assets/styles/mixin.scss' as *;
.wrap {
    display: flex;
    background-color: #f2f3f5;
    margin-top: 75px;
    .overlay {
        position: fixed; /* 固定定位 */
        top: 0;
        left: 0;
        @include all;
        z-index: 998;
    }

    .left {
        width: 10%;
        padding-top: 15vh;

        .left-contains {
            width: 10%;
            position: fixed;
            .laconicAuthorInfo {
                height: 100px;
                @include flex;
                position: relative;
                margin-bottom: 30px;

                .iconDiv {
                    height: 22px;
                    position: absolute;
                    bottom: 11px;
                    cursor: pointer;
                    background-color: #fff;
                    border-radius: 22px;
                }
            }
            @keyframes scaleIn {
                0% {
                    opacity: 0;
                    transform: scale(0); /* 从 0 缩放到 1 */
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            @keyframes scaleOut {
                from {
                    opacity: 1;
                    transform: scale(1); /* 从 1 缩放到 0 */
                }
                to {
                    opacity: 0;
                    transform: scale(0);
                }
            }
            .scale-enter-active {
                animation: scaleIn 0.5s ease;
            }

            .scale-leave-active {
                animation: scaleOut 0.3s ease;
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
            padding: 45px;
            background-color: #fff;
            margin-bottom: 20px;
            border-radius: 5px;

            .v-md-editor-preview :deep(.github-markdown-body) {
                padding: 0px;
            }

            .v-md-editor-preview :deep(.github-markdown-body h1),
            .v-md-editor-preview :deep(.github-markdown-body h2),
            .v-md-editor-preview :deep(.github-markdown-body h3),
            .v-md-editor-preview :deep(.github-markdown-body h4),
            .v-md-editor-preview :deep(.github-markdown-body h5),
            .v-md-editor-preview :deep(.github-markdown-body h6) {
                border-bottom: none !important;
            }

            .message {
                color: #8a919f;
                display: flex;
                align-items: center;
                margin-bottom: 50px;
                .nickName {
                    margin: 0px 20px;
                }
                .icon {
                    position: relative;
                }

                .icon1 :deep(svg) {
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
                color: #8a919f;

                span {
                    height: 36px;
                    line-height: 36px;
                }

                li {
                    padding: 3px 13px;
                    display: inline-block;
                    margin-left: 9px;
                    background-color: #f7f8fa;
                    border-radius: 5px;
                }
            }
        }

        .reviewModule {
            padding: 30px;
            background-color: #fff;
            border-radius: 5px;

            .n-avatar {
                float: left;
                margin-right: 15px;
                width: 44px;
                height: 44px;
            }

            h2 {
                margin-bottom: 25px;
            }

            .loginRegist {
                height: 160px;
                display: grid;
                grid-template-columns: 1fr 14fr;
                .loginBgc {
                    width: 90%;
                    height: 160px;
                    float: right;
                    background-color: #f7f8fa;
                    text-align: center;
                    line-height: 160px;
                    border-radius: 5px;

                    .n-button {
                        margin-right: 5px;
                    }
                }
            }

            .review-detail {
                p {
                    font-size: 20px;
                    margin: 20px 0px;
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
            // height: 200px;
            background-color: #fff;
            margin-bottom: 20px;
            padding: 10px;
            border-radius: 5px;

            .bottom {
                display: flex;
                justify-content: space-around;
                .n-button {
                    width: 40%;
                }
            }
        }

        .right-second {
            width: 70%;
        }

        .fixed {
            position: fixed;
            width: 17%;
        }

        .catalogue {
            // width: 70%;
            background-color: #fff;
            // padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;

            .n-collapse :deep(.n-collapse-item__header) {
                padding: 15px 0px 8px 0px;
                margin: 0px 15px;
            }

            .catalogue-detail div {
                margin-bottom: 10px;
            }

            .title-active {
                color: #19a059;
                border-left: 5px solid #19a059;
            }
        }

        .catalogue :deep(.n-collapse-item-arrow) {
            display: none;
        }

        .catalogue :deep(.n-collapse-item__header) {
            border-bottom: 1px solid rgb(218, 211, 211);
            font-size: 16px;
        }

        .advertisement {
            // width: 70%;
            height: 130px;
            background-color: #fff;
            margin-bottom: 20px;
        }

        .relevant_recommendation {
            // width: 70%;
            background-color: #fff;
            padding: 15px;
            border-radius: 5px;

            li {
                margin-bottom: 20px;
                p {
                    @include ellipsis;
                    font-size: 14px;

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
