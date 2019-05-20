import axios from 'axios';

import { api_url } from "../../../functions/index";

export function UsersGetService() {
    let result = { status: 0, statusText: '', data: null, error: '' }
    return axios.get(`${api_url}/GetAllUsers`)
        .then((res) => {
            result.status = res.status;
            result.statusText = res.statusText;
            result.data = res.data;

            return result;
        })
        .catch((error) => {
            result.data = error;

            return result;
        });
}
