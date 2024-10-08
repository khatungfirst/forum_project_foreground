<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Home from '../../../views/home/index.vue';
import Tag from '../../../views/tag/index.vue';

const router = useRouter();
const activeTab = ref('home');

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
</script>

<template>
    <n-config-provider :theme="theme ? theme.value : null">
        <div class="nav-container">
            <div class="nav">
                <img src="../../public/static/img/favicon.ico" alt="" />
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
                <n-input v-model="keyword" placeholder="搜一搜..." class="search-input"></n-input>
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
    padding-left: 24px;
    font-size: 16px;
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
