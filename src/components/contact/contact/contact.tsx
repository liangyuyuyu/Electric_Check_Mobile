import React, { Component } from 'react';
import { connect } from 'dva';

import { TabBar, List, NavBar, Icon } from "antd-mobile";

import { api_url } from "../../../functions/index";

import { Tasks, HomeMap, My } from '../../home/home/index';

import { SortContactsInfo, groupingAvatarStyle } from './common';

export class ContactComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    dispatch({ type: "contact/getContacts" });
  }

  renderTitle() {
    return <>
      <NavBar
        rightContent={<img src={`${api_url}/Assert/home/refresh.png`} width='22px' height='22px' onClick={() => location.reload()} />}
        style={{ height: "7%", fontSize: "15" }}
      >联系人 {state!.get("showLoading") ? <Icon type={"loading"} size="xs"/> : <></>}</NavBar>
    </>
  }

  renderContacts() {
    const contacts = state!.get("contacts") || [];

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
      <div style={{ width: "100%", height: "93%", overflowY: "auto" }}>
        <List>
          <List.Item
            thumb={<div style={groupingAvatarStyle} >组</div>}
            extra={<a style={{ fontSize: "15px" }}>查看</a>}
            multipleLine={true}
            style={{ paddingBottom: "10px", paddingTop: "10px" }}
            onClick={() => goTo('contact/contactGrouping')}
          >
            <div style={{ fontSize: "15px" }}>联系人分组</div>
          </List.Item>
        </List>
        <List>
          {contacts.length > 0 && contacts.map((item: any, i: number) => {
            return <SortContactsInfo item={item} i={i} />;
          })}
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
        {Tasks()}
        {this.renderContacts()}
        {My()}
      </TabBar>
    </div>
  }
}

function mapStateToProps(state: any) {// 获取state
  // console.log(state) // state中有所有命名空间的数据
  let contact = state.contact;
  let loading = state.loading;
  return { contact, loading };
}

let dispatch: any;
let state: any;
let goBack: any;
let goTo: any;
let isLoading: any; // 是否正在加载

// export const HomePage = connect(mapStateToProps)(HomeComponent);

export const ContactPage = connect(mapStateToProps)((props: any) => {
  dispatch = props.dispatch;
  state = props.contact;
  goBack = props.history.goBack;
  goTo = props.history.push;
  isLoading = props.loading.global;
  // console.log(props) // props中有match、location、contact(命名空间)、history(goBack、push、go...)、dispatch
  return <ContactComponent />
});
