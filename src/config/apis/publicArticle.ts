import { $get, $http } from '@/packages/request';
//获取文章类型和标签下拉框中的数据
export const getTypeTag = (): Promise<any> => {
    return $get('/article/edit');
};

//获取图片的url链接
export const getImageUrl = (params: any): Promise<any> => {
    return $http('/produce_image_url', params);
};

//获取压缩后的图片
export const getCompressImage = (params: any): Promise<any> => {
    return $get('/instantly_compress_image', params);
};

//发布文章
export const publicArticles = (params: any): Promise<any> => {
    return $http('/article/publish', params);
};
