import { $get } from '@/packages/request';
import { $post } from '@/packages/request';

//1、获取用户的初始化信息
export const getMemberInfo = (params: any): Promise<any> => {
    return $get('/init_userinfo', params);
};

//2、获取文章或者收藏的对应数据
export const getArticleInfo = (params: any): Promise<any> => {
    return $get('/get_type_data', params);
};

//3、获取对应关注列表的信息
export const getConcernList = (params: any): Promise<any> => {
    return $get('/user/attention', params);
};

//4、编辑个签
export const editSignature = (params: any): Promise<any> => {
    return $post('/edit_signature', params);
};

//5、删除文章
export const deleteArticle = (params: any): Promise<any> => {
    return $post('/article/delete', params);
};
