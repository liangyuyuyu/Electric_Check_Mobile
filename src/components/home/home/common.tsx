import React from 'react';

import { NavBar, TabBar, Icon } from "antd-mobile";

import { api_url } from "../../../functions/index";

export function Title({ title, showLoading }) {
    return <>
        <NavBar
            mode="dark"
            leftContent={<Icon key="1" type="ellipsis" />}
            onLeftClick={() => console.log("点击了左边")}
            rightContent={<img src={`${api_url}/Assert/home/refresh.png`} width='22px' height='22px' onClick={() => location.reload()} />}
            style={{ height: "7%", fontSize: "15" }}
        >{title} {showLoading ? <Icon type={"loading"} size="xs"/> : <></>}</NavBar>
    </>
}


export function HomeMap(goTo: any) {
    return <TabBar.Item
        title="地图"
        key="home"
        icon={<div style={{
            width: '22px',
            height: '22px',
            background: `url(${api_url}/Assert/home/home1.png) center center /  21px 21px no-repeat`
        }} />}
        selectedIcon={<div style={{
            width: '22px',
            height: '22px',
            background: `url(${api_url}/Assert/home/home2.png) center center /  21px 21px no-repeat`
        }} />}
        // badge={'new'}
        onPress={() => goTo("home")}
    >
    </TabBar.Item>
}

export function Tasks() {
    return <TabBar.Item
        title="任务"
        key="home"
        icon={<div style={{
            width: '22px',
            height: '22px',
            background: `url(${api_url}/Assert/task/task1.png) center center /  21px 21px no-repeat`
        }} />}
        selectedIcon={<div style={{
            width: '22px',
            height: '22px',
            background: `url(${api_url}/Assert/task/task2.png) center center /  21px 21px no-repeat`
        }} />}
        badge={1}
    // onPress={() => dispatch({ type: "home/changeState", data: { tabBarChoice: 2 } })}
    >
    </TabBar.Item>
}

export function Contacts(goTo: any) {
    return <TabBar.Item
        title="联系人"
        key="home"
        icon={<div style={{
            width: '22px',
            height: '22px',
            background: `url(${api_url}/Assert/contact/contact1.png) center center /  21px 21px no-repeat`
        }} />}
        selectedIcon={<div style={{
            width: '22px',
            height: '22px',
            background: `url(${api_url}/Assert/contact/contact2.png) center center /  21px 21px no-repeat`
        }} />}
        badge={1}
        onPress={() => goTo('contact')}
    >
    </TabBar.Item >
}

export function My() {
    return <TabBar.Item
        title="我的"
        key="home"
        icon={<div style={{
            width: '22px',
            height: '22px',
            background: `url(${api_url}/Assert/my/my1.png) center center /  21px 21px no-repeat`
        }} />}
        selectedIcon={<div style={{
            width: '22px',
            height: '22px',
            background: `url(${api_url}/Assert/my/my2.png) center center /  21px 21px no-repeat`
        }} />}
        badge={"new"}
    // onPress={() => dispatch({ type: "home/changeState", data: { tabBarChoice: 4 } })}
    >
        <Title title={"我的"} />
    </TabBar.Item>
}
