<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Home from '../../../views/home/index.vue';
import Tag from '../../../views/tag/index.vue';
import { IosSearch } from '@vicons/ionicons4';
import { useUserStore } from '@/config/store/userStore';
import { useMessageStore } from '@/config/store/messageStore';
// import { get_latest_message } from '@/config/apis/message';
import authorMessage from '../../../views/articleDetail/authorMessage/index.vue';
import { getAuthorDetail } from '@/config/apis/articleDetail';
// import { eventBus } from '@/utils/eventBus.ts';
import { logout } from '@/config/apis/login';
const router = useRouter();
const activeTab = ref('home');
const keyword = ref(''); // 定义搜索框内容变量
const userStore = useUserStore();
const messageStore = useMessageStore();
const hasNewMessage = ref(false); // 响应式变量，表示是否有新消息

// 定义简洁作者简介是否出现
const isAuthorInfo = ref(false);

// 作者对象
const authorInfo = ref({
    author_id: userStore.userInfo.id, // 当前作者的id
    head: '', // 作者头像
    nickname: '', // 作者昵称
    signature: '', // 作者个签
    author_article: 0, // 作者文章数
    author_read: 0, // 作者阅读数
    fans_count: 0 // 作者粉丝数
});

const showDropdownRef = ref(false);
const options = ref([
    {
        label: '评论',
        key: 'comments'
    },
    {
        label: '点赞',
        key: 'likes'
    },
    {
        label: '收藏',
        key: 'collections'
    },
    {
        label: '粉丝',
        key: 'followers'
    },
    {
        label: '私信',
        key: 'messages',
        disabled: true
    },
    {
        label: '系统',
        key: 'system',
        disabled: true
    }
]);

const handleClick = () => {
    showDropdownRef.value = !showDropdownRef.value;
};

const currentComponent = computed(() => {
    if (router.currentRoute.path === '/home') {
        return Home;
    } else if (router.currentRoute.path === '/tag') {
        return Tag;
    }
    return null;
});

const switchTab = (tabName) => {
    activeTab.value = tabName;
    router.push(`/${tabName}`);
};

const handleFocus = () => {
    keyword.value = ''; // 清空搜索框内容
};

const handleSearch = () => {
    console.log(keyword.value, 112);

    if (keyword.value) {
        console.log('执行了搜索', keyword.value);
        // eventBus.keyword = keyword.value; // 将搜索框的值更新到 eventBus
        router.push({ path: '/select', query: { keyword: keyword.value } }); // 路由跳转搜索页
        userStore.selectInfo = keyword.value;
        // keyword.value = ''; // 清除搜索框内容
    } else {
        console.log('搜索为空', keyword.value);
    }
};

const handleLogin = () => {
    router.push('/login');
};

const handleSelect = (key) => {
    messageStore.clearNewMessage(key);
    showDropdownRef.value = false;
    if (key !== 'system' && key !== 'messages') {
        router.push(`/message`); // 跳转到消息页面，并携带参数
    }
};

const toggleAuthorInfo = () => {
    // router.push(`/member/${userStore.userInfo.id}`);
    isAuthorInfo.value = !isAuthorInfo.value;
};

onMounted(async () => {
    if (userStore.isLoggedIn) {
        await authorInit(); // 调用初始化作者信息的方法
        console.log('userStore.isLoggedIn', userStore.isLoggedIn);
        // const response = await get_latest_message();

        // if (response.code === 2000 && response.data) {
        //     const type = response.data.type;
        //     messageStore.handleMessage(response.data);
        //     hasNewMessage.value = true;
        // }
    }
});

// 作者相关内容的初始化方法
const authorInit = async () => {
    const authorId = {
        author_id: userStore.userInfo.id
    };
    const authorData = await getAuthorDetail(authorId);
    console.log('authorData', authorData);
    if (authorData) {
        const data = authorData.data;
        authorInfo.value.head = data.head_shot;
        authorInfo.value.nickname = data.nickname;
        authorInfo.value.signature = data.signature;
        authorInfo.value.author_article = data.article_count;
        authorInfo.value.author_read = data.reads_count;
        authorInfo.value.concern_status = data.concern_status;
    }
};
const handleSettings = () => {
    router.push('/settings');
};

const handleLogout = async () => {
    await logout();
    userStore.logout();
    router.push('/home');
};

// 监听路由变化
watch(
    () => router.currentRoute.value,
    (newRoute) => {
        if (newRoute.path !== '/select') {
            keyword.value = ''; // 清空搜索框内容
        }
    }
);
</script>

<template>
    <div class="nav-container">
        <div class="nav">
            <img src="" alt="" />
            <span class="title">思悟</span>
            <div class="tabs">
                <router-link
                    to="/home"
                    class="nav-link"
                    :class="{ active: activeTab === 'home' }"
                    @click="switchTab('home')"
                >
                    首页
                </router-link>
                <router-link
                    to="/tag"
                    class="nav-link"
                    :class="{ active: activeTab === 'tag' }"
                    @click="switchTab('tag')"
                >
                    标签
                </router-link>
            </div>
        </div>
        <div class="actions">
            <n-input
                v-model:value="keyword"
                placeholder="搜一搜..."
                class="search-input"
                @focus="handleFocus"
                @keydown.enter="handleSearch"
            >
                <template #prefix>
                    <n-icon :component="IosSearch" />
                </template>
            </n-input>
            <n-dropdown
                trigger="click"
                :show="showDropdown"
                :options="options"
                @select="handleSelect"
                size="large"
                style="width: 75px"
            >
                <n-button @click="handleClick" n-button text style="font-size: 24px">
                    <n-icon><i class="iconfont icon-xiaoxi"></i></n-icon>
                    <span v-if="hasNewMessage" class="new-message-dot"></span>
                </n-button>
            </n-dropdown>

            <template v-if="userStore.isLoggedIn">
                <n-button n-button text>
                    <n-avatar
                        size="large"
                        round
                        :src="userStore.userInfo.avatar_path"
                        style="margin: 0 20px"
                        class="avater"
                        @click="toggleAuthorInfo"
                    />
                </n-button>
                <div class="author-message-card" v-if="isAuthorInfo">
                    <authorMessage :authorInfo="authorInfo">
                        <template #actions>
                            <hr class="article-rank-divider" />
                            <div class="actions-slot">
                                <n-button quaternary @click="handleSettings">
                                    <n-icon>
                                        <i class="iconfont icon-icon02 button_icon" style="font-size: 24px"></i>
                                    </n-icon>
                                    <span class="button_text">设置</span>
                                </n-button>
                                <n-button quaternary @click="handleLogout">
                                    <n-icon><i class="iconfont icon-tuichu button_icon"></i></n-icon>
                                    <span class="button_text">退出</span>
                                </n-button>
                            </div>
                        </template>
                    </authorMessage>
                </div>
            </template>

            <template v-else>
                <n-button @click="handleLogin" class="common-button">登录注册</n-button>
            </template>
        </div>
    </div>
    <div class="content">
        <router-view />
    </div>
</template>

<style scoped lang="scss">
.nav-container {
    display: flex;
    position: fixed; // 固定在页面顶部
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000; // 确保导航栏在最上层
    justify-content: space-between;
    align-items: center;
    padding: 15px 30px;
    background-color: #ffffff;
}

.nav {
    display: flex;
    align-items: center;
    margin-right: 145px;
}

.tabs {
    display: flex;
}

.nav-link {
    margin-right: 20px;
    cursor: pointer;
    text-decoration: none;
    // color: #19a059;
    position: relative; /* 为绿条添加定位 */
}

.nav-link.active {
    color: #36ad6a;
    font-weight: bolder;
}

.nav-link.active::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -10px;
    width: 100%;
    height: 2px; /* 绿条高度 */
    background-color: #36ad6a; /* 绿条颜色 */
}

.title {
    font-size: 24px;
    color: #101010;
    font-weight: bold;
    margin-right: 20px;
    margin-left: 60px;
}

.actions {
    display: flex;
    align-items: center;
}

.search-input {
    margin-right: 10px;
    padding-left: 0px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 25px;
    width: 180px;
    transition: border-color 0.3s, box-shadow 0.3s;
}

.search-input:hover {
    border-color: #36ad6a;
}

.common-button {
    background-color: #c5e2d4 !important;
    color: #19a059;
    border: none;
    padding: 0 20px;
    border-radius: 25px;
    cursor: pointer;
    margin: 0 10px;
}

.content {
    background-color: #f2f3f5;
    // padding: 20px;
}

.icon-xiaoxi {
    font-size: 24px;
    color: #ccc;
    /* margin: 0 13px 0 8px; */
}

.new-message-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: red;
    border-radius: 50%;
    position: relative;
    top: -10px;
    left: 5px;
}

.n-dropdown-menu .n-dropdown-item__content {
    position: relative;
}

.n-dropdown-menu .n-dropdown-item__content::after {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: red;
    border-radius: 50%;
    position: absolute;
    top: 5px;
    right: 10px;
    display: none;
}

.n-dropdown-menu .n-dropdown-item__content.new::after {
    display: block;
}

.avater {
    cursor: pointer;
    width: 45px;
    height: 45px;
}

.author-message-card {
    // display: none;
    position: absolute;
    top: 60px;
    right: -2%;
    transform: translateX(-50%);
    z-index: 1000;
    background-color: white;
    // border: 1px solid #ccc;
    border-radius: 5px;
    padding: 18px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    width: 280px;

    // 当 isAuthorInfo 为 true 时显示
    &[v-if='isAuthorInfo'] {
        display: block;
    }
}

.article-rank-divider {
    width: 100%;
    border: 0;
    height: 1px;
    background-color: #e7dfdf;
    margin: 0 0 12px 0;
}

.actions-slot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 5px;
    width: 100%;

    .n-button {
        margin: 0 5px;
        background-color: #ffffff;
        color: #8a919f;

        &:hover {
            background-color: #e0e0e0;
        }
    }
}
.button_icon {
    font-size: 20px;
}
.button_text {
    margin: 0 14px;
    font-size: 14px;
}
.author-message-card.active {
    display: block; /* 显示卡片 */
}

.author-detail {
    width: 70%;
    // height: 200px;
    background-color: #fff;
    margin-bottom: 20px;
    padding: 10px;

    .bottom {
        display: flex;
        justify-content: space-around;
        .n-button {
            width: 40%;
        }
    }
}
</style>
