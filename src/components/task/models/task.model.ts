import { app } from "../../../functions/index";

import { MyTasksGetService, MyStartTasksGetService } from "../service/index";

import { Namespaces as LoginNamespaces } from "../../login/models/index";

import { Namespaces, TasksType, tasksDataHandle } from "./common";

import * as Immutable from "immutable";


app.model({

  namespace: Namespaces.task,

  state: Immutable.fromJS({
    showLoading: false,
    myTasks: null,
    myTasksType: null,
    currentTab: 0, // 当前被选中的tab
  }),


  effects: {
    *getMyTasks({ fail }, { call, put, select }) { // 获取我的所有任务信息
      try {
        yield put({ type: "changeState", data: { showLoading: true } });

        const { login } = yield select(state => ({ login: state[LoginNamespaces.login].toJS() }));

        const myTasks = yield call(MyTasksGetService, login.currentUser.Name);

        yield put({ type: "changeState", data: { myTasks: myTasks, myTasksType: tasksDataHandle(myTasks) } });

      } catch (error) {
        fail!(error.errmsg);
      } finally {
        yield put({ type: "changeState", data: { showLoading: false } });
      }
    },

    *getMyStartTasks({ fail }, { call, put, select }) { // 获取我的所有任务信息
      try {
        yield put({ type: "changeState", data: { showLoading: true } });

        const { login } = yield select(state => ({ login: state[LoginNamespaces.login].toJS() }));

        const myStartTasks = yield call(MyStartTasksGetService, login.currentUser.Account);

        yield put({ type: "changeState", data: { myTasks: myStartTasks, myTasksType: tasksDataHandle(myStartTasks) } });

      } catch (error) {
        fail!(error.errmsg);
      } finally {
        yield put({ type: "changeState", data: { showLoading: false } });
      }
    }
  },

  reducers: {
    changeState(state, { data }) {

      return state.merge(data);
    }
  }

});
