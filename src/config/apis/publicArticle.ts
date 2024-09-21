import { $get } from '@/packages/request';
import { $post } from '@/packages/request';
//获取文章类型和标签下拉框中的数据
export const getTypeTag = (): Promise<any> => {
    return $get('/article/edit');
};

//获取图片的url链接
export const getImageUrl = (params: any): Promise<any> => {
    return $get('/produce_image_url', params);
};

//发布文章
export const publicArticles = (params: any): Promise<any> => {
    return $post('/article/publish', params);
};
