import React, { Component } from 'react';

import { connect } from 'dva';

import { Toast, NavBar, InputItem, WingBlank, Button, WhiteSpace, Flex, Checkbox, Modal } from "antd-mobile";

import { api_url } from "../../../functions/index";

import { agreementContent, phoneNumberCheck } from "./common";

export class LoginComponent extends Component {
  constructor(props) {
    super(props);
  }

  renderAgreementModalContent() {
    return <p>
      {agreementContent}
    </p>
  }

  // 选择电塔的侧边栏
  renderAgreementModal() {
    return <Modal
      popup // 是否弹窗模式
      visible={state!.get("isRenderAgreementModal")} // 对话框是否可见
      // closable={true} // 是否显示关闭按钮
      maskClosable={true} // 点击蒙层是否允许关闭
      animationType="slide-up" // 可选: 'slide-down / up' / 'fade' / 'slide'
      title={<div style={{ width: "100%", height: "100%", backgroundColor: "#108ee9", color: "#ffffff" }}>
        用户协议
      </div>} // 标题 React.Element
      footer={[
        {
          text: <div>返回</div>,
          onPress: () => dispatch({ type: "login/changeState", data: { isRenderAgreementModal: false } })
        },
        {
          text: <div style={{ backgroundColor: "#108ee9", color: "#ffffff" }}>同意</div>,
          onPress: () => dispatch({
            type: "login/changeState", data: {
              isRenderAgreementModal: false,
              agreeChecked: true
            }
          })
        }
      ]} // 底部内容  Array {text, onPress}
      style={{ width: "100%", height: "100%" }}
    >
      {this.renderAgreementModalContent()}
    </Modal >
  }

  render() {
    return <div style={{ position: 'fixed', height: '100%', width: '100%' }}>
      <NavBar mode="dark" style={{ height: "8%" }} >登录</NavBar>

      <WingBlank size={"md"} style={{ height: "92%" }}>

        <div style={{ width: "100%", height: "30%", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img width={"100px"} src={`${api_url}/Assert/login/electic_icon.png`} style={{ borderRadius: "10px" }} />
        </div>

        <div style={{ width: "100%", height: "55%" }}>
          <InputItem
            labelNumber={3}
            type={"number"}
            placeholder="请输入手机号"
            value={state!.get("phone")}
            onChange={e => dispatch({ type: "login/changeState", data: { phone: e } })}
          >账号:</InputItem>
          <WhiteSpace size={"sm"} />

          <InputItem
            labelNumber={3}
            type={"password"}
            placeholder="请输入密码"
            value={state!.get("password")}
            onChange={e => dispatch({ type: "login/changeState", data: { password: e } })}
          >密码:</InputItem>
          <WhiteSpace size={"lg"} />

          <Checkbox.AgreeItem checked={state!.get("agreeChecked")}
            onChange={e => dispatch({
              type: "login/changeState",
              data: { agreeChecked: e.target.checked }
            })}>
            我已阅读并同意
            <span style={{ color: "#108ee9" }}
              onClick={e => {
                e.preventDefault();
                dispatch({ type: "login/changeState", data: { isRenderAgreementModal: true } });
              }}
            > 《用户协议》 </span>
          </Checkbox.AgreeItem>

          <WhiteSpace size={"lg"} />

          <Button type={"primary"} style={{ width: "92%", margin: "0 auto", color: "#ffffff" }}
            onClick={this.checkLoginData.bind(this)}>
            登录
          </Button>
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
      {this.renderAgreementModal()}
    </div>
  }

  checkFail(msg: string) {
    Toast.fail(`请${msg}!`, 1);
    return;
  }

  // 检查登录数据是否已填
  checkLoginData() {
    if (!state!.get("agreeChecked")) return this.checkFail("同意用户协议");

    const phone = state!.get("phone");
    if (!phone) return this.checkFail("填写手机号码");
    else if (!phone.match(phoneNumberCheck)) return this.checkFail("输入正确的手机号码");

    if (!state!.get("password")) return this.checkFail("填写登录密码");

    Toast.loading("登录中...");
    dispatch({
      type: "login/loginCheck",
      callback: (state: number, msg?: any) => {
        Toast.hide();
        if (state === 1) { // 登录成功
          Toast.success("登录成功！", 1, () => goBack());
        } else if (state === 2) { // 登录失败
          Toast.offline("账号有误，若有问题请联系管理员", 1);
        } else if (state === 3) { // 登录失败
          Toast.offline("密码错误,请重新输入！", 1);
        } else if (state === 0) { // 登录失败
          console.log(msg);
          Toast.offline("登录失败,请重试！", 1);
        }
      }
    });
  }
}

let dispatch: any;
let state: any;
let goBack: any;
let goTo: any;
let isLoading: any; // 是否正在加载

function mapStateToProps(state: any) {// 获取state
  let login = state.login;
  let loading = state.loading;
  return { login, loading };
}

export const LoginPage = connect(mapStateToProps)((props: any) => {
  dispatch = props.dispatch;
  state = props.login;
  goBack = props.history.goBack;
  goTo = props.history.push;
  isLoading = props.loading.global;

  return <LoginComponent />
});