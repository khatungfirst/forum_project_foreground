//点赞文章/评论
import { ref } from 'vue';
import { likeComments } from '@/config/apis/comments';
import { debounce } from '@/utils/debounce';
import { useMessage } from 'naive-ui';

export default function (counts: number, likeSta: number) {
    //定义消息提示对象
    const message = useMessage();

    // 点赞量
    const likeCounts = ref(counts);

    //点赞状态
    const likeStatus = ref(likeSta);

    // 点赞的方法
    const like = async (obj: object) => {
        try {
            await likeComments(obj);
            if (likeStatus.value === 2) {
                likeStatus.value = 1;
                likeCounts.value += 1;
                message.success('点赞成功');
            } else {
                likeStatus.value = 2;
                likeCounts.value -= 1;
                message.success('取消点赞成功');
            }
        } catch (error: any) {
            console.error('Error:', error); // 记录错误信息
            message.error('点赞失败');
        }
    };

    const debouncedLike = debounce(like, 300);
    return { likeCounts, like: debouncedLike, likeStatus };
}
