import { $post } from '@/packages/request';
import { $get } from '@/packages/request';

//1、获取一级评论
export const getFirstOrderComments = (params: any): Promise<any> => {
    return $get('/comment/top_level', params);
};

//2、获取二级评论
export const getSecondOrderComments = (params: any): Promise<any> => {
    return $get('/comment/replies', params);
};

//3、发表评论
export const publicComments = (params: any): Promise<any> => {
    return $post('/comment/create', params);
};

//4、点赞评论
export const likeComments = (params: any): Promise<any> => {
    return $post('/comment/praise', params);
};

//4、删除评论
export const deleteComments = (params: any): Promise<any> => {
    return $post('/comment/delete', params);
};
