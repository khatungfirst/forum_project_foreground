<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import Article from '@/views/components/article/index.vue';
import FansInfo from '@/views/components/fansInfo/index.vue';
import { getMemberInfo, editSignature, getArticleInfo, deleteArticle, getConcernList } from '@/config/apis/member.ts';
import { concernInter } from '@/config/apis/articleDetail';
import { getNumberData } from '@/config/apis/settings.ts';
import { debounce } from '@/utils/debounce.ts';
import type { InputInst } from 'naive-ui';
import { useMessage } from 'naive-ui';
import { Icon } from '@vicons/utils';
import {
    EditTwotone,
    LikeTwotone,
    EyeOutlined,
    HeartFilled,
    GlobalOutlined,
    WeiboOutlined,
    GithubFilled,
    DeleteTwotone,
    SearchOutlined
} from '@vicons/antd';
import { Edit } from '@vicons/fa';

//定义路由对象
const router = useRouter();

//定义消息提示对象
const message = useMessage();

//文章数组
const articleArr = ref([]);

//关注列表数组
const fansArr = ref([]);

//控制个签是否可编辑
const isEdit = ref(true);

//获取到输入框
const inputInstRef = ref<InputInst | null>(null);

//是否正在加载
const isLoading = ref(false);

//表示是否还有数据
const noMore = ref(false);

//控制搜索框的宽度
const inputWidth = ref('0px'); // 初始宽度为 0

//搜索框输入的内容
const inputValue = ref('');

//定义当前会员中心人员的各种信息
const user = reactive({
    id: 0,
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

//定义文章的筛选条件
const aticleType = reactive({
    id: user.id,
    type: '文章',
    page: 1,
    limit: 4,
    keyword: ''
});

//定义文章的筛选条件
const fansType = reactive({
    id: user.id,
    page: 1,
    limit: 4,
    keyword: ''
});

onMounted(async () => {
    userInfo();
    articleInit();
    linkInit();
});

//----------------------初始化的一些方法------------------------

//初始化用户数据
const userInfo = async () => {
    const { data } = await getMemberInfo(user.id);
    if (data) {
        Object.assign(user, data);
    }
};

//初始化文章的信息
const articleInit = async () => {
    const { data } = await getArticleInfo(aticleType);
    if (data) {
        articleArr.value = data.dataList;
    }
};

//初始化微博、博客链接
const linkInit = async () => {
    const { data } = await getNumberData(user.id);
    user.blog_link = data.blog_link;
    user.weibo_link = data.weibo_link;
    user.github_link = data.github_link;
};

//初始化关注列表
const fansList = async () => {
    const { data } = await getConcernList(fansType);
    if (data) {
        fansArr.value = data.concernList;
    }
};

//------------------------用户信息编辑模块---------------------

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
    const { code } = await editSignature(user.signature);
    if (code === 2000) {
        message.success('更改个签成功');
    } else {
        message.error('更改个签失败');
    }
};

//关注
const concernFun = async () => {
    user.concern_status = !user.concern_status;
    const { code } = await concernInter(user.id);
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
    router.push(`/settings/${user.id}`);
};

//------------------文章模块------------------------------

//发表文章按钮
const pubicArticle = () => {
    router.push(`/articlerelease/${user.id}`);
};

//切换标签
const tabChange = (value: string) => {
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
            articleArr.value.push(...data.dataList);
            isLoading.value = false;
        }
    }, 1000);
};

//下拉加载关注列表数据
const fansLoadInit = async () => {
    if (isLoading.value) return;
    isLoading.value = true;

    setTimeout(async () => {
        fansType.page++;
        const { data } = await getConcernList(fansType);
        if (data) {
            fansArr.value.push(...data.concernList);
            isLoading.value = false;
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
    const { code } = await deleteArticle(id);
    if (code === 2000) {
        message.success('删除成功');
    } else {
        message.error('s删除失败');
    }
};

//-------------------- 搜索模块 -----------------------
// 鼠标悬停时输入框设置宽度
const expandInput = () => {
    inputWidth.value = '200px';
};

// 鼠标移走时输入框缩回
const shrinkInput = () => {
    inputWidth.value = '0px';
};

//搜索的方法
const searchFun = () => {
    if (aticleType.type !== '') {
        aticleType.keyword = inputValue.value;
        articleInit();
    } else {
        fansType.keyword = inputValue.value;
        fansList();
    }
    inputValue.value = '';
};
</script>
<template>
    <div class="wrap">
        <div class="member-content">
            <div class="left">
                <n-card size="huge" class="information">
                    <div class="left-left">
                        <n-avatar round :size="48" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
                        <n-ellipsis style="max-width: 240px; display: block">{{ user.nickname }}</n-ellipsis>
                        <n-ellipsis style="max-width: 240px; display: block">{{ user.signature }}</n-ellipsis>
                        <n-input
                            ref="inputInstRef"
                            v-model:value="user.signature"
                            placeholder=""
                            :disabled="isEdit"
                            @blur="commitSignature"
                        />
                        <Icon size="16" color="#cbcbcb" @click="edit">
                            <Edit />
                        </Icon>
                    </div>
                    <div class="left-right">
                        <div class="icons">
                            <a :href="user.blog_link">
                                <Icon size="18">
                                    <GlobalOutlined />
                                </Icon>
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
                        <n-button tertiary round type="primary" @click="settinngs">设置</n-button>
                        <n-button tertiary round type="primary" @click="concern" v-if="!user.concern_status">
                            关注
                        </n-button>
                        <n-button tertiary round type="primary" @click="concern" v-else>已关注</n-button>
                    </div>
                </n-card>
                <n-card size="huge" class="article-card">
                    <n-tabs type="line" animated @update:value="tabChange">
                        <template #suffix>
                            <div class="searchModule" @mouseover="expandInput" @mouseleave="shrinkInput">
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
                            <n-infinite-scroll style="height: 600px" :distance="10" @load="loadInit">
                                <Article :item="item" v-for="(item, index) in articleArr" :key="index">
                                    <template #type>
                                        <n-tag class="status">{{ item.status }}</n-tag>
                                    </template>
                                    <template #edit>
                                        <n-tag type="success" class="edit">
                                            <Icon size="21" color="##19a059" @click="editTotal(item.id)">
                                                <Edit />
                                            </Icon>
                                            <Icon size="21" color="##19a059" @click="deleteArticles(item.id)">
                                                <DeleteTwotone />
                                            </Icon>
                                        </n-tag>
                                    </template>
                                </Article>
                            </n-infinite-scroll>
                        </n-tab-pane>
                        <n-tab-pane name="收藏" tab="收藏">
                            <n-infinite-scroll style="height: 600px" :distance="10" @load="loadInit">
                                <Article :item="item" v-for="(item, index) in articleArr" :key="index"></Article>
                            </n-infinite-scroll>
                        </n-tab-pane>
                        <n-tab-pane name="关注" tab="关注">
                            <n-infinite-scroll style="height: 600px" :distance="10" @load="fansLoadInit">
                                <FansInfo :item="item" v-for="(item, index) in fansArr" :key="index"></FansInfo>
                            </n-infinite-scroll>
                        </n-tab-pane>
                    </n-tabs>
                    <div class="loading" v-if="isLoading && !noMore">
                        <span class="videos">
                            <video src="../../assets/images/loading.mp4" autoplay loop muted></video>
                        </span>
                        <span class="text">正在全力加载中...</span>
                    </div>
                    <div v-if="noMore" class="loading">没有更多了 🤪</div>
                </n-card>
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
        padding-top: 20px;

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

                .left-left {
                    width: 80%;

                    .n-avatar {
                        float: left;
                        width: 80px;
                        height: 80px;
                        margin-right: 10px;
                    }

                    .n-input {
                        width: 100px;
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
                        margin-top: 40px;
                        width: 80px;
                    }
                }
            }

            .information :deep(.n-card__content) {
                display: grid;
                grid-template-columns: 5fr 1fr;
            }

            .article-card {
                position: relative;

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

                .status {
                    height: 20px;
                    font-size: 12px;
                }

                .edit {
                    pointer-events: auto;
                    background-color: #daf0e4;
                    position: absolute;
                    right: 50px;
                }

                @include loading;
            }
        }
        .n-card :deep(.n-card__content) {
            padding: 20px 0px 20px 20px;
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
