import axios from 'axios';

import { api_url } from "../../../functions/index";

// 获取我负责的所有任务的所有任务
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

// 获取当前被点击的任务信息
export function GetCurrentTaskInfoService(id: any) {
    let result = { status: 0, statusText: '', data: null, error: '' }
    return axios.get(`${api_url}/GetTaskByID?id=${id}`)
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

// 获取我的所有任务
export function GetProblemDetailService(problemNumber: any) {
    let result = { status: 0, statusText: '', data: null, error: '' }

    return axios.get(`${api_url}/GetOneProblem?id=${problemNumber}`)
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

// 删除一个任务
export function DeleteOneTaskService(data: any) {
    let result = { status: 0, statusText: '', data: null, error: '' }
    return axios.delete(`${api_url}/DeleteTask?id=${data}`)
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

// 删除一个任务后，若该任务有提出问题，则也需要删除问题
// 只有在删除巡检任务的时候，才能删除问题表中的数据
export function DeleteProblemsService(data: any) {
    let result = { status: 0, statusText: '', data: null, error: '' }
    return axios.delete(`${api_url}/DeleteProblemByTaskProblemNumber?TaskProblemNumber=${data}`)
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

// 修改任务进度和状态
export function ChangeTaskProgressState(Number: any, Progress: any, State: any) {
    let result = { status: 0, statusText: '', data: null, error: '' }
    return axios.post(`${api_url}/ChangeTaskProgressState?Number=${Number}&Progress=${Progress}&State=${State}`)
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

// 修改任务进度和状态
export function ChangePylonStateResponsiblePeople(Number: any, State: any, ResponsiblePeople: any) {
    let result = { status: 0, statusText: '', data: null, error: '' }
    return axios.post(`${api_url}/ChangePylonState?Number=${Number}&State=${State}&ResponsiblePeople=${ResponsiblePeople}`)
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

// 修改任务报告和状态
export function ChangeTaskReportStateService(Number: any, TaskReport: any, State: any) {
    let result = { status: 0, statusText: '', data: null, error: '' }
    return axios.post(`${api_url}/ChangeTaskReportState?Number=${Number}&Report=${TaskReport}&State=${State}`)
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

// 修改任务记录
export function ChangeTaskRecordService(Number: any, Record: any) {
    let result = { status: 0, statusText: '', data: null, error: '' }
    return axios.post(`${api_url}/ChangeTaskRecord?Number=${Number}&Record=${Record}`)
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

// 提交任务节点的问题表单
export function ProblemsPostService(data: any) {
    let result = { status: 0, statusText: '', data: null, error: '' }

    return axios.post(`${api_url}/PostProblem`, data)
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

// 提交任务节点的问题表单时，改变任务表中的问题编号列
export function ChangeTaskProblemNumberService(Number: any, ProblemNumber: any) {
    let result = { status: 0, statusText: '', data: null, error: '' }

    return axios.post(`${api_url}/ChangeTaskProblemNumber?Number=${Number}&ProblemNumber=${ProblemNumber}`)
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

// 修改问题表单
export function ChangeProblemInfoService(Number: any, Describle: any, Pictures: any, State: any) {
    let result = { status: 0, statusText: '', data: null, error: '' }

    return axios.post(`${api_url}/ChangeProblemInfo?Number=${Number}&Describle=${Describle}&Pictures=${Pictures}&State=${State}`)
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

// 维修人员点击完成任务按钮时，修改问题表单的状态
export function ChangeProblemsStateService(TaskProblemNumber: any) {
    let result = { status: 0, statusText: '', data: null, error: '' }

    return axios.post(`${api_url}/ChangeProblemsState?TaskProblemNumber=${TaskProblemNumber}`)
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
