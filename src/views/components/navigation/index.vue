<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Home from '../../../views/home/index.vue';
import Tag from '../../../views/tag/index.vue';
// 导入图标库的图标
import { IosSearch } from '@vicons/ionicons4';
const router = useRouter();
const activeTab = ref('home');
const keyword = ref(''); // 定义搜索框内容变量

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
        // 检查搜索框是否有内容
        // router.push(`/select?keyword=${keyword.value}`); // 路由跳转搜索页
        router.push('/select');
        router.push({ path: '/select', query: { keyword: keyword.value } }); // 路由跳转搜索页
    } else {
        console.log('搜索为空', keyword.value);
    }
};
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
                <button @click="changeTheme">切换主题</button>
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
                <n-button @click="handleLogin" class="common-button">登录注册</n-button>
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
</style>
