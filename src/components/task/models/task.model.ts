import { app } from "../../../functions/index";

import {
  MyTasksGetService, MyStartTasksGetService, DeleteOneTaskService,
  ChangeTaskProgressState, GetCurrentTaskInfoService, ChangePylonStateResponsiblePeople,
  ChangeTaskReportStateService, ChangeTaskRecordService, ProblemsPostService,
  ChangeTaskProblemNumberService, GetProblemDetailService, ChangeProblemInfoService,
  DeleteProblemsService, ChangeProblemsStateService
} from "../service/index";

import { ChangePylonsStateService } from "../../home/service/index";

import { Namespaces as LoginNamespaces } from "../../login/models/index";

import { Namespaces, tasksDataHandle } from "./common";

import * as Immutable from "immutable";


app.model({

  namespace: Namespaces.task,

  state: Immutable.fromJS({
    showLoading: false,
    myTasks: null,
    myTasksType: null,
    currentTab: 0, // 当前被选中的tab

    isShowAssignmentDetailModal: false, // 是否展示任务详情的Modal
    isShowStepOnClickModal: false, // step被点击的时候展示该操作提示框
    stepOnClickModalBtnState: [0, 0, 0], // 元素1：0为取消，1为完成；元素2：0为开始任务，1为记录；元素3：0为不显示该按钮，1为提出问题
    currentShowTask: null, // 用户点击的某一个任务的所有信息
    currentOnClickStepIndex: 0, // 当前被点击的step的下标
    assignmentIntroduce: null, // 该任务中，每一个电塔的任务介绍
    assignmentProgress: null, // 该任务中，每一个电塔的任务进度，未开始0、进行中1、已完成2、有问题3
    assignmentRoutes: null, // 该任务中，巡检、维修电塔的路线
    assignmentResponsiblePeople: null, // 该任务中的负责人
    assignmentRecord: null, // 该任务中，每一个电塔的信息记录
    assignmentProblemsNumber: null, // 该任务中，每一个电塔的问题编号

    TaskReport: null, // 任务的报告
    TaskPictures: null, // 某一个任务所有电塔都巡检完成时，展示上传图片按钮

    isRenderSubmitProblemsModal: false, // 是否渲染巡检人员提出问题的表单modal
    ProblemIntreduce: "",
    ProblemPictures: null,

    isRenderProblemNumberClickedModal: false, // 任务详情页问题编号被点击，展示该问题的详细信息的modal
    problemDetail: null, // 获取到的用户点击问你编码的问题详情
    changeProblemIntreduce: "",
    changeProblemPictures: null,

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

    *getMyStartTasks({ fail }, { call, put, select }) { // 管理员获取我的所有任务信息
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
    },

    *getProblemDetail({ problemNumber }, { call, put }) { // 获取问题的详细信息
      try {
        yield put({ type: "changeState", data: { showLoading: true } });

        const problemDetail = yield call(GetProblemDetailService, problemNumber);

        yield put({
          type: "changeState",
          data: {
            problemDetail: problemDetail.data,
            changeProblemIntreduce: problemDetail.data.Describle,
            changeProblemPictures: problemDetail.data.Pictures ? problemDetail.data.Pictures.split("---") : null,
            isRenderProblemNumberClickedModal: true
          }
        });
      } catch (error) {
        console.log(error);
      } finally {
        yield put({ type: "changeState", data: { showLoading: false } });
      }
    },

    *startTask({ callback }, { call, put, select }) { // 巡检人员或者维修人员点击了开始任务按钮，则修改任务进度及任务状态
      try {
        yield put({ type: "changeState", data: { showLoading: true } });

        const { task } = yield select(state => ({ task: state[Namespaces.task].toJS() })),
          assignmentProgress = task.assignmentProgress;

        assignmentProgress[task.currentOnClickStepIndex] = "1";

        const startTaskResult = yield call(ChangeTaskProgressState, task.currentShowTask.Number, assignmentProgress.join(","), "1");

        yield put({ type: "getCurrentTaskInfo" });

        yield call(callback, 1); // 开始任务成功
      } catch (error) {
        yield call(callback, 0, error);
      } finally {
        yield put({ type: "changeState", data: { showLoading: false } });
      }
    },

    *completeOneTask({ callback }, { call, put, select }) { // 巡检人员或者维修人员点击了完成任务按钮，则修改该任务的进度
      try {
        yield put({ type: "changeState", data: { showLoading: true } });

        const { task } = yield select(state => ({ task: state[Namespaces.task].toJS() })),
          assignmentProgress = task.assignmentProgress;

        // 判断该step是否为最后一个step，如果为最后一个step，则标记这个任务为未报告
        // 若任务完成了，还需修改任务完成的时间
        const allCompleteState = (assignmentProgress.length - 1) === task.currentOnClickStepIndex ? "2" : "1";

        // 判断点击完成任务按钮之前，对该节点提出的问题数，3个问题之内的为一级危险，3-6个问题为二级危险，6个以上为3级危险
        // 此判断只针对巡检人员，维修人员完成任务电塔状态直接标记为正常、进度直接标记为已完成
        const currentProblemsNumber = task.assignmentProblemsNumber[task.currentOnClickStepIndex];
        let progressState = "2", // 默认修改为已完成
          pylonState = "0"; // 默认修改为正常

        console.log(currentProblemsNumber)
        if (task.currentShowTask.Type === "0" && currentProblemsNumber) { // 有提出问题，且是巡检任务，则判断问题的个数
          const problemCount = currentProblemsNumber.split("___").length;

          progressState = "3"; // 修改为有问题
          if (problemCount <= 3) {
            pylonState = "3"; // 一级危险
          } else if (problemCount > 3 && problemCount <= 6) {
            pylonState = "4"; // 二级危险
          } else if (problemCount > 6) {
            pylonState = "5"; // 三级危险
          }
        }

        assignmentProgress[task.currentOnClickStepIndex] = progressState;

        // 修改任务进度、状态
        const changeTaskProgressStateResult = yield call(ChangeTaskProgressState, task.currentShowTask.Number, assignmentProgress.join(","), allCompleteState);

        // 每完成一个任务节点，都要修改一下该节点对应的电塔为正常、异常
        const changePylonInfoResult = yield call(ChangePylonStateResponsiblePeople, task.assignmentRoutes[task.currentOnClickStepIndex], pylonState, "null");

        // 如果当前任务为维修任务，完成任务时，还需修改该节点的问题为已解决
        const changeProblemsStateResult = yield call(ChangeProblemsStateService, currentProblemsNumber);

        // 获取修改后的信息，刷新界面
        yield put({ type: "getCurrentTaskInfo" });

        yield call(callback, 1); // 标记完成成功
      } catch (error) {
        yield call(callback, 0, error);
      } finally {
        yield put({ type: "changeState", data: { showLoading: false } });
      }
    },

    *getCurrentTaskInfo({ callback }, { call, put, select }) { // 获取当前被点击任务的信息
      try {
        yield put({ type: "changeState", data: { showLoading: true } });

        const { task } = yield select(state => ({ task: state[Namespaces.task].toJS() }));

        const currentTaskInfo = yield call(GetCurrentTaskInfoService, task.currentShowTask.Number);

        let array = Array(Number(currentTaskInfo.data.Count)).fill("");
        yield put({
          type: "changeState",
          data: {
            currentShowTask: currentTaskInfo.data,
            TaskReport: currentTaskInfo.data.Report,
            assignmentIntroduce: currentTaskInfo.data.Introduce.split("---"),
            assignmentProgress: currentTaskInfo.data.Progress.split(","),
            assignmentRoutes: currentTaskInfo.data.Routes.split(","),
            assignmentResponsiblePeople: currentTaskInfo.data.ResponsiblePeople.split(","),
            assignmentRecord: currentTaskInfo.data.Record ? currentTaskInfo.data.Record.split("---") : array,
            assignmentProblemsNumber: currentTaskInfo.data.ProblemNumber ? currentTaskInfo.data.ProblemNumber.split("---") : array,
          }
        });

        // yield call(callback, 1); // 标记完成成功
      } catch (error) {
        // yield call(callback, 0, error);
      } finally {
        yield put({ type: "changeState", data: { showLoading: false } });
      }
    },

    *deleteOneTask({ callback, data }, { call, put }) { // 删除一个任务
      try {
        yield put({ type: "changeState", data: { showLoading: true } });

        const deleteTaskResult = yield call(DeleteOneTaskService, data.Number);

        // 删除任务以后，修改
        const changePylonsStateResult = yield call(ChangePylonsStateService,
          data.Routes, // 电塔
          Array(data.Count).fill(data.Type === "0" ? 0 : 5).join(","), // 巡检任务被删，恢复电塔为正常，维修任务被删，恢复电塔为3级危险
          "无" // 电塔负责人赋值为空
        );

        // 只有在删除巡检任务的时候，才能删除问题表中的数据
        // 删除任务以后，先判断该任务是否是巡检问题，且有提出的问题，若有，则全部删除
        if (data.Type === "0" && data.ProblemNumber) { // 该任务的问题编码列不为空，则需要删除问题表数据
          const deleteProblemsResult = yield call(DeleteProblemsService, data.ProblemNumber);
        }

        yield call(callback, 1); // 删除成功
      } catch (error) {
        yield call(callback, 0, error);
      } finally {
        yield put({ type: "changeState", data: { showLoading: false } });
      }
    },

    *changeTaskRecord({ callback, assignmentRecord }, { call, put, select }) { // 用户完成任务节点之前，点击了记录信息按钮
      try {
        yield put({ type: "changeState", data: { showLoading: true } });

        const { task } = yield select(state => ({ task: state[Namespaces.task].toJS() }));

        const changeResult = yield call(ChangeTaskRecordService, task.currentShowTask.Number, assignmentRecord.join("---"));

        yield put({ type: "getCurrentTaskInfo" });

        yield call(callback, 1); // 开始任务成功
      } catch (error) {
        yield call(callback, 0, error);
      } finally {
        yield put({ type: "changeState", data: { showLoading: false } });
      }
    },

    *submitReport({ callback }, { call, put, select }) { // 任务处于未报告状态时，巡检人员或者维修人员点击了任务详情页的完成按钮，则提交任务报告及修改任务状态
      try {
        yield put({ type: "changeState", data: { showLoading: true } });

        const { task } = yield select(state => ({ task: state[Namespaces.task].toJS() }));

        const changeResult = yield call(ChangeTaskReportStateService, task.currentShowTask.Number, task.TaskReport, "3");

        yield put({ type: "getCurrentTaskInfo" });

        yield call(callback, 1); // 开始任务成功
      } catch (error) {
        yield call(callback, 0, error);
      } finally {
        yield put({ type: "changeState", data: { showLoading: false } });
      }
    },

    *submitProblem({ callback }, { call, put, select }) { // 提交任务节点的问题表单，随便修改任务表的问题编码列
      try {
        yield put({ type: "changeState", data: { showLoading: true } });

        const { task } = yield select(state => ({ task: state[Namespaces.task].toJS() }));

        const { login } = yield select(state => ({ login: state[LoginNamespaces.login].toJS() }));

        let randomNumber = Math.random().toString();

        let problemNumber = randomNumber.substr(2, randomNumber.length);
        const submitProblemResult = yield call(ProblemsPostService, {
          Number: problemNumber,
          PylonNumber: task.assignmentRoutes[task.currentOnClickStepIndex],
          Describle: task.ProblemIntreduce,
          CheckPeople: login.currentUser.Name,
          CheckPeoplePhone: login.currentUser.Account,
        });

        // 修改任务表的问题编码列
        task.assignmentProblemsNumber[task.currentOnClickStepIndex] = `${task.assignmentProblemsNumber[task.currentOnClickStepIndex]
          ? `${task.assignmentProblemsNumber[task.currentOnClickStepIndex]}___`
          : ""}${problemNumber}`;
        const changeProblemNumberResult = yield call(ChangeTaskProblemNumberService, task.currentShowTask.Number, task.assignmentProblemsNumber.join("---"));

        yield put({ type: "getCurrentTaskInfo" });

        yield call(callback, 1); // 开始任务成功
      } catch (error) {
        yield call(callback, 0, error);
      } finally {
        yield put({ type: "changeState", data: { showLoading: false } });
      }
    },


    *changeProblemInfo({ callback }, { call, put, select }) { // 巡检人员改变问题信息
      try {
        yield put({ type: "changeState", data: { showLoading: true } });

        const { task } = yield select(state => ({ task: state[Namespaces.task].toJS() }));

        const changeResult = yield call(ChangeProblemInfoService,
          task.problemDetail.Number,
          task.changeProblemIntreduce,
          task.changeProblemPictures ? task.changeProblemPictures : "无",
          "无"
        );

        // yield put({ type: "getCurrentTaskInfo" });

        yield call(callback, 1); // 开始任务成功
      } catch (error) {
        yield call(callback, 0, error);
      } finally {
        yield put({ type: "changeState", data: { showLoading: false } });
      }
    },
  },

  reducers: {
    changeState(state, { data }) {

      return state.merge(data);
    },

    init(state) {
      return state.merge({
        showLoading: false,
        myTasks: null,
        myTasksType: null,
        currentTab: 0, // 当前被选中的tab

        isShowAssignmentDetailModal: false, // 是否展示任务详情的Modal
        isShowStepOnClickModal: false, // step被点击的时候展示该操作提示框
        stepOnClickModalBtnState: [0, 0, 0], // 元素1：0为取消，1为完成；元素2：0为开始任务，1为记录；元素3：0为不显示该按钮，1为提出问题
        currentShowTask: null, // 用户点击的某一个任务的所有信息
        currentOnClickStepIndex: 0, // 当前被点击的step的下标
        assignmentIntroduce: null, // 该任务中，每一个电塔的任务介绍
        assignmentProgress: null, // 该任务中，每一个电塔的任务进度，未开始0、进行中1、已完成2、有问题3
        assignmentRoutes: null, // 该任务中，巡检、维修电塔的路线
        assignmentResponsiblePeople: null, // 该任务中的负责人
        assignmentRecord: null, // 该任务中，每一个电塔的信息记录
        assignmentProblemsNumber: null, // 该任务中，每一个电塔的问题编号

        TaskReport: null, // 任务的报告
        TaskPictures: null, // 某一个任务所有电塔都巡检完成时，展示上传图片按钮

        isRenderSubmitProblemsModal: false, // 是否渲染巡检人员提出问题的表单modal
        ProblemIntreduce: "",
        ProblemPictures: null,

        isRenderProblemNumberClickedModal: false, // 任务详情页问题编号被点击，展示该问题的详细信息的modal
        problemDetail: null, // 获取到的用户点击问你编码的问题详情
        changeProblemIntreduce: "",
        changeProblemPictures: null,
      });
    }
  }

});
