import { AxiosResponse } from 'axios';

import axiosClient from './axiosClient';
import DashBoardDto from 'src/dtos/dashboard.dto';

const dashboardService = {
  getInformation: (): Promise<AxiosResponse<DashBoardDto>> => {
    const url = `/dashboard`;
    return axiosClient.get(url);
  }
};


export default dashboardService;
