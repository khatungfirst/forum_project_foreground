<script setup lang="ts">
import { defineProps } from 'vue';
const prop = defineProps({
    authorInfo: {
        type: Object as () => {
            author_id: number; //当前作者的id
            head: string; //作者头像
            nickname: string; //作者昵称
            signature: string; //作者个签
            author_article: number; //作者文章数
            author_read: number; //作者阅读数
            fans_count: number; //作者粉丝数
            concern_status: boolean; //定义是否关注该作者的状态
        },
        required: true,
        default: () => ({
            author_id: 0, //当前作者的id
            head: '', //作者头像
            nickname: '', //作者昵称
            signature: '', //作者个签
            author_article: 0, //作者文章数
            author_read: 0, //作者阅读数
            fans_count: 0, //作者粉丝数
            concern_status: false //定义是否关注该作者的状态
        })
    }
});
</script>
<template>
    <div class="top">
        <n-avatar round size="large" :src="prop.authorInfo.head" />
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
</template>
<style scoped lang="scss">
@import '@/assets/styles/mixin.scss';
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
