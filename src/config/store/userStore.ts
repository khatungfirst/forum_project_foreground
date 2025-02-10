// stores/userStore.ts
import { defineStore } from 'pinia';
import { getUserInfo } from '../apis/settings';

export const useUserStore = defineStore('user', {
    state: () => ({
        token: localStorage.getItem('token') || '',
        userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null'),
        isLogin: !!localStorage.getItem('token'),
        selectInfo: ''
    }),
    getters: {
        isLoggedIn: (state) => state.isLogin
    },
    actions: {
        setToken(token: string) {
            this.token = token;
            localStorage.setItem('token', token);
        },
        getToken() {
            return this.token || localStorage.getItem('token');
        },
        setUserInfo(userinfo: any) {
            this.userInfo = userinfo;
            localStorage.setItem('userInfo', JSON.stringify(userinfo));
        },
        getUserInfo() {
            return this.userInfo || JSON.parse(localStorage.getItem('userInfo') || 'null');
        },
        clear() {
            this.token = '';
            this.userInfo = null;
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
        },
        login(userInfo: any) {
            this.setToken(userInfo.token);
            this.setUserInfo(userInfo.userinfo);
            this.isLogin = true;
        },
        logout() {
            this.clear();
            this.isLogin = false;
        },
        init() {
            // 初始化时检查 localStorage 中的 token 和 userInfo
            const token = localStorage.getItem('token');
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
            if (token && userInfo) {
                this.token = token;
                this.userInfo = userInfo;
                this.isLogin = true;
            }
        }
    }
});
