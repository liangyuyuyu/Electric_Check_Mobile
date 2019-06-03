import { app } from "../../../functions/index";

import { Namespaces } from "./common";

import * as Immutable from "immutable";


app.model({

  namespace: Namespaces.my,

  state: Immutable.fromJS({
  }),


  effects: {
    // *loginCheck({ callback }, { call, put, select }) { // 管理员发布任务
    //   try {
    //     const { login } = yield select(state => ({ login: state[Namespaces.login].toJS() }));

    //     const submitResult = yield call(LoginHttpService, login.phone);

    //     if (!submitResult.data) yield call(callback, 2); // 账号不对
    //     else if (submitResult.data.Password !== login.password) yield call(callback, 3); // 密码不对
    //     else {
    //       yield put({ type: "changeState", data: { currentUser: submitResult.data } });
    //       yield call(callback, 1); // 登录成功
    //     }
    //   } catch (error) {
    //     yield call(callback, 0, error);
    //   } finally {
    //   }
    // }
  },

  reducers: {
    changeState(state, { data }) {

      return state.merge(data);
    }
  },

});
