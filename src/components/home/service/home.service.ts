import axios from 'axios';
// import fetchJsonp from 'fetch-jsonp';

import { api_url } from "../../../functions/index";

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
            result.error = error;

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

// 获取一个电塔的信息
export function GetOnePylonService(Number: any) {
    let result = { status: 0, statusText: '', data: null, error: '' }
    return axios.get(`${api_url}/GetOnePylon?id=${Number}`)
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

export function PylonsPostService(data: any) {
    let result = { status: 0, statusText: '', data: null, error: '' }
    return axios.post(`${api_url}/PostPylon`, data)
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

// 添加电塔表单获取巡检、维修负责人
export function GetUserByTypeService(Type: any) {
    let result = { status: 0, statusText: '', data: null, error: '' }
    return axios.get(`${api_url}/GetUserByType?Type=${Type}`)
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

// 根据电塔的编号获取问题信息
export function GetProblemByPylonNumberService(PylonNumber: any) {
    let result = { status: 0, statusText: '', data: null, error: '' }
    return axios.get(`${api_url}/GetProblemByPylonNumber?PylonNumber=${PylonNumber}`)
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

export function PylonsDeleteService(data: any) {
    let result = { status: 0, statusText: '', data: null, error: '' }
    return axios.delete(`${api_url}/DeletePylon?id=${data}`)
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

// 添加巡检、维修任务
export function TasksPostService(data: any) {
    let result = { status: 0, statusText: '', data: null, error: '' }
    return axios.post(`${api_url}/PostTask`, data)
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

// 改变多个电塔的状态
export function ChangePylonsStateService(Numbers: any, States: any, ResponsiblePeople: any) {
    let result = { status: 0, statusText: '', data: null, error: '' }
    return axios.post(`${api_url}/ChangePylonsState?Numbers=${Numbers}&States=${States}&ResponsiblePeople=${ResponsiblePeople}`)
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

// 上传图片
export function UploadPylonPictures(Number: any, Pictures: any) {
    let result = { status: 0, statusText: '', data: null, error: '' }

    let formData = new FormData();
    for (var i = 0; i < Pictures.length; i++) {
        formData.append('files[]', Pictures[i].file);
    }

    let config = {
        headers: {
            'Content-Type': 'multipart/form-data'  //之前说的以表单传数据的格式来传递fromdata
        },
        onUploadProgress: function (e: any) {
            var percentage = Math.round((e.loaded * 100) / e.total) || 0;
            if (percentage < 100) {
                console.log(percentage + '%');  // 上传进度
            }
        }
    };

    return axios.post(`${api_url}/UploadPylonPictures?Number=${Number}`, formData, config)
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

// 添加工人
export function WorkerPostService(data: any) {
    let result = { status: 0, statusText: '', data: null, error: '' }
    return axios.post(`${api_url}/PostUser`, data)
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