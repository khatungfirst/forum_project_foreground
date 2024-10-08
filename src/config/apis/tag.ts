import { $http } from '@/packages/request';
import { $get } from '@/packages/request';

export const getTagList = (params: any): Promise<any> => {
    return $get('/tag/article_count', params);
};

export const Tag_follow = (params: any): Promise<any> => {
    return $http('/tag/fan_count', params);
};
