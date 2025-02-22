<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
//引入自定义组件
import Article from '@/views/components/article/index.vue';
import skeleton from '@/views/components/skeleton/index.vue';
import FansInfo from '@/views/components/fansInfo/index.vue';
import PublishButton from '../components/PublishButton/index.vue';
import author from '@/views/components/Author/index.vue';
//引入api
import {
    getMemberInfo,
    editSignature,
    getArticleInfo,
    deleteArticle,
    getConcernList,
    getConcernDetail,
    getTouristArticleInfo
} from '@/config/apis/member.ts';
import { concernInter, collectionInter, getTouristAuthorDetail } from '@/config/apis/articleDetail';
import { getNumberData, getTouristNumberData } from '@/config/apis/settings.ts';
//引入全局状态管理
import { useUserStore } from '@/config/store/userStore';
//引入公共方法
import { debounce } from '@/utils/debounce.ts';
//引入第三方组件
import '@/assets/css/icon/iconfont.css';
import type { InputInst } from 'naive-ui';
import { useMessage } from 'naive-ui';
import { Icon } from '@vicons/utils';
import {
    EditTwotone,
    LikeTwotone,
    EyeOutlined,
    HeartFilled,
    WeiboOutlined,
    GithubFilled,
    SearchOutlined
} from '@vicons/antd';

//定义路由对象
const router = useRouter();

const routes = useRoute();

//定义消息提示对象
const message = useMessage();

const userInfor = useUserStore();

//------------------------生命周期---------------------

onMounted(async () => {
    userInfo();
    articleInit();
    linkInit();
    window.addEventListener('scroll', scrollLoad);
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', scrollLoad);
});

//-----------------------游客模式------------------------------
//控制登录组件是否出现
const loginAppear = ref(false);

//触发登录的事件
const triggerType = ref('');

//登录后的操作
const performOperation = async (type: string) => {
    loginAppear.value = false;
    await userInfo();
    if (type === '关注此用户' && !user.concern_status) {
        concern();
    }
};

//----------------监听跳转当前登录人的会员中心-------------------
watch(
    () => userInfor.jumpToMemberCenter,
    (newVal) => {
        updateJumpInfo(newVal);
        if (newVal === userInfor.userInfo.id) {
            isSelf.value = true;
        }
    }
);

//------------------------发布文章的按钮---------------
//控制发布文章按钮是否显示
const publicAppear = ref(false);

const scrollLoad = () => {
    //监听控制发布文章按钮
    // 获取当前滚动位置
    const scrollTop = window.scrollY;
    if (scrollTop >= 30) {
        publicAppear.value = true;
    } else {
        publicAppear.value = false;
    }
    //-----------监听控制下拉加载数据-----------
    // 获取页面的总高度
    const windowHeight = window.innerHeight;
    // 获取页面的滚动高度
    const scrollHeight = document.documentElement.scrollHeight;

    console.log(scrollTop, windowHeight, scrollHeight);

    // 判断是否滚动到页面底部
    if (scrollTop + windowHeight + 1 >= scrollHeight) {
        if (tabValue.value === '关注') {
            fansLoadInit();
        } else {
            loadInit();
        }
    }
};

//------------------------用户模块---------------------

//定义当前会员中心人员的id
const paramId = ref(+routes.params.id);

//控制个签是否可编辑
const isEdit = ref(true);

//获取到输入框
const inputInstRef = ref<InputInst | null>(null);

//控制当前页面的用户是否是当前登录的用户
const isSelf = ref(true);

//控制显示骨架屏
const skeletonUser = ref(true);

//控制关注按钮的加载效果
const loadButton = ref(false);

//判断游客是否已经登录
const isLogin = ref(false);

//定义当前会员中心人员的各种信息
const user = reactive({
    id: paramId.value,
    head_shot: '',
    nickname: '',
    signature: '',
    likes_count: 0,
    reads_count: 0,
    attentions_count: 0,
    concerns_count: 0,
    fans_count: 0,
    date: '',
    tag: '',
    concern_status: false,
    blog_link: '',
    weibo_link: '',
    github_link: ''
});

//初始化用户数据
const userInfo = async () => {
    if (+user.id !== userInfor.userInfo?.id) {
        isSelf.value = false;
    }
    skeletonUser.value = true;
    if (userInfor.token === '') {
        const { data } = await getTouristAuthorDetail({
            author_id: user.id
        });
        if (data) {
            skeletonUser.value = false;
            Object.assign(user, data);
        }
    } else {
        const { data } = await getMemberInfo({
            author_id: user.id
        });
        if (data) {
            skeletonUser.value = false;
            Object.assign(user, data);
        }
    }
};

//初始化微博、博客链接
const linkInit = async () => {
    if (userInfor.token === '') {
        const { data } = await getTouristNumberData({
            author_id: user.id
        });
        user.blog_link = data.blog_link;
        user.weibo_link = data.weibo_link;
        user.github_link = data.github_link;
    } else {
        const { data } = await getNumberData({
            author_id: user.id
        });
        user.blog_link = data.blog_link;
        user.weibo_link = data.weibo_link;
        user.github_link = data.github_link;
    }
};

//编辑个签
const edit = () => {
    isEdit.value = false;
    setTimeout(() => {
        inputInstRef.value.focus();
    }, 100);
};

//输入框失焦后提交编辑的个签
const commitSignature = async () => {
    isEdit.value = true;
    const signature = {
        signature: user.signature
    };
    const { code } = await editSignature(signature);
    if (code === 2000) {
        message.success('更改个签成功');
    } else {
        message.error('更改个签失败');
    }
};

//关注
const concernFun = async () => {
    if (userInfor.token === '') {
        loginAppear.value = true;
        triggerType.value = '关注此用户';
    } else {
        loadButton.value = true;
        try {
            const { code } = await concernInter({
                followed_id: +user.id
            });
            if (code === 2000) {
                if (!user.concern_status) {
                    message.success('关注成功');
                } else {
                    message.success('取消关注成功');
                }
            } else {
                message.error('关注失败');
            }
            loadButton.value = false;
            user.concern_status = !user.concern_status;
        } catch (error) {
            message.error(error);
            loadButton.value = false;
        }
    }
};

const concern = debounce(concernFun, 500);

//设置按钮
const settinngs = () => {
    router.push(`/settings`);
};

//--------------------关注列表模块------------------------
//控制文章、收藏、关注模块的骨架屏
const skeletonOther = ref(true);

//定义关注的人的筛选条件
const fansType = reactive({
    userId: user.id,
    page: 1,
    limit: 7,
    keyword: ''
});

//是否正在加载
const isLoading = ref(false);

//表示是否还有数据
const noMore = ref(false);

//关注列表数据id
const fansId = ref([]);

//关注列表数组
const fansArr = ref([]);

//初始化关注列表
const fansList = async () => {
    skeletonOther.value = true;
    const { data } = await getConcernList(fansType);
    if (data) {
        skeletonOther.value = false;
        fansId.value = data.ids.ids;
        const fansData = await getConcernDetail({
            ids: fansId.value,
            keyword: fansType.keyword
        });
        if (fansData) {
            fansArr.value = fansData.data.user_info_list;
        }
    }
};

//下拉加载关注列表数据
const fansLoadInit = async () => {
    if (isLoading.value) return;
    isLoading.value = true;

    setTimeout(async () => {
        fansType.page++;
        const { data } = await getConcernList(fansType);
        if (data) {
            isLoading.value = false;
            if (data.ids.ids.length === 0) {
                noMore.value = true;
            } else {
                fansId.value.push(...data.ids.ids);
                const fansData = await getConcernDetail({
                    ids: fansId.value,
                    keyword: fansType.keyword
                });
                fansArr.value = fansData.data.user_info_list;
            }
        }
    }, 1000);
};

//跳转到关注人的会员中心
const updateJumpInfo = (id) => {
    user.id = id;
    fansType.userId = id;
    aticleType.id = id;
    userInfo();
    articleInit();
    fansList();
    linkInit();
    userInfor.jumpToMemberCenter = id;
};

//------------------文章列表模块------------------------------

//定义文章的筛选条件
const aticleType = reactive({
    id: user.id,
    type: '文章',
    page: 1,
    limit: 5,
    keyword: ''
});

//文章数组
const articleArr = ref([]);

//定义变量接收标签的目前值
const tabValue = ref('文章');

//控制取消收藏按钮的加载效果
const collectLoadButton = ref(false);

//初始化文章的信息
const articleInit = async () => {
    articleArr.value = [];
    skeletonOther.value = true;
    if (userInfor.token === '') {
        const { data } = await getTouristArticleInfo(aticleType);
        if (data) {
            skeletonOther.value = false;
            articleArr.value = data.dataList;
        }
    } else {
        const { data } = await getArticleInfo(aticleType);
        if (data) {
            skeletonOther.value = false;
            articleArr.value = data.dataList;
        }
    }
};

//发表文章按钮
const pubicArticle = () => {
    router.push(`/articlerelease/0`);
};

//切换标签
const tabChange = (value: string) => {
    tabValue.value = value;
    fansType.keyword = '';
    aticleType.keyword = '';
    noMore.value = false;
    if (value !== '关注') {
        aticleType.type = value;
        aticleType.page = 1;
        articleInit();
    } else {
        aticleType.type = '';
        fansType.page = 1;
        fansList();
    }
};

//下拉加载文章数据
const loadInit = async () => {
    if (isLoading.value) return;
    isLoading.value = true;

    setTimeout(async () => {
        aticleType.page++;
        const { data } = await getArticleInfo(aticleType);
        if (data) {
            if (data.dataList.length > 0) {
                articleArr.value.push(...data.dataList);
            }
            isLoading.value = false;
            if (data.dataList.length === 0) {
                noMore.value = true;
            }
        }
    }, 1000);
};

//编辑本篇文章
const editTotal = (id) => {
    event.stopPropagation();
    router.push(`/articlerelease/${id}`);
};

//删除文章
const deleteArticles = async (id) => {
    event.stopPropagation();
    const { code } = await deleteArticle({
        id: id
    });
    if (code === 2000) {
        message.success('删除成功');
        articleArr.value = articleArr.value.filter((item) => item.id !== id);
    } else {
        message.error('删除失败');
    }
};

//取消收藏
const cancelCollection = async (id) => {
    collectLoadButton.value = true;
    const { code } = await collectionInter({
        article_id: id,
        collection_status: false
    });
    if (code === 2000) {
        message.success('取消收藏成功！');
        collectLoadButton.value = false;
        articleArr.value = articleArr.value.filter((item) => item.id !== id);
    }
};

//-------------------- 搜索模块 ---------------------------

//控制搜索框的宽度
const inputWidth = ref('0px'); // 初始宽度为 0

//搜索框输入的内容
const inputValue = ref('');

//控制搜索框什么时候缩回
const isInputBack = ref(false);

// 鼠标悬停时输入框设置宽度
const expandInput = () => {
    if (!isInputBack.value) {
        isInputBack.value = false;
        inputWidth.value = '200px';
    }
};

// 鼠标移走时输入框缩回
const shrinkInput = () => {
    if (isInputBack.value) {
        inputWidth.value = '0px';
        isInputBack.value = false;
        inputValue.value = '';
    } else {
        inputWidth.value = '200px';
    }
};

//搜索的方法
const searchFun = () => {
    if (aticleType.type !== '') {
        aticleType.keyword = inputValue.value;
        aticleType.page = 1;
        articleInit();
    } else {
        fansType.page = 1;
        fansType.keyword = inputValue.value;
        fansList();
    }
    // fansType.keyword = '';
    isInputBack.value = true;
};
</script>
<template>
    <div class="wrap">
        <div class="overlay" v-if="loginAppear"></div>
        <author v-if="loginAppear" class="loginCom" :type="triggerType" @trigger-type="performOperation"></author>
        <div class="member-content">
            <div class="left">
                <n-card size="huge">
                    <skeleton v-if="skeletonUser"></skeleton>
                    <div v-else class="information">
                        <div class="left-left">
                            <n-avatar round :size="48" :src="user.head_shot || ''" />
                            <n-ellipsis style="max-width: 240px; display: block; font-weight: 800; font-size: 18px">
                                {{ user.nickname }}
                            </n-ellipsis>
                            <n-ellipsis style="max-width: 240px; display: block">
                                {{ user.date }} 加入了{{ user.tag }}
                            </n-ellipsis>
                            <n-input
                                ref="inputInstRef"
                                :value="user.signature"
                                placeholder=""
                                :disabled="isEdit"
                                @blur="commitSignature"
                                style="width: 200px"
                            />
                            <i class="iconfont" @click="edit" style="color: #cbcbcb" v-if="isSelf">&#xe602;</i>
                        </div>
                        <div class="left-right">
                            <div class="icons">
                                <a :href="user.blog_link">
                                    <i class="iconfont">&#xe668;</i>
                                </a>
                                <a :href="user.weibo_link">
                                    <Icon size="18">
                                        <WeiboOutlined />
                                    </Icon>
                                </a>
                                <a :href="user.github_link">
                                    <Icon size="18">
                                        <GithubFilled />
                                    </Icon>
                                </a>
                            </div>
                            <n-button tertiary round type="primary" @click="settinngs" class="settings" v-if="isSelf">
                                设置
                            </n-button>
                            <n-button
                                tertiary
                                round
                                type="primary"
                                @click="concern"
                                v-if="!user.concern_status && !isSelf"
                                class="concern"
                                :loading="loadButton"
                                icon-placement="right"
                            >
                                关注
                            </n-button>
                            <n-button
                                tertiary
                                round
                                type="primary"
                                @click="concern"
                                v-if="user.concern_status && !isSelf"
                                class="concern"
                                :loading="loadButton"
                                icon-placement="right"
                            >
                                已关注
                            </n-button>
                        </div>
                    </div>
                </n-card>
                <n-card size="huge" class="article-card" ref="scrollContainer">
                    <n-tabs type="line" animated @update:value="tabChange">
                        <template #suffix>
                            <div class="searchModule">
                                <transition name="slide">
                                    <n-input
                                        round
                                        placeholder="请输入搜索内容"
                                        v-model:value="inputValue"
                                        :style="{ width: inputWidth }"
                                        class="input-box"
                                    />
                                </transition>
                                <Icon
                                    size="22"
                                    class="searchIcon"
                                    color="green"
                                    @mouseover="expandInput"
                                    @mouseleave="shrinkInput"
                                    @click="searchFun"
                                >
                                    <SearchOutlined />
                                </Icon>
                            </div>
                        </template>
                        <n-tab-pane name="文章" tab="文章">
                            <skeleton v-if="skeletonOther"></skeleton>
                            <div v-else>
                                <div class="empty-box" v-if="articleArr.length === 0">
                                    <img src="../../assets/images/empty.png" />
                                </div>
                                <n-infinite-scroll style="min-height: 600px" :distance="10" @load="loadInit" v-else>
                                    <Article
                                        :item="item"
                                        v-for="(item, index) in articleArr"
                                        :key="index"
                                        class="article"
                                    >
                                        <template #type>
                                            <n-tag class="status">{{ item.status }}</n-tag>
                                        </template>
                                        <template #edit>
                                            <n-tag type="success" class="edit" v-if="isSelf">
                                                <i
                                                    class="iconfont"
                                                    @click="editTotal(item.id)"
                                                    style="color: #19a059; font-size: 21px"
                                                >
                                                    &#xe602;
                                                </i>
                                                <i
                                                    class="iconfont"
                                                    @click="deleteArticles(item.id)"
                                                    style="color: #19a059; font-size: 21px"
                                                >
                                                    &#xe624;
                                                </i>
                                            </n-tag>
                                        </template>
                                    </Article>
                                    <div class="loading">
                                        <span class="text" v-if="isLoading && !noMore">正在全力加载中...</span>
                                        <span v-if="noMore" class="text">-没有更多了-</span>
                                    </div>
                                </n-infinite-scroll>
                            </div>
                        </n-tab-pane>
                        <n-tab-pane name="收藏" tab="收藏">
                            <skeleton v-if="skeletonOther"></skeleton>
                            <div v-else>
                                <div class="empty-box" v-if="articleArr.length === 0">
                                    <img src="../../assets/images/empty.png" />
                                </div>
                                <n-infinite-scroll
                                    style="min-height: 600px"
                                    :distance="10"
                                    @load="loadInit"
                                    ref="scrollPage"
                                    v-else
                                >
                                    <Article :item="item" v-for="(item, index) in articleArr" :key="index">
                                        <template #cancelCollect>
                                            <div class="cancelCollect">
                                                <n-button
                                                    strong
                                                    secondary
                                                    round
                                                    type="primary"
                                                    @click.stop="cancelCollection(item.id)"
                                                    v-if="isSelf"
                                                    :loading="collectLoadButton"
                                                    icon-placement="right"
                                                >
                                                    取消收藏
                                                </n-button>
                                            </div>
                                        </template>
                                    </Article>
                                    <div class="loading">
                                        <span class="text" v-if="isLoading && !noMore">正在全力加载中...</span>
                                        <span v-if="noMore" class="text">-没有更多了-</span>
                                    </div>
                                </n-infinite-scroll>
                            </div>
                        </n-tab-pane>
                        <n-tab-pane name="关注" tab="关注">
                            <skeleton v-if="skeletonOther"></skeleton>
                            <div v-else>
                                <div class="empty-box" v-if="fansArr.length === 0">
                                    <img src="../../assets/images/empty.png" />
                                </div>
                                <n-infinite-scroll style="min-height: 600px" :distance="10" @load="fansLoadInit" v-else>
                                    <FansInfo
                                        :item="item"
                                        v-for="(item, index) in fansArr"
                                        :key="index"
                                        @jump-memberCenter="updateJumpInfo"
                                        @concern="concern"
                                    ></FansInfo>
                                    <div class="loading">
                                        <span class="text" v-if="isLoading && !noMore">正在全力加载中...</span>
                                        <span v-if="noMore" class="text">-没有更多了-</span>
                                    </div>
                                </n-infinite-scroll>
                            </div>
                        </n-tab-pane>
                    </n-tabs>
                </n-card>
                <!-- <div v-if="noMore" class="loading">-没有更多了-</div> -->
            </div>
            <div class="right">
                <n-button strong secondary round type="primary" @click="pubicArticle">
                    <Icon size="23">
                        <EditTwotone />
                    </Icon>
                    发布文章
                </n-button>
                <n-card title="个人成就" size="huge" class="achievements">
                    <template #header-extra></template>
                    <skeleton v-if="skeletonUser"></skeleton>
                    <div v-else>
                        <p>
                            <Icon size="16" color="#19a059">
                                <LikeTwotone />
                            </Icon>
                            <span>文章点赞 {{ user.likes_count }}</span>
                        </p>
                        <p>
                            <Icon size="16" color="#19a059">
                                <EyeOutlined />
                            </Icon>
                            <span>文章阅读 {{ user.reads_count }}</span>
                        </p>
                        <p>
                            <Icon size="16" color="#19a059">
                                <HeartFilled />
                            </Icon>
                            <span>文章收藏 {{ user.attentions_count }}</span>
                        </p>
                    </div>
                </n-card>
                <n-card size="huge" class="concernCard">
                    <div class="concern">
                        <p>关注了</p>
                        <p class="number">{{ user.concerns_count }}</p>
                    </div>
                    <div class="concerned">
                        <p>关注者</p>
                        <p class="number">{{ user.fans_count }}</p>
                    </div>
                </n-card>
            </div>
        </div>
        <transition name="scale">
            <PublishButton v-if="publicAppear"></PublishButton>
        </transition>
    </div>
</template>
<style scoped lang="scss">
@use '@/assets/styles/mixin.scss' as *;
.wrap {
    @include all;
    background-color: #f2f3f5;
    margin-top: 75px;
    @include overlay;
    .loginCom {
        z-index: 999;
        position: fixed;
        left: 50%;
        top: 50px;
        transform: translateX(-50%);
        background-color: #fff;
    }
    .member-content {
        width: 80%;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 3fr 1fr;
        // padding-top: 20px;

        .left {
            .xicon {
                height: 25px;
                margin-left: 7px;
            }

            .xicon:hover {
                cursor: pointer;
            }
            .n-card {
                margin: 20px 0px;
                padding-bottom: 20px;
                border-radius: 5px;

                .left-left {
                    width: 75%;
                    padding-top: 10px;
                    .n-avatar {
                        float: left;
                        width: 80px;
                        height: 80px;
                        margin-right: 10px;
                    }

                    .n-input {
                        width: 100px;
                    }

                    .iconfont {
                        margin-left: 5px;
                    }
                    .iconfont:hover {
                        cursor: pointer;
                    }

                    @include border;

                    .n-input :deep(.n-input-wrapper) {
                        padding: 0px;
                    }

                    .n-input :deep(.n-input--disabled) {
                        background-color: #fff;
                    }

                    .n-input :deep(.n-input__input-el) {
                        background-color: #fff;
                        color: #31bd73;
                    }
                }
                .left-right {
                    .n-button {
                        margin: 20px 20px 0px 0px;
                        // width: 80px;
                        float: right;
                    }

                    .concern {
                        margin-left: 20px;
                    }

                    .icons {
                        position: relative;
                        display: flex;
                        flex-direction: row-reverse;
                        a {
                            margin-right: 10px;
                        }

                        .iconfont {
                            font-size: 17px;
                            position: absolute;
                            right: 95px;
                            top: -3px;
                        }
                    }
                }
            }

            .information {
                display: grid;
                grid-template-columns: 4fr 1fr;
            }

            .article-card {
                position: relative;

                // .ske {
                //     height: 600px;
                // }

                .empty-box {
                    width: 500px;
                    height: 600px;
                    margin: 0 auto;
                    img {
                        width: 100%;
                    }
                }

                .searchModule {
                    display: flex;
                    align-items: center;

                    .input-box {
                        transition: width 0.5s ease; /* 添加过渡效果 */
                        overflow: hidden; /* 防止文本溢出 */
                        width: 0; /* 初始宽度为 0 */
                    }

                    .searchIcon {
                        margin-right: 30px;
                    }
                }

                .n-tabs .n-tab-pane {
                    padding: 0px;
                }
                .n-tabs :deep(.n-tabs-tab__label) {
                    font-size: 16px;
                }

                .status {
                    height: 20px;
                    font-size: 12px;
                }

                .edit {
                    pointer-events: auto;
                    background-color: #daf0e4;
                    position: absolute;
                    right: 0px;
                    top: 0px;
                    z-index: 999;
                    display: none;
                }

                .article:hover .edit {
                    display: block;
                }

                @include loading;

                .cancelCollect {
                    display: flex;
                    align-items: center;
                    margin: 0px 20px;
                }
            }
        }
        .n-card :deep(.n-card__content) {
            padding: 20px 0px 0px 20px;
        }

        .right {
            display: flex;
            flex-direction: column;
            margin-left: 20px;

            .n-button {
                width: 90%;
                height: 40px;
                margin: 20px 0px 30px 0px;
            }

            .n-card {
                width: 90%;
                margin-bottom: 20px;
                border-radius: 5px;

                p {
                    margin-bottom: 10px;

                    span {
                        margin-left: 5px;
                    }
                }
            }

            @include headBorder;
            .n-card :deep(.n-card-header) {
                padding: 10px;
                font-size: 16px;
            }

            .concernCard {
                display: flex;
                justify-content: space-around;

                .concern {
                    border-right: 1px solid #f2f3f5;
                }

                p {
                    font-size: 18px;
                }

                .number {
                    font-weight: 800;
                }
            }

            .concernCard :deep(.n-card__content) {
                display: grid;
                grid-template-columns: 1fr 1fr;
                text-align: center;
                padding-right: 20px;
            }
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
</style>
