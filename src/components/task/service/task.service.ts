import axios from 'axios';

import { api_url } from "../../../functions/index";

// 获取我复制的所有任务的所有任务
export function MyTasksGetService(data: any) {
    let result = { status: 0, statusText: '', data: null, error: '' }
    return axios.get(`${api_url}/GetTaskByUser?userName=${data}`)
        .then((res) => {
            result.status = res.status;
            result.statusText = res.statusText;
            result.data = res.data;

            return result;
        })
        .catch((error) => {
            result.error = error;

            return result;
        });
}

// 获取我的所有任务
export function MyStartTasksGetService(data: any) {
    let result = { status: 0, statusText: '', data: null, error: '' }
    return axios.get(`${api_url}/GetTaskByReleasePersonPhone?ReleasePersonPhone=${data}`)
        .then((res) => {
            result.status = res.status;
            result.statusText = res.statusText;
            result.data = res.data;

            return result;
        })
        .catch((error) => {
            result.error = error;

            return result;
        });
}
