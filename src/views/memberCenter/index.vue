<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import Article from '@/views/components/article/index.vue';
import FansInfo from '@/views/components/fansInfo/index.vue';
import {
    getMemberInfo,
    editSignature,
    getArticleInfo,
    deleteArticle,
    getConcernList,
    getConcernDetail
} from '@/config/apis/member.ts';
import { concernInter, collectionInter } from '@/config/apis/articleDetail';
import { getNumberData } from '@/config/apis/settings.ts';
import { debounce } from '@/utils/debounce.ts';
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

//------------------------生命周期---------------------

onMounted(async () => {
    userInfo();
    articleInit();
    linkInit();
});

//------------------------用户模块---------------------

//定义当前会员中心人员的id
const paramId = ref(+routes.params.id);

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

//控制个签是否可编辑
const isEdit = ref(true);

//获取到输入框
const inputInstRef = ref<InputInst | null>(null);

//控制当前页面的用户是否是当前登录的用户
const isSelf = ref(true);

//初始化用户数据
const userInfo = async () => {
    if (+user.id !== +JSON.parse(localStorage.getItem('userInfo')).id) {
        isSelf.value = false;
    }
    const { data } = await getMemberInfo({
        author_id: user.id
    });

    if (data) {
        Object.assign(user, data);
    }
};

//初始化微博、博客链接
const linkInit = async () => {
    const { data } = await getNumberData({
        author_id: user.id
    });
    user.blog_link = data.blog_link;
    user.weibo_link = data.weibo_link;
    user.github_link = data.github_link;
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
    user.concern_status = !user.concern_status;
    const { code } = await concernInter({
        followed_id: +user.id
    });
    if (code === 2000) {
        if (user.concern_status) {
            message.success('关注成功');
        } else {
            message.success('取消关注成功');
        }
    } else {
        message.error('关注失败');
    }
};

const concern = debounce(concernFun, 500);

//设置按钮
const settinngs = () => {
    router.push(`/settings`);
};

//--------------------关注列表模块------------------------

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
    const { data } = await getConcernList(fansType);
    if (data) {
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

//初始化文章的信息
const articleInit = async () => {
    articleArr.value = [];
    const { data } = await getArticleInfo(aticleType);
    if (data) {
        articleArr.value = data.dataList;
    }
};

//发表文章按钮
const pubicArticle = () => {
    router.push(`/articlerelease/0`);
};

//切换标签
const tabChange = (value: string) => {
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
    const { code } = await collectionInter({
        article_id: id,
        collection_status: false
    });
    if (code) {
        message.success('取消收藏成功！');
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
        fansType.keyword = inputValue.value;
        fansList();
    }
    // fansType.keyword = '';
    isInputBack.value = true;
};
</script>
<template>
    <div class="wrap">
        <div class="member-content">
            <div class="left">
                <n-card size="huge" class="information">
                    <div class="left-left">
                        <n-avatar round :size="48" :src="user.head_shot" />
                        <n-ellipsis style="max-width: 240px; display: block; font-weight: 800; font-size: 18px">
                            {{ user.nickname }}
                        </n-ellipsis>
                        <n-ellipsis style="max-width: 240px; display: block">
                            {{ user.date }} 加入了{{ user.tag }}
                        </n-ellipsis>
                        <n-input
                            ref="inputInstRef"
                            v-model:value="user.signature"
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
                        >
                            已关注
                        </n-button>
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
                            <div class="empty-box" v-if="articleArr.length === 0">
                                <img src="../../assets/images/empty.png" />
                            </div>
                            <n-infinite-scroll style="height: 600px" :distance="10" @load="loadInit" v-else>
                                <Article :item="item" v-for="(item, index) in articleArr" :key="index" class="article">
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
                        </n-tab-pane>
                        <n-tab-pane name="收藏" tab="收藏">
                            <div class="empty-box" v-if="articleArr.length === 0">
                                <img src="../../assets/images/empty.png" />
                            </div>
                            <n-infinite-scroll
                                style="height: 600px"
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
                        </n-tab-pane>
                        <n-tab-pane name="关注" tab="关注">
                            <div class="empty-box" v-if="fansArr.length === 0">
                                <img src="../../assets/images/empty.png" />
                            </div>
                            <n-infinite-scroll style="height: 600px" :distance="10" @load="fansLoadInit" v-else>
                                <FansInfo
                                    :item="item"
                                    v-for="(item, index) in fansArr"
                                    :key="index"
                                    @jump-memberCenter="updateJumpInfo"
                                ></FansInfo>
                                <div class="loading">
                                    <span class="text" v-if="isLoading && !noMore">正在全力加载中...</span>
                                    <span v-if="noMore" class="text">-没有更多了-</span>
                                </div>
                            </n-infinite-scroll>
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
    </div>
</template>
<style scoped lang="scss">
@import '@/assets/styles/mixin.scss';
.wrap {
    @include all;
    background-color: #f2f3f5;

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
                margin-bottom: 20px;
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
                        width: 80px;
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

            .information :deep(.n-card__content) {
                display: grid;
                grid-template-columns: 4fr 1fr;
            }

            .article-card {
                position: relative;

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
                margin: 10px 0px 30px 0px;
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
}
</style>
