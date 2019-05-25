import React, { Component } from 'react';
import { connect } from 'dva';

import { Link } from 'dva/router';

import { TabBar, List, NavBar, Icon, Tabs, Badge, SwipeAction } from "antd-mobile";

import { api_url } from "../../../functions/index";

import { HomeMap, Contacts, My } from '../../home/home/index';

import { TasksType } from '../models/index';

import { tabs, getBadge, getFormatDate, renderNoData } from './common';

export class TaskComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const currentUser = stateLogin!.get("currentUser");
    if (!currentUser) goTo("login")
    else {
      currentUser.Type === "0" ? dispatch({ type: "task/getMyStartTasks" }) // 当前登录者是管理员，则获取管理员发布的任务
        : dispatch({ type: "task/getMyTasks" }); // 当前登录者是巡检或维修，则获取他们负责的任务
    }
  }

  getData() {

  }

  renderTitle() {
    return <>
      <NavBar
        mode="dark"
        rightContent={<img src={`${api_url}/Assert/home/refresh.png`} width='22px' height='22px' onClick={() => location.reload()} />}
        style={{ height: "7%", fontSize: "15" }}
      >任务 {state!.get("showLoading") ? <Icon type={"loading"} size="xs" /> : <></>}</NavBar>
    </>
  }

  renderTabsOneContent(item: any, i: number) {
    const currentUser = stateLogin!.get("currentUser"),
      rigthBtn = [
        {
          text: '详情',
          onPress: () => console.log('cancel'),
          style: { backgroundColor: 'rgb(6, 213, 250)', color: 'white' },
        }
      ];

    currentUser.Type === "0" && rigthBtn.push({ // 当前为管理员的话，可以删除任务
      text: '删除',
      onPress: () => console.log('delete'),
      style: { backgroundColor: 'red', color: 'white' },
    });

    return <SwipeAction
      autoClose
      right={rigthBtn}
      onOpen={() => console.log('global open')}
      onClose={() => console.log('global close')}
    >
      <List.Item
        multipleLine
        wrap
        key={i}
        extra={getBadge(Number(item.State))}
      >
        <div>
          <div style={{ fontSize: "15px" }}>负责人员: {item.ResponsiblePeople}</div>
          <div style={{ fontSize: "15px" }}>电塔数量: {item.Count}</div>
          <div style={{ fontSize: "15px" }}>发布时间: {getFormatDate(new Date(item.CreatedDate))}</div>
          <div style={{ fontSize: "15px" }}>截止时间: {getFormatDate(new Date(item.EndDate))}</div>
          {item.State === "2" &&
            <div style={{ fontSize: "15px" }}>完成时间: {getFormatDate(new Date(item.CompletedDate))}</div>}
          {currentUser.Type === "0" &&
            <div style={{ fontSize: "15px" }}>任务类型: {item.Type === "0" ? "巡检" : "维修"}任务</div>}
        </div>
      </List.Item>
    </SwipeAction>
  }

  renderTabsContent() {
    const currentTab = state!.get("currentTab"),
      myTasks = state!.get("myTasks"),
      myTasksType = state!.get("myTasksType");

    return currentTab === 0 ? myTasks && (myTasks.data.length > 0 ?
      <List>
        {myTasks.data.map((item: any, i: number) => {
          return this.renderTabsOneContent(item, i);
        })}
      </List> : renderNoData())
      : myTasksType && (myTasksType[TasksType[currentTab - 1]].length > 0 ?
        <List>
          {myTasksType[TasksType[currentTab - 1]].map((item: any, i: number) => {
            return this.renderTabsOneContent(item, i);
          })}
        </List> : renderNoData())
  }

  renderTasksContent() {
    const currentUser = stateLogin!.get("currentUser");
    const tabsData = [{ title: <Badge text={'3'}>{currentUser && currentUser.Type === "0" ? "全部发起" : "全部任务"}</Badge> }, ...tabs]

    return <div style={{ width: "100%", height: "93%", overflowY: "auto", overflowX: "hidden" }}>
      <Tabs tabs={tabsData}
        initialPage={0}
        swipeable={false}
        onChange={(tab, index) => dispatch({ type: "task/changeState", data: { currentTab: index } })}
        onTabClick={(tab, index) => dispatch({ type: "task/changeState", data: { currentTab: index } })}
      >
        {this.renderTabsContent()}
      </Tabs>
    </div>
  }

  renderTasks() {
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
      selected={true}
      badge={1}
    >
      {this.renderTitle()}
      {this.renderTasksContent()}
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
        {this.renderTasks()}
        {Contacts(goTo)}
        {My(goTo)}
      </TabBar>
    </div>
  }
}

function mapStateToProps(state: any) {// 获取state
  // console.log(state) // state中有所有命名空间的数据
  let task = state.task;
  let login = state.login;
  let loading = state.loading;
  return { task, login, loading };
}

let dispatch: any;
let state: any;
let stateLogin: any;
let goBack: any;
let goTo: any;
let isLoading: any; // 是否正在加载

export const TaskPage = connect(mapStateToProps)((props: any) => {
  dispatch = props.dispatch;
  state = props.task;
  stateLogin = props.login;
  goBack = props.history.goBack;
  goTo = props.history.push;
  isLoading = props.loading.global;
  // console.log(props) // props中有match、location、contact(命名空间)、history(goBack、push、go...)、dispatch
  return <TaskComponent />
});
