import { AxiosResponse } from 'axios';

import axiosClient from './axiosClient';
import AccountsDto from 'src/dtos/accounts.dto';

const accountServices = {
  getAccounts: (page: number): Promise<AxiosResponse<AccountsDto>> => {
    const url = `/user`;
    return axiosClient.get(url, { params: { page } });
  },
};

export default accountServices;
