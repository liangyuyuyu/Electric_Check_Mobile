import { app } from "../../../functions/index"
import { Namespaces } from "./common"

import * as Immutable from "immutable";


app.model({

  namespace: Namespaces.login,

  state: Immutable.fromJS({
    phone: "",
    password: "",
    agreeChecked: true
  }),
  // {
  //   phone: "",
  //   password: "",
  //   agreeChecked: true
  // },


  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
  },

  reducers: {
    changeState(state, { data }) {

      return state.merge(data);
    }
  },

});
