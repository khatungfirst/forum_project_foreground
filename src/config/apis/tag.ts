import { $http } from '@/packages/request';
import { $get } from '@/packages/request';

// 标签页获取标签列表
export const getTagList = (params: any): Promise<any> => {
    return $get('/tag/article_count', params);
};

// 对标签进行关注操作
export const Tag_follow = (params: any): Promise<any> => {
    return $http('/tag/fan_count', params);
};

// 初次注册成功选择标签
export const firstTagList = (params: any): Promise<any> => {
    return $get('/tag/get_all_tags', params);
};

// 初次注册用户选择标签
export const chooseTag = (params: any): Promise<any> => {
    return $http('/tag/random_tag', params);
};
