import React from 'react';

import { List, Badge } from "antd-mobile";

import { api_url } from "../../../functions/index";

export const pinYinAvatarStyle: any = {
    width: "50px",
    height: "50px",
    lineHeight: "50px",
    textAlign: "center",
    borderRadius: '25px',
    backgroundColor: 'rgba(6, 172, 238, 0.952)'
};

export const groupingAvatarStyle: any = {
    width: "50px",
    height: "50px",
    lineHeight: "50px",
    textAlign: "center",
    borderRadius: '25px',
    backgroundColor: 'rgba(8, 151, 233, 0.966)'
};

export const contactBadgeStyle: any = {
    padding: '0 3px',
    backgroundColor: '#fff',
    borderRadius: 2,
    color: '#f19736',
    border: '1px solid #f19736',
};

export function ContactsItemInfo({ item, i, avatar, badge }) {
    return <List.Item
        thumb={<div style={{
            width: "50px",
            height: "50px",
            borderRadius: '10px',
            background: `url(${api_url}/Assert/contact/${avatar}.png) center center /  50px 50px no-repeat`
        }} />}
        extra={<Badge key={i} text={badge} style={contactBadgeStyle} />}
        multipleLine={true}
        style={{ paddingBottom: "10px" }}
    >
        <div style={{ fontSize: "15px" }}>{item.Name}</div>
        <div>
            <a href={`tel:${item.Account}`}>
                <img src={`${api_url}/Assert/contact/tel.png`} width="15px" height="15px" />
            </a>
            <a href={`smsto:${item.Account}`} style={{ marginLeft: "20px" }}>
                <img src={`${api_url}/Assert/contact/sms.png`} width="15px" height="15px" />
            </a>
        </div>
    </List.Item>
}

// 按照联系人姓名首字母排序展示
export function SortContactsInfo({ item, i }) {
    const badge = item.Type === '0' ? '管理员'
        : item.Type === '1' ? '巡检人员'
            : item.Type === '2' ? '维修人员' : '普通用户';

    return <List.Item
        thumb={<div style={pinYinAvatarStyle} >{item.firstLetter}</div>}
        extra={<Badge key={i} text={badge} style={contactBadgeStyle} />}
        multipleLine={true}
        style={{ paddingBottom: "10px" }}
    >
        <div style={{ fontSize: "15px" }}>{item.Name}</div>
        <div>
            <a href={`tel:${item.Account}`}>
                <img src={`${api_url}/Assert/contact/tel.png`} width="15px" height="15px" />
            </a>
            <a href={`smsto:${item.Account}`} style={{ marginLeft: "20px" }}>
                <img src={`${api_url}/Assert/contact/sms.png`} width="15px" height="15px" />
            </a>
        </div>
    </List.Item>
}