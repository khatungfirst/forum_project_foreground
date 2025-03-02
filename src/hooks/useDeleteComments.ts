import { deleteComments } from '@/config/apis/comments';
import { useMessage } from 'naive-ui';

export default function () {
    //定义消息提示对象
    const message = useMessage();
    console.log(message, '00000');

    const deleteCom = async (id: any) => {
        const commentId = {
            id: id
        };
        try {
            await deleteComments(commentId);
            message.success('删除成功');
        } catch (error: any) {
            console.log(error, 'error');

            message.error('删除失败');
        }
    };
    return { deleteCom };
}
