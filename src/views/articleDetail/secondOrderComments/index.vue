<script setup lang="ts">
import { useRouter } from 'vue-router';
import useLike from '@/hooks/useLike';
import useDeleteComments from '@/hooks/useDeleteComments';
import commentDrawer from '@/views/components/commentDrawer/index.vue';
import '@/assets/css/icon/iconfont.css';
import { useMessage } from 'naive-ui';

//---------------------------------声明----------------------------------------
const prop = defineProps({
    item: {
        type: Object as () => {
            id: number;
            nickname: string;
            parent_nickname: string;
            create_at: string;
            article_id: number;
            user_id: number;
            highest_id: number;
            parent_id: number;
            content: string;
            likes_count: number;
            path: string;
            parent_path: string;
            comment_path: string;
            status: number;
            parent_user_id: number;
        },
        required: true,
        default: () => ({
            id: 6,
            nickname: '似婷婷',
            parent_nickname: '贲梓妍',
            create_at: '2024-04-08 03:17:07',
            article_id: 1,
            user_id: 53,
            highest_id: 61,
            parent_id: 94,
            content: 'dolore incididunt cillum',
            likes_count: 10,
            path: 'Duis culpa irure aliqua',
            parent_path: 'culpa voluptate irure elit minim',
            comment_path: 'in nostrud labore ea',
            status: 1,
            parent_user_id: 0
        })
    }
});

//发表评论需要的相关属性
const commentItems = reactive({
    article_id: prop.item.article_id,
    user_id: 0, //当前登录
    highest_id: prop.item.highest_id,
    parent_id: prop.item.parent_id,
    parent_user_id: prop.item.parent_id
});

//控制评论框是否显示
const appear = ref(false);

//定义是否显示遮罩层的变量
const isOverlayVisible = ref(false);

///获取中间盒子对象
const boxRef = ref<HTMLElement | null>(null);

//定义一个变量接收中间盒子宽度
const childWidth = ref(0);

const router = useRouter();

const emit = defineEmits(['delete-secComments']);

//定义消息提示对象
const message = useMessage();

//---------------------------------生命周期----------------------------------------

// 监听窗口调整
onMounted(async () => {
    updateChildWidth();
    //监听中间窗口的变化
    window.addEventListener('resize', updateChildWidth);
});

// 移除监听
onBeforeUnmount(() => {
    window.removeEventListener('resize', updateChildWidth);
});

//--------------------------------评论有关方法----------------------------------------

//解构点赞方法
const { likeCounts, like, likeStatus } = useLike(prop.item.likes_count, prop.item.status);

const likeObj = {
    id: 0,
    status: 1,
    user_id: 1
};

//跳转到指定用户会员中心
const jumpMember = (id: number) => {
    router.push(`/member/${id}`);
};

//删除评论
const { deleteCom } = useDeleteComments(prop.item.id);

const deleteFun = () => {
    deleteCom();
    emit('delete-secComments', prop.item.id);
};

//举报评论
const report = () => {
    message.warning('举报功能暂未开发，敬请期待吧！');
};

//------------------------------其他方法------------------------------------------
//获取中间盒子宽度
const updateChildWidth = () => {
    if (boxRef.value) {
        childWidth.value = boxRef.value.clientWidth;
    }
};

//定义遮罩层的点击事件
const handleMaskClick = () => {
    isOverlayVisible.value = false;
    appear.value = false;
};
</script>
<template>
    <div class="comments" ref="boxRef">
        <div v-if="isOverlayVisible" class="overlay" @click="handleMaskClick"></div>
        <n-avatar
            round
            size="large"
            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            @click="jumpMember(1)"
        />
        <div class="comments-detail">
            <n-ellipsis style="max-width: 240px">
                <span class="nickname" @click="jumpMember(1)">{{ prop.item.nickname }}</span>
                <span>回复</span>
                <span class="nickname1" @click="jumpMember(2)">{{ prop.item.parent_nickname }} ：</span>
                <span>再来</span>
            </n-ellipsis>
            <div class="comment-detail">
                <span class="small-detail1">{{ prop.item.create_at }}</span>
                <span
                    class="small-detail"
                    @click="like(likeObj)"
                    :style="{ color: likeStatus === 1 ? '#19A059' : '#8a919f' }"
                >
                    <i class="iconfont">&#xe616;</i>
                    <span v-if="likeCounts === 0">点赞</span>
                    <span v-else>{{ likeCounts }}</span>
                </span>
                <span
                    class="small-detail"
                    @click="
                        appear = !appear;
                        isOverlayVisible = !isOverlayVisible;
                    "
                >
                    <i class="iconfont">&#xe6b3;</i>
                    回复
                </span>
            </div>
        </div>
        <div class="more">
            <n-popconfirm :positive-text="null" :negative-text="null" :show-icon="false">
                <template #trigger>
                    <i class="iconfont">&#xe61e;</i>
                </template>
                <div class="button-container">
                    <n-button text :block="true" @click="deleteFun" style="margin-top: 10px">删除</n-button>
                    <n-button text :block="true" @click="report" style="margin-top: 10px">举报</n-button>
                </div>
            </n-popconfirm>
        </div>
        <commentDrawer
            :appear="appear"
            :childWidth="childWidth"
            :headShot="prop.item.path"
            :item="commentItems"
            @close-comment="handleMaskClick"
        ></commentDrawer>
    </div>
</template>
<style scoped lang="scss">
@import '@/assets/styles/mixin.scss';
.comments {
    width: 100%;
    padding: 20px 0px 20px 20px;
    @include flex;

    @include overlay;

    .n-avatar {
        width: 40px;
    }

    .small-detail:hover,
    .n-avatar:hover {
        cursor: pointer;
    }

    .comments-detail {
        flex: 1;
        padding-left: 20px;

        .comment-detail {
            color: #8a919f;
        }

        .small-detail {
            margin-left: 20px;
        }

        .nickname {
            margin-right: 10px;
        }

        .nickname1 {
            margin-left: 10px;
        }

        .nickname:hover,
        .nickname1:hover {
            cursor: pointer;
            color: #19a059;
        }

        .comment-detail {
            color: #8a919f;
            font-size: 13px;
        }
    }
    .more {
        width: 40px;

        .iconfont:hover {
            cursor: pointer;
        }
    }
}
</style>
