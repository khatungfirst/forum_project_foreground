import { deleteComments } from '@/config/apis/comments';
import { useMessage } from 'naive-ui';

export default function (id: number) {
    //定义消息提示对象
    const message = useMessage();
    const commentId = {
        id: id
    };
    const deleteCom = async () => {
        try {
            await deleteComments(commentId);
            message.success('删除成功');
        } catch (error: any) {
            message.error('点赞失败');
        }
    };
    return { deleteCom };
}
