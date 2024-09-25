import { $get } from '@/packages/request';
import { $post } from '@/packages/request';

//获取私信设置的初始状态
export const getLetterStatus = (params: any): Promise<any> => {
    return $get(`/user/private_settings/${params}`);
};

//更改私信设置的状态
export const changeLetterStatus = (params: any): Promise<any> => {
    return $post('/user/private_settings', params);
};

///获取到账号管理的各项数据
export const getNumberData = (params: any): Promise<any> => {
    return $get(`/user/account_settings/${params}`);
};

//改变账号管理的数据
export const changeNumberData = (params: any): Promise<any> => {
    return $post('/user/account_settings', params);
};

//获取到个人资料的数据
export const getUserInfo = (params: any): Promise<any> => {
    return $get(`/user/form_personal_data/${params}`);
};

//更新个人资料
export const changeUserInfo = (params: any): Promise<any> => {
    return $post('/user/form_personal_data', params);
};
