import { $get } from '@/packages/request';

export const author_rank = (params: any): Promise<any> => {
    return $get('/user/rank', params);
};
