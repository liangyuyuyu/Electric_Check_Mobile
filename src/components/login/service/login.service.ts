import axios from 'axios';

import { api_url } from "../../../functions/index";

export function LoginHttpService(data: any) {
    let result = { status: 0, statusText: '', data: null, error: '' };

    return axios.get(`${api_url}/GetOneUser?id=${data}`)
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