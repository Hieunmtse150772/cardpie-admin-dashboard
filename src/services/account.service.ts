import { AxiosResponse } from 'axios';

import axiosClient from './axiosClient';
import AccountsDto from 'src/dtos/accounts.dto';
import activeAccount from 'src/dtos/activeAccount.dto';

const accountServices = {
  getAccounts: (page: number): Promise<AxiosResponse<AccountsDto>> => {
    const url = `/user`;
    return axiosClient.get(url, { params: { page } });
  },
  acctiveAccount: (payload: activeAccount):  Promise<AxiosResponse<AccountsDto>> => {
    const url = `/user/active`;
    return axiosClient.post(url, { params: { payload } });
  },
};


export default accountServices;
