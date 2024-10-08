import { $http } from '@/packages/request';
import { $get } from '@/packages/request';
// 展示评论消息
export const comment_message = (params: any): Promise<any> => {
    return $get('/message/comment', params);
};

// 对评论消息进行点赞操作
export const like_comment_message = (params: any): Promise<any> => {
    return $http('/comment/praise', params);
};
