//点赞文章/评论
import { ref } from 'vue';
import { likeComments } from '@/config/apis/comments';
import { useUserStore } from '@/config/store/userStore';
import { debounce } from '@/utils/debounce';
import { useMessage } from 'naive-ui';

export default function (counts: number, likeSta: number) {
    //定义消息提示对象
    const message = useMessage();

    const userInfo = useUserStore();

    // 点赞量
    const likeCounts = ref(counts);

    //点赞状态
    const likeStatus = ref(likeSta);

    //是否是游客模式
    const isTourist = ref(false);

    // 点赞的方法
    const like = async (obj: object) => {
        try {
            if (userInfo.token === '') {
                isTourist.value = true;
            } else {
                isTourist.value = false;
                if (likeStatus.value === 2) {
                    likeStatus.value = 1;
                    const { code } = await likeComments(obj);
                    if (code === 2000) {
                        likeCounts.value += 1;
                        message.success('点赞成功');
                    }
                } else {
                    likeStatus.value = 2;
                    const { code } = await likeComments(obj);
                    if (code === 2000) {
                        likeCounts.value -= 1;
                        message.success('取消点赞成功');
                    }
                }
            }
        } catch (error: any) {
            console.error('Error:', error); // 记录错误信息
            message.error('点赞失败');
        }
    };

    const debouncedLike = debounce(like, 300);
    return { likeCounts, like: debouncedLike, likeStatus, isTourist };
}
