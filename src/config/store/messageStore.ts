// src/stores/messageStore.js
import { defineStore } from 'pinia';
import { useUserStore } from '@/config/store/userStore';
import { EventSourcePolyfill } from 'event-source-polyfill';

export const useMessageStore = defineStore('messageStore', {
    state: () => ({
        messages: [],
        eventSource: null,
        newMessageTypes: {
            like: false,
            comment: false,
            collect: false,
            follow: false
        }
    }),

    // const sseUrl = new URL('');
    // console.log('URL created:', sseUrl.href);

    // if (token) {
    //     sseUrl.searchParams.append('token', token); // 将Token添加到查询参数中
    //     console.log('Token appended to URL:', sseUrl.href);
    // }
    actions: {
        initSSE() {
            // debugger;
            this.closeSSE();
            console.log('initSSE called');
            const userStore = useUserStore();
            const token = userStore.getToken(); // 获取Token
            console.log('Token:', token);

            this.eventSource = new EventSourcePolyfill(import.meta.env.VITE_APP_PROXY_URL + '/message/sse', {
                heartbeatTimeout: 3 * 60 * 1000,
                headers: {
                    Authorization: 'Bearer ' + userStore.getToken(),
                    Accept: 'text/event-stream'
                },
                withCredentials: true
            });
            this.eventSource.onopen = function (e: any) {
                console.log(e, '连接刚打开时触发');
            };
            this.eventSource.onmessage = (event) => {
                try {
                    console.log('收到消息内容是:', event.data);
                    const data = JSON.parse(event.data);
                    this.handleMessage(data);
                } catch (error) {
                    console.error('解析消息失败:', error);
                }
            };
            this.eventSource.onerror = (error) => {
                console.error('SSE 连接出错：', error);
                this.handleSSEError(error);
            };
        },
        closeSSE() {
            if (this.eventSource) {
                this.eventSource.close();
            }
        },
        handleMessage(data) {
            const message = `${data.timestamp}: ${data.message}`;
            this.messages.push(message);

            if (data.type === 'like') {
                this.newMessageTypes.like = true;
            } else if (data.type === 'comment') {
                this.newMessageTypes.comment = true;
            } else if (data.type === 'collect') {
                this.newMessageTypes.collect = true;
            } else if (data.type === 'follow') {
                this.newMessageTypes.follow = true;
            }
        },
        handleSSEError(error) {
            if (this.eventSource) {
                this.eventSource.close();
                this.eventSource = null;
            }
            console.error('SSE连接错误，尝试重新连接...');
            // setTimeout(() => {
            //     this.initSSE();
            // }, 5000); // 5秒后重试
        },
        clearNewMessage(type) {
            this.newMessageTypes[type] = false;
        }
    }
});
