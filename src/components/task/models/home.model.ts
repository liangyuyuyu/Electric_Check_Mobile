import pinyin from 'pinyin';

import { app } from "../../../functions/index";

import { PylonsGetService, UsersGetService } from "../service/index";

import { Namespaces, contactsBubbleSort } from "./common";

import * as Immutable from "immutable";


app.model({

  namespace: Namespaces.home,

  state: Immutable.fromJS({
    tabBarChoice: 1,
    searchKey: "",
    currentAddress: "", // 定位获取的地址
    currentLng: 121.629114, // 定位获取的经度
    currentLat: 31.186431, // 定位获取的纬度
    isShowMapOnClickModal: false, // 点击地图上某个点，是否展现点击点的信息Modal
    mapOnClickLng: 0, // 点击地图上某个点，该点的经度
    mapOnClickLat: 0, // 点击地图上某个点，该点的纬度
    mapOnClickAddress: '', // 点击地图上某个点，该点的地址
    mapOnClickCrosses: '', // 点击地图上某个点，该点的最近的路口
    mapOnClickRoad: '', // 点击地图上某个点，该点的最近的路
    mapOnClickPois: null, // 点击地图上某个点，该点的附近地点
    isShowNavigationChoice: false, // 是否展示导航类型的选择框
    isFirstNavigation: true, // 是否是第一次进入导航，默认导航方式
    selectedNavigationWay: 0, // 被选中的导航方式,0:步行导航，1:骑行导航，2:公交导航，3:驾车导航
    walkingNavigationStepsCount: 0, // 步行导航的步骤数
    isRemoveNavigation: false, // 是否移出导航，退出导航选择界面时为true
    isRenderMapOnClick: 0, // 地图是否可以点击, 0:地图未渲染，1:给地图绑定点击事件，2:解绑地图上的点击事件
    contacts: null,
    managers: null,
    inspectors: null,
    repairers: null,
    users: null
  }),


  effects: {
    *getPylons({ fail }, { call, put, select }) { // 获取所有电塔信息
      try {
        // const { attendance } = yield select(state => ({ attendance: state[Namespaces.home].toJS() }));
        // console.log(attendance)

        const pylons = yield call(PylonsGetService);

        yield put({ type: "changeState", data: { pylons: pylons } });

      } catch (error) {
        fail!(error.errmsg);
      } finally {
      }
    },

    // 获取所有的联系人
    *getContacts({ fail }, { call, put, select }) {
      try {
        const contacts = yield call(UsersGetService);

        let managers: any = [], inspectors: any = [], repairers: any = [], users: any = [];
        if (contacts) {
          contacts.data.map((item: any, i: number) => {
            contacts.data[i] = {
              firstLetter: pinyin(item.Name.charAt(0), {
                style: pinyin.STYLE_FIRST_LETTER,
                heteronym: false // 不启用多音字模式
              })[0][0].toUpperCase(),
              ...item
            }

            if (item.Type === "0") managers.push(item); // 管理人员
            else if (item.Type === "1") inspectors.push(item); // 巡检人员
            else if (item.Type === "2") repairers.push(item); // 维修人员
            else if (item.Type === "3") users.push(item); // 普通用户
          })
        }

        yield put({
          type: "changeState",
          data: {
            contacts: contactsBubbleSort(contacts.data), // 按照联系人姓名的首字母进行排序
            managers: managers,
            inspectors: inspectors,
            repairers: repairers,
            users: users
          }
        });

      } catch (error) {
        fail!(error.errmsg);
      } finally {
      }
    }
  },

  reducers: {
    changeState(state, { data }) {

      console.log(data)
      return state.merge(data);
    }
  }

});
