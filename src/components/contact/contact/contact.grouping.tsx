import React, { Component } from 'react';
import { connect } from 'dva';

import { List, Accordion, NavBar, Icon } from "antd-mobile";

import { Alert } from "react-bootstrap";

import { api_url } from "../../../functions/index";

import { ContactsItemInfo } from './common';

export class ContactGroupingComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    dispatch({ type: "contact/getContactsGrouping" });
  }

  renderTitle() {
    return <>
      <NavBar
        mode="dark"
        leftContent={<img src={`${api_url}/Assert/contact/left.png`} width='16px' height='16px' onClick={() => goBack()} />}
        rightContent={<img src={`${api_url}/Assert/home/refresh.png`} width='22px' height='22px' onClick={() => location.reload()} />}
        style={{ height: "7%", fontSize: "15" }}
      >联系人分组 {state!.get("showLoading") ? <Icon type={"loading"} size="xs" /> : <></>}</NavBar>
    </>
  }

  renderContacts() {
    const managers = state!.get("managers") || [],
      inspectors = state!.get("inspectors") || [],
      repairers = state!.get("repairers") || [],
      users = state!.get("users") || [];

    return <div style={{ width: "100%", height: "100%" }}>
      {this.renderTitle()}
      <div style={{ width: "100%", height: "93%", overflowY: "auto", overflowX: "hidden" }}>
        <Accordion defaultActiveKey="0">
          <Accordion.Panel header={<div style={{ fontSize: "16px" }}>管理员</div>}>
            <Alert key={1} variant={"primary"}>
              <List>
                {managers.length > 0 && managers.map((item: any, i: number) => {
                  return <ContactsItemInfo item={item} i={i} avatar={item.Sex === '0' ? 'manage_boy' : 'manage_girl'} badge={'管理员'} />;
                })}
              </List>
            </Alert>
          </Accordion.Panel>
          <Accordion.Panel header={<div style={{ fontSize: "16px" }}>巡检人员</div>}>
            <Alert key={1} variant={"success"}>
              <List>
                {inspectors.length > 0 && inspectors.map((item: any, i: number) => {
                  return <ContactsItemInfo item={item} i={i} avatar={item.Sex === '0' ? 'check_boy' : 'check_girl'} badge={'巡检人员'} />;
                })}
              </List>
            </Alert>
          </Accordion.Panel>
          <Accordion.Panel header={<div style={{ fontSize: "16px" }}>维修人员</div>}>
            <Alert key={1} variant={"warning"}>
              <List>
                {repairers.length > 0 && repairers.map((item: any, i: number) => {
                  return <ContactsItemInfo item={item} i={i} avatar={item.Sex === '0' ? 'repair_boy' : 'repair_girl'} badge={'维修人员'} />;
                })}
              </List>
            </Alert>
          </Accordion.Panel>
          <Accordion.Panel header={<div style={{ fontSize: "16px" }}>普通用户</div>}>
            <Alert key={1} variant={"secondary"}>
              <List>
                {users.length > 0 && users.map((item: any, i: number) => {
                  return <ContactsItemInfo item={item} i={i} avatar={item.Sex === '0' ? 'boy' : 'girl'} badge={'普通用户'} />;
                })}
              </List>
            </Alert>
          </Accordion.Panel>
        </Accordion>
      </div>
    </div>
  }


  render() {
    return <div style={{ position: 'fixed', height: '100%', width: '100%', backgroundColor: 'rgba(255, 255, 255)' }}>
      {this.renderContacts()}
    </div>
  }
}

function mapStateToProps(state: any) {// 获取state
  let contact = state.contact;
  let loading = state.loading;
  return { contact, loading };
}

let dispatch: any;
let state: any;
let goBack: any;
let goTo: any;
let isLoading: any; // 是否正在加载

export const ContactGroupingPage = connect(mapStateToProps)((props: any) => {
  dispatch = props.dispatch;
  state = props.contact;
  goBack = props.history.goBack;
  goTo = props.history.push;
  isLoading = props.loading.global;

  return <ContactGroupingComponent />
});
