import { app } from "../../../functions/index";

import {
  PylonsGetService, PylonsPostService, PylonsDeleteService,
  TasksPostService, ChangePylonsStateService, GetUserByTypeService,
  WorkerPostService, GetOnePylonService, GetProblemByPylonNumberService,
  UploadPylonPictures
} from "../service/index";

import { LoginHttpService } from "../../login/service/index";

import { getFormatDate } from "../../task/task/index";

import { Namespaces as LoginNamespaces } from "../../login/models/index";

import { Namespaces, PylonIconType } from "./common";

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

    isRenderMapAutoComplete: true, // 是否渲染主页面输入地址的自动提示，避免重复渲染

    pylons: null,
    pylonsType: null,
    isRenderPylonsMaker: false, // 是否渲染地图上电塔的标记，第一次渲染完电塔maker以后，赋值为false，避免重复渲染maker
    isShowPylonsModal: false, // 是否展示电塔的信息modal
    isShowPylonInfoModal: false, //是否展示电塔的信息modal框
    currentOnClickPylonLng: 0, // 当前被点击电塔的经度
    currentOnClickPylonLat: 0, // 当前被点击电塔的纬度
    currentOnClickPylonIndex: -1, // 当前被点击电塔在电塔数组的下标

    currentMapShowMarkerType: "all", // 当前地图上显示电塔marker的类型，用于在清理地图marker后，再恢复到之前地图的marker状态

    isShowSideBar: false, // 是否展示SideBar

    isRenderAddPylonModal: false, // 是否展示管理员添加电塔的框

    // 添加电塔表单中的字段
    isRenderPylonAddressAutoComplete: false, // 是否可以渲染地址输入自动提示框，当地址前面的信息填写以后，才渲染
    isShowPylonDevicesModal: false, // 是否展示选择电塔设备的modal
    isChangePylonAddress: true, // 用户第一次输入地址完成后，地址栏变为不可修改，目的是为了避免用户删除地址，因为经纬度是根据地址生成的
    pylonName: "",
    pylonFunctionType: "", // 电塔用途类型
    pylonShapeType: "", // 电塔形状类型
    pylonAddress: "",
    pylonDevices: null, // 被选中的电塔的设备
    pylonLng: "",
    pylonLat: "",
    pylonIntruduce: "",
    pylonProblems: 0, // 电塔的问题数
    pylonState: "0", // 电塔的状态
    pylonPictures: null, // 电塔的图片
    pylonAddDate: "", // 电塔添加日期


    isShowAssignmentsModal: false, // 是否展示管理员分配任务的框
    isShowChoicePylonsSideBar: false, // 是否展示分配任务时，选择电塔的侧边栏
    allResponsiblePeople: null, // 数据库获取的所有巡检、维修负责人
    assignmentType: "0", // 管理员发布任务的类型（巡检0、维修1）
    assignmentRoutes: null, // 管理员发布任务的线路
    assignmentCount: 0, // 管理员发布任务的电塔数
    assignmentIntroduce: null, // 管理员发布任务的介绍
    assignmentResponsiblePeople: null, // 管理员发布任务的负责人
    assignmentEndDate: "", // 管理员发布任务的规定完成时间

    isRenderAddWorkerModal: false, // 是否渲染添加工作人员的表单
    workerPhone: "",
    workerName: "",
    workerAge: "",
    workerType: "",
    workerSex: "0",
    workerAddress: "",
  }),


  effects: {
    *getPylons({ fail }, { call, put }) { // 获取所有电塔信息
      try {
        yield put({ type: "changeState", data: { showLoading: true } });

        const pylons = yield call(PylonsGetService);

        let pylonsType: any = {
          [PylonIconType[0]]: [],
          [PylonIconType[1]]: [],
          [PylonIconType[2]]: [],
          [PylonIconType[3]]: [],
          [PylonIconType[4]]: [],
          [PylonIconType[5]]: []
        },
          pylonName = 0;

        pylons && pylons.data && pylons.data.map(item => {
          const pylonNum = Number(item.Number);
          if (pylonNum > pylonName) pylonName = pylonNum; // 当前电塔的找出最大编号，方便添加电塔的时候用作新电塔的编号

          if (item.State === "0") pylonsType[PylonIconType[0]].push(item);
          else if (item.State === "1") pylonsType[PylonIconType[1]].push(item);
          else if (item.State === "2") pylonsType[PylonIconType[2]].push(item);
          else if (item.State === "3") pylonsType[PylonIconType[3]].push(item);
          else if (item.State === "4") pylonsType[PylonIconType[4]].push(item);
          else if (item.State === "5") pylonsType[PylonIconType[5]].push(item);
        });

        yield put({
          type: "changeState",
          data: {
            pylons: pylons,
            pylonsType: pylonsType,
            pylonName: `${Number(pylonName) + 1}`,
            isRenderPylonsMaker: true
          }
        });

      } catch (error) {
        fail!(error.errmsg);
      } finally {
        yield put({ type: "changeState", data: { showLoading: false } });
      }
    },

    *getOnePylon({ fail, data }, { call, put }) { // 获取一个电塔的信息
      try {
        yield put({ type: "changeState", data: { showLoading: true } });

        const OnePylon = yield call(GetOnePylonService, data.id);
        OnePylon.data = [OnePylon.data];

        yield put({
          type: "changeState",
          data: {
            pylons: OnePylon,
            pylonsType: {
              [PylonIconType[0]]: [],
              [PylonIconType[1]]: [],
              [PylonIconType[2]]: [],
              [PylonIconType[3]]: [],
              [PylonIconType[4]]: [],
              [PylonIconType[5]]: []
            },
            isRenderPylonsMaker: true,
            // isRenderPylonsMaker: true,
            // isRenderMapOnClick: 2,
            // isShowNavigationChoice: true,
            mapOnClickLng: OnePylon.data[0].Lng,
            mapOnClickLat: OnePylon.data[0].Lat
          }
        });

      } catch (error) {
        fail!(error.errmsg);
      } finally {
        yield put({ type: "changeState", data: { showLoading: false } });
      }
    },

    *getUserByType({ callback, Type }, { call, put }) { // 添加电塔表单获取巡检、维修负责人
      try {
        const usersByType = yield call(GetUserByTypeService, Type);

        yield put({ type: "changeState", data: { allResponsiblePeople: usersByType.data } });

        yield call(callback, 1);
      } catch (error) {
        yield call(callback, 0, error);
      } finally {
      }
    },

    *addPylon({ callback }, { call, put, select }) { // 添加电塔
      try {

        const { login } = yield select(state => ({ login: state[LoginNamespaces.login].toJS() }));

        const { home } = yield select(state => ({ home: state[Namespaces.home].toJS() })),
          submitData = {
            Number: home.pylonName,
            Introduce: home.pylonIntruduce,
            Lng: home.pylonLng,
            Lat: home.pylonLat,
            Address: home.pylonAddress,
            Problems: home.pylonProblems,
            State: home.pylonState,
            PylonFunctionType: home.pylonFunctionType,
            PylonShapeType: home.pylonShapeType,
            PylonDevices: home.pylonDevices.join(","),
            // Pictures: home.pylonPictures,
            PylonAddPersonName: login.currentUser.Name,
            PylonAddPersonPhone: login.currentUser.Account,
          };

        // console.log(submitData);

        const submitResult = yield call(PylonsPostService, submitData);

        // 上传图片
        const submitPictureResult = yield call(UploadPylonPictures, home.pylonName, home.pylonPictures);

        console.log(submitPictureResult)

        yield call(callback, 1);
      } catch (error) {
        yield call(callback, 0, error);
      } finally {
      }
    },

    *deletePylon({ callback, data }, { call, put, select }) { // 删除电塔
      try {
        const deleteResult = yield call(PylonsDeleteService, data);

        yield call(callback, 1);
      } catch (error) {
        yield call(callback, 0, error);
      } finally {
      }
    },

    *addAssignment({ callback }, { call, put, select }) { // 管理员发布任务
      try {
        let number = Math.random().toString();

        const { login } = yield select(state => ({ login: state[LoginNamespaces.login].toJS() }));

        const { home } = yield select(state => ({ home: state[Namespaces.home].toJS() }));

        // 发布维修任务之前，查询问题表中关于此次任务中电塔的问题编码，方便在任务表单中显示
        let problemNumber = Array(home.assignmentRoutes.length).fill(""); // 保存查询到的问题编号
        for (let i = 0; i < home.assignmentRoutes.length; i++) {
          const problemsResult = yield call(GetProblemByPylonNumberService, home.assignmentRoutes[i]);

          let problemNumberArray: any = [];
          problemsResult.data.map(item => problemNumberArray.push(item.Number));

          problemNumber[i] = problemNumberArray.join("___");
          console.log(problemsResult)
        }
        console.log(problemNumber, problemNumber.join("---"))

        const assignmentRoutesStr = home.assignmentRoutes.join(","),
          assignmentRoutesLength = home.assignmentRoutes.length,
          assignmentResponsiblePeopleStr = home.assignmentResponsiblePeople.join(","),
          submitData = {
            Number: number.substr(2, number.length),
            Introduce: home.assignmentIntroduce.join("---"),
            Routes: assignmentRoutesStr,
            Count: assignmentRoutesLength,
            Type: home.assignmentType,
            EndDate: getFormatDate(home.assignmentEndDate),
            ResponsiblePeople: assignmentResponsiblePeopleStr,
            Progress: Array(assignmentRoutesLength).fill(0).join(","),
            ReleasePersonName: login.currentUser.Name,
            ReleasePersonPhone: login.currentUser.Account,
            ProblemNumber: problemNumber.join("---"),
          };

        const submitTaskResult = yield call(TasksPostService, submitData);

        const changePylonsStateResult = yield call(ChangePylonsStateService,
          assignmentRoutesStr,
          Array(assignmentRoutesLength).fill(Number(home.assignmentType) + 1).join(","),
          assignmentResponsiblePeopleStr
        );

        yield call(callback, 1);
      } catch (error) {
        yield call(callback, 0, error);
      } finally {
      }
    },

    *addWorker({ callback }, { call, put, select }) { // 管理员添加员工
      try {
        const { login } = yield select(state => ({ login: state[LoginNamespaces.login].toJS() }));

        const { home } = yield select(state => ({ home: state[Namespaces.home].toJS() }));

        // 添加之前先检查该账号是否存在于数据库
        const checkResult = yield call(LoginHttpService, home.workerPhone);

        if (checkResult.data) yield call(callback, 2); // 账号已存在于数据库
        else {
          const submitData = {
            Account: home.workerPhone,
            Name: home.workerName,
            Age: home.workerAge,
            Type: home.workerType,
            Sex: home.workerSex,
            Address: home.workerAddress,
            AddPersonName: login.currentUser.Name,
            AddPersonPhone: login.currentUser.Account
          };

          const submitWorkerResult = yield call(WorkerPostService, submitData);

          yield call(callback, 1);
        }
      } catch (error) {
        yield call(callback, 0, error);
      } finally {
      }
    },
  },

  reducers: {
    changeState(state, { data }) {
      // console.log(data)
      return state.merge(data);
    },

    init(state) {
      return state.merge({
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

        isRenderMapAutoComplete: true, // 是否渲染主页面输入地址的自动提示，避免重复渲染

        pylons: null,
        pylonsType: null,
        isRenderPylonsMaker: false, // 是否渲染地图上电塔的标记，第一次渲染完电塔maker以后，赋值为false，避免重复渲染maker
        isShowPylonsModal: false, // 是否展示电塔的信息modal
        isShowPylonInfoModal: false, //是否展示电塔的信息modal框
        currentOnClickPylonLng: 0, // 当前被点击电塔的经度
        currentOnClickPylonLat: 0, // 当前被点击电塔的纬度
        currentOnClickPylonIndex: -1, // 当前被点击电塔在电塔数组的下标

        currentMapShowMarkerType: "all", // 当前地图上显示电塔marker的类型，用于在清理地图marker后，再恢复到之前地图的marker状态

        isShowSideBar: false, // 是否展示SideBar

        isRenderAddPylonModal: false, // 是否展示管理员添加电塔的框

        // 添加电塔表单中的字段
        isRenderPylonAddressAutoComplete: false, // 是否可以渲染地址输入自动提示框，当地址前面的信息填写以后，才渲染
        isShowPylonDevicesModal: false, // 是否展示选择电塔设备的modal
        isChangePylonAddress: true, // 用户第一次输入地址完成后，地址栏变为不可修改，目的是为了避免用户删除地址，因为经纬度是根据地址生成的
        pylonName: "",
        pylonFunctionType: "", // 电塔用途类型
        pylonShapeType: "", // 电塔形状类型
        pylonAddress: "",
        pylonDevices: null, // 被选中的电塔的设备
        pylonLng: "",
        pylonLat: "",
        pylonIntruduce: "",
        pylonProblems: 0, // 电塔的问题数
        pylonState: "0", // 电塔的状态
        pylonPictures: null, // 电塔的图片
        pylonAddDate: "", // 电塔添加日期


        isShowAssignmentsModal: false, // 是否展示管理员分配任务的框
        isShowChoicePylonsSideBar: false, // 是否展示分配任务时，选择电塔的侧边栏
        allResponsiblePeople: null, // 数据库获取的所有巡检、维修负责人
        assignmentType: "0", // 管理员发布任务的类型（巡检0、维修1）
        assignmentRoutes: null, // 管理员发布任务的线路
        assignmentCount: 0, // 管理员发布任务的电塔数
        assignmentIntroduce: null, // 管理员发布任务的介绍
        assignmentResponsiblePeople: null, // 管理员发布任务的负责人
        assignmentEndDate: "", // 管理员发布任务的规定完成时间

        isRenderAddWorkerModal: false, // 是否渲染添加工作人员的表单
        workerPhone: "",
        workerName: "",
        workerAge: "",
        workerType: "",
        workerSex: "0",
        workerAddress: "",
      });
    }
  }

});
