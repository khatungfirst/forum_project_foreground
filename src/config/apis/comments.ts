import { $post, $get, $http } from '@/packages/request';

//1、获取一级评论
export const getFirstOrderComments = (params: any): Promise<any> => {
    return $http('/comment/top_level', params);
};

//2、获取二级评论
export const getSecondOrderComments = (params: any): Promise<any> => {
    return $http('/comment/replies', params);
};

//3、发表评论
export const publicComments = (params: any): Promise<any> => {
    return $http('/comment/create', params);
};

//4、点赞评论
export const likeComments = (params: any): Promise<any> => {
    return $http('/comment/praise', params);
};

//4、删除评论
export const deleteComments = (params: any): Promise<any> => {
    return $http('/comment/delete', params);
};
