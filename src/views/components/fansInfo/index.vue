<script setup lang="ts">
// import { ref } from 'vue';
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
import { concernInter } from '@/config/apis/articleDetail';
import { useMessage } from 'naive-ui';

const prop = defineProps({
    item: {
        type: Object as () => {
            id: number;
            head_shot: string;
            nickname: string;
            articles_count: number;
            fans_count: number;
            concern_status: boolean;
        },
        required: true,
        default: () => ({
            id: 0,
            head_shot: '',
            nickname: '',
            articles_count: 0,
            fans_count: 0,
            concern_status: false
        })
    }
});

// 定义 ref
const concernStatus = ref(prop.item.concern_status);

const message = useMessage();

const router = useRouter();

//关注的方法
const concern = async (id) => {
    const { code } = await concernInter(id);
    if (code === 2000) {
        concernStatus.value = !concernStatus.value;
        console.log(concernStatus.value, '*****');

        if (concernStatus.value) {
            message.success('关注成功');
        } else {
            message.success('取消关注成功');
        }
    } else {
        message.error('关注失败');
    }
};

//跳转到关注人的会员中心
const routeMember = (id) => {
    router.push(`/member/${id}`);
};
</script>
<template>
    <div class="fans" @click="routeMember(prop.item.id)">
        <n-avatar round :size="48" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
        <div class="fans-middle">
            <n-ellipsis style="max-width: 240px">
                {{ prop.item.nickname }}
            </n-ellipsis>
            <p>
                <span>文章数：{{ prop.item.articles_count }}</span>
                <span>粉丝数：{{ prop.item.fans_count }}</span>
            </p>
        </div>
        <n-button strong secondary round type="primary" @click="concern(prop.item.id)" v-if="!concernStatus">
            关注
        </n-button>
        <n-button strong secondary round type="primary" @click="concern(prop.item.id)" v-else>已关注</n-button>
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
