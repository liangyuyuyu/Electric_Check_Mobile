import { app } from "../../../functions/index";

import { PylonsGetService } from "../service/index";

import { Namespaces } from "./common";

import * as Immutable from "immutable";


app.model({

  namespace: Namespaces.home,

  state: Immutable.fromJS({
    showLoading: false,
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
    pylons: null,
    pylonsType: null,
    isRenderPylonsMaker: true, // 是否渲染地图上电塔的标记，第一次渲染完电塔maker以后，赋值为false，避免重复渲染maker
    isShowPylonsModal: false, // 是否展示电塔的信息modal
    isShowPylonInfoModal: false, //是否展示电塔的信息modal框
    currentOnClickPylonLng: 0, // 当前被点击电塔的经度
    currentOnClickPylonLat: 0, // 当前被点击电塔的纬度
    currentOnClickPylonIndex: -1, // 当前被点击电塔在电塔数组的下标

    isShowSideBar: false, // 是否展示SideBar

    isCurrentUserManager: true, // 当前的用户是否是管理员
    isCurrentUserInspector: true, // 当前的用户是否是巡检人员
    isCurrentUserRepairer: true, // 当前的用户是否是维修人员
    isCurrentUserCommon: true, // 当前的用户是否是普通用户

    isShowAssignmentsModal: false, // 是否展示管理员分配任务的框

    isRenderAddPylonModal: false // 是否展示管理员添加电塔的框
  }),


  effects: {
    *getPylons({ fail }, { call, put, select }) { // 获取所有电塔信息
      try {
        yield put({ type: "changeState", data: { showLoading: true } });
        // const { attendance } = yield select(state => ({ attendance: state[Namespaces.home].toJS() }));
        // console.log(attendance)

        const pylons = yield call(PylonsGetService);

        let pylonsType:any = { normal:[], checking:[], repairing:[], dangering1: [], dangering2: [], dangering3: [] };
        pylons && pylons.data && pylons.data.map(item => {
          if(item.State === "0") pylonsType.normal.push(item)
          else if(item.State === "1") pylonsType.checking.push(item)
          else if(item.State === "2") pylonsType.repairing.push(item)
          else if(item.State === "3") pylonsType.dangering1.push(item)
          else if(item.State === "4") pylonsType.dangering2.push(item)
          else if(item.State === "5") pylonsType.dangering3.push(item)
        })

        yield put({ type: "changeState", data: { pylons: pylons, pylonsType: pylonsType } });

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
    },

    init(state) {
      return state;
    }
  }

});
