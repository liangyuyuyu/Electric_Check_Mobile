import axios from 'axios';
import fetchJsonp from 'fetch-jsonp';

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

export function PylonsGetService() {
    let result = { status: 0, statusText: '', data: null, error: '' }
    return axios.get(`${api_url}/GetAllPylons`)
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

    // fetch(`${api_url}/GetAllPylons`, {
    //     method: 'GET'
    // }).then(res =>
    //     res.json() // 解析json数据
    // ).then(data => {
    //     console.log("then 2:", data);
    //     result.data = data;
    // }).catch(e => console.log('接口获取数据出错:', e));

    // fetch(url, {
    //     method: 'POST', // or 'PUT'
    //     body: JSON.stringify(data), // data can be `string` or {object}!
    //     headers: new Headers({
    //       'Content-Type': 'application/json'
    //     })
    //   }).then(res => res.json())
    //   .catch(error => console.error('Error:', error))
    //   .then(response => console.log('Success:', response));

    // const url = "http://118.25.150.24/GetAllPylons";
    // fetch(url, {
    //     method: "GET",
    //     mode: "cors",
    //     headers: {
    //         //"Content-Type": "application/json; charset=utf-8"
    //         'Accept': 'application/json',
    //     }

    // }).then(response => response.json())
    //     .then(result => {
    //         // 在此处写获取数据之后的处理逻辑
    //         console.log(result);
    //     }).catch(function (e) {
    //         //console.log("fetch fail", JSON.stringify(params));
    //     });
}