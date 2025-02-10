import { $http } from '@/packages/request';
import { $get } from '@/packages/request';

// 1.标签页获取标签列表
export const getTagList = (params: any): Promise<any> => {
    return $get('/tag/article_count', params);
};

// 2.标签页对标签进行关注操作
export const Tag_follow = (params: any): Promise<any> => {
    return $http('/tag/fan_count', params);
};

// 3.选择标签页的所有标签列表
export const firstTagList = (params: any): Promise<any> => {
    return $get('/tag/get_all_tags', params);
};

// 4.初次注册提交用户选择的标签
export const chooseTag = (params: any): Promise<any> => {
    return $http('/tag/random_tag', params);
};

// 5.标签详情页获取此标签下的文章
export const getArticleByTag = (params: any): Promise<any> => {
    return $get('/article/get_article_by_tag', params);
};
