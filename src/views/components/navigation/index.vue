<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Home from '../../../views/home/index.vue';
import Tag from '../../../views/tag/index.vue';
import { IosSearch } from '@vicons/ionicons4';
import { useUserStore } from '@/config/store/userStore';
import { useMessageStore } from '@/config/store/messageStore';
import { get_latest_message } from '@/config/apis/message';

const router = useRouter();
const activeTab = ref('home');
const keyword = ref(''); // 定义搜索框内容变量
const userStore = useUserStore();
const messageStore = useMessageStore();
const hasNewMessage = ref(false); // 响应式变量，表示是否有新消息

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
    console.log(keyword, 112);

    if (keyword.value) {
        console.log('执行了搜索', keyword.value);
        router.push({ path: '/select', query: { keyword: keyword.value } }); // 路由跳转搜索页
    } else {
        console.log('搜索为空', keyword.value);
    }
};

const handleLogin = () => {
    if (userStore.isLoggedIn) {
        router.push('/profile'); // 跳转到用户资料页
    } else {
        // 执行登录逻辑
    }
};

const handleSelect = (key) => {
    messageStore.clearNewMessage(key);
    showDropdownRef.value = false;
};

onMounted(async () => {
    if (userStore.isLoggedIn) {
        const response = await get_latest_message();
        if (response.code === 2000 && response.data) {
            const type = response.data.type;
            messageStore.handleMessage(response.data);
            hasNewMessage.value = true;
        }
    }
});
</script>

<template>
    <n-config-provider :theme="theme ? theme.value : null">
        <div class="nav-container">
            <div class="nav">
                <img src="" alt="" />
                <span class="title">HelloWorld</span>
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
                <!-- <button @click="changeTheme">切换主题</button> -->
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
                    <!-- <img :src="userStore.userInfo.avatar_path" alt="User Avatar" class="user-avatar" /> -->
                    <n-avatar size="large" round :src="userStore.userInfo.avatar_path" style="margin: 0 20px" />
                </template>
                <template v-else>
                    <n-button @click="handleLogin" class="common-button">登录注册</n-button>
                </template>
            </div>
        </div>
        <div class="content">
            <router-view />
        </div>
    </n-config-provider>
</template>

<style scoped>
.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 15px;
    padding: 0 30px;
}

.nav {
    display: flex;
    align-items: center;
}

.tabs {
    display: flex;
}

.nav-link {
    margin-right: 15px;
    cursor: pointer;
    text-decoration: none;
    color: #101010;
}

.nav-link.active {
    color: #36ad6a;
    font-weight: bold;
}

.title {
    font-size: 24px;
    color: #101010;
    font-weight: bold;
    margin-right: 10px;
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
}

/* 应用内容区的背景颜色 */
.content {
    background-color: #f2f3f5;
    padding: 20px;
}

.icon-xiaoxi {
    font-size: 24px;
    color: #ccc;
    /* margin: 0 13px 0 8px; */
}

/* 新消息红点 */
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

/* 下拉菜单中的红点 */
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
</style>
