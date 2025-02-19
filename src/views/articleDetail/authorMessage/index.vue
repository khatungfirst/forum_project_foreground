<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/config/store/userStore';
import { c } from 'naive-ui';

const userStore = useUserStore();
const router = useRouter();
const emit = defineEmits(['close']); // 定义 emit 事件
const prop = defineProps({
    authorInfo: {
        type: Object as () => {
            author_id: number; // 当前作者的id
            head: string; // 作者头像
            nickname: string; // 作者昵称
            signature: string; // 作者个签
            author_article: number; // 作者文章数
            author_read: number; // 作者阅读数
            fans_count: number; // 作者粉丝数
            concern_status: boolean; // 定义是否关注该作者的状态
        },
        required: true,
        default: () => ({
            author_id: 0, // 当前作者的id
            head: '', // 作者头像
            nickname: '', // 作者昵称
            signature: '', // 作者个签
            author_article: 0, // 作者文章数
            author_read: 0, // 作者阅读数
            fans_count: 0, // 作者粉丝数
            concern_status: false // 定义是否关注该作者的状态
        })
    },
    isAuthorInfo: {
        type: Boolean
    },
    check: {
        type: Boolean
    }
});

// 定义一个响应式变量，控制卡片的显示和隐藏

// 定义一个方法，用于关闭卡片
const closeCard = () => {
    console.log('调用');
};
// 监听全局点击事件
const handleClickOutside = (event: MouseEvent) => {
    const cardElement = document.querySelector('.author-card'); // 获取卡片元素

    setTimeout(() => {
        if (!cardElement || !cardElement.contains(event.target as Node)) {
            if (prop.isAuthorInfo == true && prop.check != false) {
                emit('close');
            }
        }
    }, 1000);
};

// 在组件挂载时添加全局点击事件监听
onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

// 在组件卸载前移除全局点击事件监听
onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});

const jumpCenter = (id) => {
    router.push(`/member/${id}`);
    userStore.jumpToMemberCenter = id;
};
</script>
<template>
    <div class="author-card" v-if="prop.isAuthorInfo">
        <div class="top">
            <n-avatar
                round
                size="large"
                :src="prop.authorInfo.head"
                @click="jumpCenter(prop.authorInfo.author_id)"
                style="cursor: pointer"
            />
            <div class="authorName">
                <p class="name">{{ prop.authorInfo.nickname }}</p>
                <p class="tag">{{ prop.authorInfo.signature }}</p>
            </div>
        </div>
        <div class="middle">
            <div class="article">
                <p>{{ prop.authorInfo.author_article }}</p>
                <p class="second">文章</p>
            </div>
            <div class="read">
                <p>{{ prop.authorInfo.author_read }}</p>
                <p class="second">阅读</p>
            </div>
            <div class="fan">
                <p>{{ prop.authorInfo.fans_count }}</p>
                <p class="second">粉丝</p>
            </div>
        </div>
        <!-- 插槽部分 -->
        <slot name="actions"></slot>
    </div>
</template>
<style scoped lang="scss">
@use '@/assets/styles/mixin.scss' as *;
.top {
    padding-left: 15px;
    .n-avatar {
        float: left;
        margin-right: 10px;
    }

    .authorName {
        p {
            @include ellipsis;
        }
        .name {
            font-size: 16px;
        }
        .tag {
            font-size: 12px;
            color: #707070;
        }
    }
}

.middle {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    margin: 15px 0px;
    text-align: center;
    p {
        margin: 5px;
    }

    .second {
        color: #8a919f;
    }
}
</style>
