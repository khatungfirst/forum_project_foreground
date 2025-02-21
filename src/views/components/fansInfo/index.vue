<script setup lang="ts">
import { useRouter } from 'vue-router';
import { concernInter } from '@/config/apis/articleDetail';
import { debounce } from '@/utils/debounce.ts';
import { useUserStore } from '@/config/store/userStore';
import { useMessage } from 'naive-ui';

const prop = defineProps({
    item: {
        type: Object as () => {
            id: number;
            avatar_path: string;
            nickname: string;
            author_articles: number;
            fans_count: number;
            is_followed: number;
        },
        required: true,
        default: () => ({
            id: 0,
            avatar_path: '',
            nickname: '',
            author_articles: 0,
            fans_count: 0,
            is_followed: 0
        })
    }
});

const message = useMessage();

const router = useRouter();

const userInfo = useUserStore();

const concernStatus = ref(prop.item.is_followed);

const loginId = userInfo.userInfo?.id || 0;

//控制关注/取消关注关注的人的按钮加载效果
const followLoadButton = ref(false);

//声明一个变量接收粉丝数
const fansCount = ref(prop.item.fans_count);

//关注的方法
const concernFun = async (id) => {
    followLoadButton.value = true;
    const { code } = await concernInter({
        followed_id: id
    });
    if (code === 2000) {
        if (concernStatus.value) {
            message.success('关注成功');
            fansCount.value++;
        } else {
            message.success('取消关注成功');
        }
        followLoadButton.value = false;
        concernStatus.value = concernStatus.value === 0 ? 1 : 0;
    } else {
        message.error('关注失败');
        followLoadButton.value = false;
    }
};
const concern = debounce(concernFun, 500);

const emit = defineEmits(['jump-memberCenter']);

//跳转到关注人的会员中心
const routeMember = (id) => {
    router.push(`/member/${id}`);
    emit('jump-memberCenter', id);
};
</script>
<template>
    <div class="fans">
        <n-avatar round :size="48" :src="prop.item.avatar_path" @click="routeMember(prop.item.id)" />
        <div class="fans-middle">
            <n-ellipsis style="max-width: 240px" v-html="prop.item.nickname"></n-ellipsis>
            <p>
                <span>文章数：{{ prop.item.author_articles }}</span>
                <span>粉丝数：{{ fansCount }}</span>
            </p>
        </div>
        <n-button
            strong
            secondary
            round
            type="primary"
            @click="concern(prop.item.id)"
            v-if="concernStatus === 0 && prop.item.id !== loginId"
            :loading="followLoadButton"
            icon-placement="right"
        >
            关注
        </n-button>
        <n-button
            strong
            secondary
            round
            type="primary"
            @click="concern(prop.item.id)"
            v-if="concernStatus === 1 && prop.item.id !== loginId"
            :loading="followLoadButton"
            icon-placement="right"
        >
            已关注
        </n-button>
    </div>
</template>
<style scoped lang="scss">
.fans {
    width: 100%;
    padding: 20px;
    display: flex;

    .fans-middle {
        flex: 1;
        padding-left: 15px;

        span {
            font-size: 14px;
            color: rgb(122, 125, 127);
            margin-right: 20px;
        }
    }
}

.fans:hover {
    cursor: pointer;
}
</style>
