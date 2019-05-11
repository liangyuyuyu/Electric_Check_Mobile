import React from 'react';
import { connect } from 'dva';
import { NoticeBar, SearchBar, NavBar, Icon, InputItem, WingBlank, Button, WhiteSpace, Flex, Checkbox, TabBar } from "antd-mobile";

import { Namespaces } from '../models/index';

export function LoginComponent({ location, dispatch, login }) {
  console.log("1111::", login.get("phone"), login.get("password"), login.get("agreeChecked"))
  return <div style={{ position: 'fixed', height: '100%', width: '100%' }}>
    <NavBar
      mode="dark"
      rightContent={[
        <Icon key="1" type="ellipsis" />
      ]}
      style={{ height: "8%", fontSize: "16" }}
    >登录</NavBar>

    <WingBlank size={"md"} style={{ height: "92%" }}>

      <div style={{ width: "100%", height: "30%" }}>
        <table style={{ width: "100%", height: "100%" }}>
          <tr>
            <td align={"center"}>
              <img width={"20%"} src={"./src/assets/images/gps_icon.jpg"} style={{ borderRadius: "10px" }} />
            </td>
          </tr>
        </table>
      </div>

      <div style={{ width: "100%", height: "55%" }}>
        <InputItem
          clear
          labelNumber={3}
          // type={"phone"}
          placeholder="请输入手机号"
          value={login.get("phone")}
          onChange={e => dispatch({ type: "login/changeState", data: { phone: e } })}
        >账号:</InputItem>
        <WhiteSpace size={"sm"} />

        <InputItem
          clear
          labelNumber={3}
          type={"password"}
          placeholder="请输入密码"
          value={login.get("password")}
          onChange={e => dispatch({ type: "login/changeState", data: { password: e } })}
        >密码:</InputItem>
        <WhiteSpace size={"lg"} />

        <Checkbox.AgreeItem defaultChecked={true} onChange={e => dispatch({ type: "login/changeState", data: { agreeChecked: e.target.checked } })}>
          我已阅读并同意
        <a style={{ color: "#108ee9" }}
            onClick={e => {
              e.preventDefault();
              this.goTo(`agreement`);
            }}
          > 《用户协议》 </a>
        </Checkbox.AgreeItem>
        <WhiteSpace size={"lg"} />

        <Button type={"primary"} style={{ width: "92%", margin: "0 auto" }}>登录</Button>
      </div>

      <div style={{ height: "15%", textAlign: "center", paddingBottom: "10px" }}>
        <Flex>
          <Flex.Item style={{ textAlign: "right", color: "#108ee9" }} >
            <span>
              找回密码
            </span>
          </Flex.Item>
          <Flex.Item style={{ textAlign: "center", color: "#108ee9" }} >
            <span> | </span>
          </Flex.Item>
          <Flex.Item style={{ textAlign: "left", color: "#108ee9" }} >
            <span>
              注册用户
            </span>
          </Flex.Item>
        </Flex>
      </div>
    </WingBlank>
  </div>
}

function mapStateToProps({ login }) {// 获取state

  return { login };
}

export default connect(mapStateToProps)(LoginComponent);
