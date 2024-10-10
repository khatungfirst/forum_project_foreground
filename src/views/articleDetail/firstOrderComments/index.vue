<script setup lang="ts">
import { defineProps, ref } from 'vue';
import useLike from '@/hooks/useLike';
import useDeleteComments from '@/hooks/useDeleteComments';
import SecondOrderComments from '@/views/articleDetail/secondOrderComments/index.vue';
import commentDrawer from '@/views/components/commentDrawer/index.vue';
import { getSecondOrderComments } from '@/config/apis/comments';
import { useMessage } from 'naive-ui';
import { Icon } from '@vicons/utils';
import { LikeOutlined, MessageOutlined, DownOutlined } from '@vicons/antd';
import { EllipsisH } from '@vicons/fa';

//-----------------------------声明-------------------------------------------

const prop = defineProps({
    item: {
        type: Object as () => {
            id: number;
            nickname: string;
            create_at: string;
            article_id: number;
            user_id: number;
            highest_id: number;
            parent_id: number;
            content: string;
            likes_count: number;
            replies_count: number;
            path: string;
            comment_path: string;
            status: number;
            parent_user_id: number;
        },
        required: true,
        default: () => ({
            id: 96,
            nickname: '謇熙瑶',
            create_at: '2024-12-03 06:37:05',
            article_id: 42,
            user_id: 84,
            highest_id: 61,
            parent_id: 21,
            content: 'deserunt anim Excepteur',
            likes_count: 76,
            replies_count: 65,
            path: 'cillum ut sint cupidatat',
            comment_path: 'eiusmod nostrud do',
            status: 1,
            parent_user_id: 0
        })
    }
});

//控制评论框是否显示
const appear = ref(false);

//定义接收二级评论的数组
const commentList = ref([]);

//定义是否显示遮罩层的变量
const isOverlayVisible = ref(false);

///获取中间盒子对象
const boxRef = ref<HTMLElement | null>(null);

//定义一个变量接收中间盒子宽度
const childWidth = ref(0);

const router = useRouter();

//定义消息提示对象
const message = useMessage();

//获取评论需要的相关属性
const commentInfo = reactive({
    highest_id: prop.item.id,
    offset: 1,
    limit: 2,
    user_id: 0
});

const likeObj = {
    id: 0,
    status: 1,
    user_id: 1
};

//发表评论需要的相关属性
const commentItems = reactive({
    article_id: prop.item.article_id,
    user_id: 0, //当前登录
    highest_id: prop.item.highest_id,
    parent_id: prop.item.parent_id,
    parent_user_id: prop.item.parent_id
});
//通过defineEmits编译器宏生成emit方法来进行组件之间通信
const emit = defineEmits(['delete-firComments']);

//-----------------------------生命周期-------------------------------------------

// 监听窗口调整
onMounted(async () => {
    getSecondComments();
    updateChildWidth();
    //监听中间窗口的变化
    window.addEventListener('resize', updateChildWidth);
});

// 移除监听
onBeforeUnmount(() => {
    window.removeEventListener('resize', updateChildWidth);
});
//-----------------------------评论有关方法-------------------------------------------

//初始化二级评论
const getSecondComments = async () => {
    const { data } = await getSecondOrderComments(commentInfo);
    if (data) {
        commentList.value.push(...data.secondCommentsList);
    }
};

//加载更多二级菜单
const moreSecondComments = async () => {
    commentInfo.limit = 5;
    commentInfo.offset = commentInfo.offset + 1;
    getSecondComments();
};

//解构点赞方法
const { likeCounts, like, likeStatus } = useLike(prop.item.likes_count, prop.item.status);

//跳转到指定用户会员中心
const jumpMember = (id: number) => {
    router.push(`/member/${id}`);
};

//解构删除方法
const { deleteCom } = useDeleteComments(prop.item.id);

const deleteFun = () => {
    deleteCom();
    emit('delete-firComments', prop.item.id);
};

//删除二级评论
const deleteSec = (id) => {
    console.log(1111);
    commentList.value = commentList.value.filter((item) => item.id !== id);
};

//举报评论
const report = () => {
    message.warning('举报功能暂未开发，敬请期待吧！');
};

//-----------------------------其他方法-------------------------------------------

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
    <div class="f-comments" ref="boxRef">
        <div v-if="isOverlayVisible" class="overlay" @click="handleMaskClick"></div>
        <n-avatar
            round
            size="large"
            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            @click="jumpMember(1)"
        />
        <div class="avatar-other">
            <div class="first-comment">
                <div class="comments-detail">
                    <n-ellipsis style="max-width: 240px">{{ prop.item.nickname }}</n-ellipsis>
                    <p>{{ prop.item.content }}</p>
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
                        <span
                            class="small-detail"
                            @click="
                                appear = !appear;
                                isOverlayVisible = !isOverlayVisible;
                            "
                        >
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
                            <n-button text :block="true" @click="report">举报</n-button>
                        </div>
                    </n-popconfirm>
                </div>
            </div>
            <div class="second-comment">
                <SecondOrderComments
                    :item="item"
                    v-for="(item, index) in commentList"
                    :key="index"
                    @delete-secComments="deleteSec"
                ></SecondOrderComments>
                <p @click="moreSecondComments">
                    查看更多回复
                    <Icon size="18">
                        <DownOutlined />
                    </Icon>
                </p>
            </div>
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
.f-comments {
    width: 100%;
    padding: 20px;
    display: flex;

    @include overlay;

    .n-avatar {
        width: 40px;
    }

    .n-avatar:hover {
        cursor: pointer;
    }

    .avatar-other {
        width: 100%;
        .first-comment {
            display: flex;
            .comments-detail {
                flex: 1;
                padding-left: 20px;

                .small-detail {
                    margin-left: 20px;
                }

                .small-detail:hover {
                    cursor: pointer;
                }
                .comment-detail {
                    color: #8a919f;
                    font-size: 13px;
                }
            }
            .more {
                width: 40px;
                .button-container {
                    display: flex;
                    flex-direction: column;

                    .n-button {
                        margin-top: 10px; /* 或者其他你想要的样式 */
                    }
                }
            }
        }

        .second-comment {
            p {
                font-size: 14px;
                color: #8a919f;
                text-align: center;
            }

            p:hover {
                cursor: pointer;
            }
        }
    }
}
</style>
