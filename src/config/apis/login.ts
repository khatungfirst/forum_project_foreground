// login.ts
import { $http } from '@/packages/request';
import { $get } from '@/packages/request';
/**
 * 登录接口
 * @param {string} email 邮箱
 * @param {string} password 密码
 * @returns {Promise} 登录结果
 */
export const login = (params: any): Promise<any> => {
    return $http('/user/login', params);
};

/**
 * 请求发送验证码
 * @param {string} email 邮箱
 * @returns {Promise} 发送验证码的结果
 */
export const verify_code = (params: any): Promise<any> => {
    return $get('/user/req_verify_code', params);
};

/**
 * 注册接口
 * @param {string} email 邮箱
 * @param {string} verify_code 验证码
 * @param {string} password 密码
 * @param {string} re_password 重复密码
 * @returns {Promise} 注册结果
 */
export const register = (params: any): Promise<any> => {
    return $http('/user/register', params);
};
