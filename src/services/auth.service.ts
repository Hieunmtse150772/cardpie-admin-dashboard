// AuthService.ts
import { AxiosResponse } from 'axios';

import { Dispatch } from 'redux';
import LoginDto from 'src/dtos/login.dto';
import axiosClient from './axiosClient';
import LoginUser from 'src/dtos/login.user.dto';

export const authService = {
  login: (payload: LoginDto): Promise<AxiosResponse<LoginUser>> => {
    const url = '/auth/sign-in';
    return axiosClient.post(url, { ...payload });
  },
  logout: () => {
    // Xử lý đăng xuất ở đây (nếu cần)
    // Gọi action `logout` để cập nhật trạng thái đăng nhập
  },
};
