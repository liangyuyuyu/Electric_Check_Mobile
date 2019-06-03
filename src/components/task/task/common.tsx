import React from 'react';

import { Badge } from "antd-mobile";

import { api_url } from "../../../functions/index";

import { TasksTypeBadge, TasksTypeBadgeColor } from "../models/index"

export const tabs = [
    { title: <Badge>未开始</Badge> },
    { title: <Badge>进行中</Badge> },
    { title: <Badge>未报告</Badge> },
    { title: <Badge>已完成</Badge> },
    { title: <Badge>退回中</Badge> },
    { title: <Badge>已超时</Badge> }
];

export function getBadge(type: number) {
    const badgeStyle: any = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "25px",
        width: "55px",
        fontSize: "13px",
        backgroundColor: '#fff',
        borderRadius: 2,
        color: TasksTypeBadgeColor[type],
        border: `1px solid ${TasksTypeBadgeColor[type]}`,
    };

    return <Badge key={type} text={TasksTypeBadge[type]} style={badgeStyle} />
}

export function getFormatDate(date: any) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}


export function renderNoData() {
    return <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%"
    }}>
        <div><img width={"160px"} src={`${api_url}/Assert/task/nodata.png`} /></div>
    </div>
}
