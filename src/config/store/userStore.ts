// stores/userStore.ts
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        token: '',
        userInfo: null,
        isLogin: false
    }),
    getters: {
        isLoggedIn: (state) => state.isLogin
    },
    actions: {
        setToken(token: string) {
            this.token = token;
            // 可以选择将 token 存储到 LocalStorage
            localStorage.setItem('token', token);
        },
        getToken() {
            return this.token || localStorage.getItem('token');
        },
        setUserInfo(userInfo: any) {
            this.userInfo = userInfo;
        },
        clear() {
            this.token = '';
            this.userInfo = null;
            // 清除 LocalStorage 中的 token
            localStorage.removeItem('token');
        },
        login(userInfo: any) {
            this.setToken(userInfo.token);
            this.setUserInfo(userInfo);
            this.isLogin = true;
        },
        logout() {
            this.clear();
            this.isLogin = false;
        }
    }
});
