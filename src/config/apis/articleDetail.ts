import { $get, $post, $http } from '@/packages/request';

// 1、获取初始化的文章、作者、相关推荐的信息
export const getArticleDetail = (params: any): Promise<any> => {
    return $get('/article/detail', params);
};

//2、获取初始化作者的信息
export const getAuthorDetail = (params: any): Promise<any> => {
    return $get('/user/init_userinfo', params);
};

//3、获取初始化评论的数据
//4、点赞
export const likeInter = (params: any): Promise<any> => {
    return $post('/article/like', params);
};
//5、收藏
export const collectionInter = (params: any): Promise<any> => {
    return $http('/article/collection', params);
};
//6、关注
export const concernInter = (params: any): Promise<any> => {
    return $http('/user/click_attention', params);
};
//7、发布评论

//8、文章排行
export const article_rank = (params: any): Promise<any> => {
    return $get('/article/search_box', params);
};

// 9、获取关注的人的文章
export const follower_article = (params: any): Promise<any> => {
    return $get('/message/follow', params);
};
