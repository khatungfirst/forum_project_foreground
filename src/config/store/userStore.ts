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
            // 将 token 存储到 LocalStorage
            localStorage.setItem('token', token);
        },
        getToken() {
            return this.token || localStorage.getItem('token');
        },
        setUserInfo(userinfo: any) {
            console.log(userinfo); // 打印 userinfo 对象
            this.userInfo = userinfo;
            // 同时将用户 ID 存储到 LocalStorage
            localStorage.setItem('userId', userinfo.id);
        },
        clear() {
            this.token = '';
            this.userInfo = null;
            // 清除 LocalStorage 中的 token
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
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
