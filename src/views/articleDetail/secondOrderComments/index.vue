<script setup lang="ts">
import { useRouter } from 'vue-router';
import useLike from '@/hooks/useLike';
import useDeleteComments from '@/hooks/useDeleteComments';
import { Icon } from '@vicons/utils';
import { LikeOutlined, MessageOutlined } from '@vicons/antd';
import { EllipsisH } from '@vicons/fa';

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
            status: 1
        })
    }
});

const router = useRouter();

const emit = defineEmits(['delete-secComments']);

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
</script>
<template>
    <div class="comments">
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
                    <Icon size="20">
                        <LikeOutlined />
                    </Icon>
                    <span v-if="likeCounts === 0">点赞</span>
                    <span v-else>{{ likeCounts }}</span>
                </span>
                <span class="small-detail">
                    <Icon size="18">
                        <MessageOutlined />
                    </Icon>
                    回复
                </span>
            </div>
        </div>
        <div class="more">
            <n-popconfirm :positive-text="null" :negative-text="null" :show-icon="false">
                <template #trigger>
                    <Icon size="18">
                        <EllipsisH />
                    </Icon>
                </template>
                <div class="button-container">
                    <n-button text :block="true" @click="deleteFun">删除</n-button>
                    <n-button text :block="true">举报</n-button>
                </div>
            </n-popconfirm>
        </div>
    </div>
</template>
<style scoped lang="scss">
@import '@/assets/styles/mixin.scss';
.comments {
    width: 100%;
    padding: 20px 0px 20px 20px;
    @include flex;

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
    }
}
</style>
