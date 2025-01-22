import { $get, $http } from '@/packages/request';

//1、获取用户的初始化信息
export const getMemberInfo = (params: any): Promise<any> => {
    return $get('/user/init_userinfo', params);
};

//2、获取文章或者收藏的对应数据
export const getArticleInfo = (params: any): Promise<any> => {
    return $get('/article/get_type_data', params);
};

//3、获取对应关注列表的id
export const getConcernList = (params: any): Promise<any> => {
    return $get('/user/attention', params);
};

//3-2、获取具体关注人员信息
export const getConcernDetail = (params: any): Promise<any> => {
    return $http('/user/get_basic_information', params);
};

//4、编辑个签
export const editSignature = (params: any): Promise<any> => {
    return $http('/user/edit_signature', params);
};

//5、删除文章
export const deleteArticle = (params: any): Promise<any> => {
    return $get('/article/delete_article', params);
};
