import { $get } from '@/packages/request';
//获取到相关的搜索结果
export const getSelectArticle = (params: any): Promise<any> => {
    return $get('/article/search_box', params);
};
