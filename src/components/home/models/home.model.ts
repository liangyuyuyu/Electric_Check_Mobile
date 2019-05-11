import { app } from "../../../functions/index";

import { PylonsGetService } from "../service/index";

import { Namespaces } from "./common";

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
    mapOnClickPois: [], // 点击地图上某个点，该点的附近地点
    isShowNavigationChoice: false, // 是否展示导航类型的选择框
    isFirstNavigation: true, // 是否是第一次进入导航，默认导航方式
    selectedNavigationWay: 0, // 被选中的导航方式,0:步行导航，1:骑行导航，2:公交导航，3:驾车导航
    walkingNavigationStepsCount: 0, // 步行导航的步骤数
    isRemoveNavigation: false, // 是否移出导航，退出导航选择界面时为true
    isRenderMapOnClick: 0 // 地图是否可以点击, 0:地图未渲染，1:给地图绑定点击事件，2:解绑地图上的点击事件
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
    }
  },

  reducers: {
    changeState(state, { data }) {

      console.log(data)
      return state.merge(data);
    }
  }

});
