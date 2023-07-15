import { AxiosResponse } from 'axios';

import axiosClient from './axiosClient';
import AccountsDto from 'src/dtos/accounts.dto';
import activeAccount from 'src/dtos/activeAccount.dto';
import filterAccount from 'src/dtos/filterAccount.dto';

const accountServices = {
  getAccounts: (params: filterAccount): Promise<AxiosResponse<AccountsDto>> => {
    const url = `/user`;
    return axiosClient.get(url, { params });
  },
  acctiveAccount: (params: activeAccount): Promise<AxiosResponse<AccountsDto>> => {
    const url = `/user/active`;
    return axiosClient.post(url, params );
  },
};


export default accountServices;
