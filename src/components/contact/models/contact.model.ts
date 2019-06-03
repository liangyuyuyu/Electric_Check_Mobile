import pinyin from 'pinyin';

import * as Immutable from "immutable";

import { app } from "../../../functions/index";

import { UsersGetService } from "../service/index";

import { Namespaces as LoginNamespaces } from "../../login/models/index";

import { Namespaces, contactsBubbleSort } from "./common";

app.model({

  namespace: Namespaces.contact,

  state: Immutable.fromJS({
    showLoading: false,
    contacts: null,
    managers: null,
    inspectors: null,
    repairers: null,
    users: null
  }),


  effects: {

    // 获取所有的联系人
    *getContacts({ fail }, { call, select, put }) {
      try {
        yield put({ type: "changeState", data: { showLoading: true } });

        const contacts = yield call(UsersGetService);

        if (contacts) {
          contacts.data.map((item: any, i: number) => {
            contacts.data[i] = {
              firstLetter: pinyin(item.Name.charAt(0), {
                style: pinyin.STYLE_FIRST_LETTER,
                heteronym: false // 不启用多音字模式
              })[0][0].toUpperCase(),
              ...item
            }
          })
        }

        yield put({
          type: "changeState",
          data: {
            contacts: contactsBubbleSort(contacts.data), // 按照联系人姓名的首字母进行排序
          }
        });

      } catch (error) {
        fail!(error.errmsg);
      } finally {
        yield put({ type: "changeState", data: { showLoading: false } });
      }
    },

    // 获取所有的联系人并分组
    *getContactsGrouping({ fail }, { call, put }) {
      try {
        yield put({ type: "changeState", data: { showLoading: true } });

        const contacts = yield call(UsersGetService);

        let managers: any = [], inspectors: any = [], repairers: any = [], users: any = [];
        if (contacts) {
          contacts.data.map((item: any) => {
            if (item.Type === "0") managers.push(item); // 管理人员
            else if (item.Type === "1") inspectors.push(item); // 巡检人员
            else if (item.Type === "2") repairers.push(item); // 维修人员
            else if (item.Type === "3") users.push(item); // 普通用户
          })
        }

        yield put({
          type: "changeState",
          data: {
            managers: managers,
            inspectors: inspectors,
            repairers: repairers,
            users: users
          }
        });

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
