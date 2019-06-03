import React, { Component } from 'react';
import { connect } from 'dva';

import { TabBar, List, Button, Toast, NoticeBar } from "antd-mobile";

import { api_url } from "../../../functions/index";

import { Tasks, HomeMap, Contacts } from '../../home/home/index';

export class MyComponent extends Component {
    constructor(props) {
        super(props);
    }

    renderTitle() {
        const currentUser = stateLogin!.get("currentUser");

        return <div style={{
            height: "30%",
            width: "100%",
            fontSize: "17px",
            backgroundColor: "#108ee9",
            // display: "flex",
            // alignItems: "center",
            // justifyContent: "center",
            color: "#ffffff"
        }} >
            <table style={{ height: "100%", width: "100%", }}>
                <tr>
                    <td align={"center"}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: "50%",
                            background: `url(${api_url}/Assert/my/${currentUser && currentUser.Sex === "1" ? "girl" : "boy"}.png) center center /  100px 100px no-repeat`
                        }} />
                        <div style={{ marginTop: "6px" }}>{currentUser ? currentUser.Name : "请登录！"}</div>
                    </td>
                </tr>
            </table>
        </div>
    }

    renderMy() {
        const currentUser = stateLogin!.get("currentUser");

        return <TabBar.Item
            title="我的"
            key="my"
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
            selected={true}
            badge={"new"}
        >
            {this.renderTitle()}
            <div style={{ width: "100%", height: "70%", overflowY: "auto" }}>
                <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }} style={{ fontSize: "14px" }}>
                    欢迎使用电力巡检APP，我们将为您提供电力巡检方面最优质的服务，如：巡检、维修任务发布，路线规划、导航、电塔地理位置可视化、任务进度实时跟踪等等，希望您能使用愉快！
                </NoticeBar>
                <List>
                    <List.Item onClick={() => currentUser ? goTo('/task') : Toast.fail("请先登录！", 1)} arrow="horizontal">
                        <div style={{ fontSize: "16px" }}>我的任务</div>
                    </List.Item>
                    <List.Item onClick={() => currentUser ? goTo('/home/0') : Toast.fail("请先登录！", 1)} arrow="horizontal">
                        <div style={{ fontSize: "16px" }}>电塔地图</div>
                    </List.Item>
                    <List.Item onClick={() => currentUser ? goTo('/contact') : Toast.fail("请先登录！", 1)} arrow="horizontal">
                        <div style={{ fontSize: "16px" }}>公司联系人</div>
                    </List.Item>
                    {/* <List.Item onClick={() => currentUser ? console.log("查看个人信息") : Toast.fail("请先登录！", 1)} arrow="horizontal">
                        <div style={{ fontSize: "16px" }}>个人信息</div>
                    </List.Item> */}
                    <List.Item onClick={() => {
                        currentUser ? // 已登录，点击则退出登录
                            dispatch({ type: "login/changeState", data: { currentUser: null } })
                            : goTo("/login/my") // 未登录，点击则进入登录界面
                    }} >
                        <Button type="primary" style={{ fontSize: "16px", color: "#ffffff" }}>{currentUser ? "退出登录" : "登录"}</Button>
                    </List.Item>
                </List>
            </div>
        </TabBar.Item >
    }


    render() {
        return <>
            {this.renderFooter()}
        </>
    }

    renderFooter() {
        return <div style={{ position: 'fixed', height: '100%', width: '100%' }}>
            <TabBar
                unselectedTintColor="#949494"
                tintColor="#33A3F4"
                barTintColor="white"
            >
                {HomeMap(goTo)}
                {Tasks(goTo)}
                {Contacts(goTo)}
                {this.renderMy()}
            </TabBar>
        </div>
    }
}

function mapStateToProps(state: any) {// 获取state
    // console.log(state) // state中有所有命名空间的数据
    let login = state.login;
    let loading = state.loading;
    return { login, loading };
}

let dispatch: any;
let state: any;
let stateLogin: any;
let goBack: any;
let goTo: any;
let isLoading: any; // 是否正在加载


export const MyPage = connect(mapStateToProps)((props: any) => {
    dispatch = props.dispatch;
    stateLogin = props.login;
    goBack = props.history.goBack;
    goTo = props.history.push;
    isLoading = props.loading.global;
    // console.log(props) // props中有match、location、contact(命名空间)、history(goBack、push、go...)、dispatch
    return <MyComponent />
});
