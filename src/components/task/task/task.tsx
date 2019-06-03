import React, { Component } from 'react';
import { connect } from 'dva';

import { Link } from 'dva/router';

import { TabBar, List, NavBar, Icon, Tabs, Badge, SwipeAction, Modal, Toast, Steps, ImagePicker } from "antd-mobile";

import { Modal as BTModal, Button as BTButton, Carousel as BTCarousel, Alert, Form } from "react-bootstrap";

import { api_url } from "../../../functions/index";

import { HomeMap, Contacts, My } from '../../home/home/index';

import { TasksType, TasksTypeBadgeColor, TaskDetailStepTitle, TaskDetailStepStatus, TaskDetailStepIcon } from '../models/index';

import { tabs, getBadge, getFormatDate, renderNoData } from './common';

export class TaskComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const currentUser = stateLogin!.get("currentUser");
    if (!currentUser) goTo("/login/task")
    else this.getData(currentUser)
  }

  getData(currentUser: any) {
    currentUser.Type === "0" ? dispatch({ type: "task/getMyStartTasks" }) // 当前登录者是管理员，则获取管理员发布的任务
      : dispatch({ type: "task/getMyTasks" }); // 当前登录者是巡检或维修，则获取他们负责的任务

    dispatch({ type: "task/changeState", data: { stepOnClickModalBtnState: [0, 0, 0] } })
  }

  componentWillUnmount() {
    dispatch({ type: "task/init" });
  }

  renderTitle() {
    return <>
      <NavBar
        mode="dark"
        rightContent={<img src={`${api_url}/Assert/home/refresh.png`} width='22px' height='22px' onClick={() => location.reload()} />}
        style={{ height: "7%", fontSize: "15" }}
      >任务 {state!.get("showLoading") ? <Icon type={"loading"} size="xs" /> : <></>}</NavBar>
    </>
  }

  // step被点击的时候展示该操作提示框
  renderStepOnClickModal() {
    const stepOnClickModalBtnState = state!.get("stepOnClickModalBtnState"),
      assignmentRoutes = state!.get("assignmentRoutes"),
      currentOnClickStepIndex = state!.get("currentOnClickStepIndex");

    return stepOnClickModalBtnState && assignmentRoutes && <BTModal
      show={state!.get("isShowStepOnClickModal")}
      onHide={() => {
        dispatch({ type: "task/changeState", data: { isShowStepOnClickModal: false } });
      }}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <BTModal.Header closeButton>
        <BTModal.Title id="contained-modal-title-vcenter">
          <span style={{ fontSize: "15px" }}>操作提示</span>
        </BTModal.Title>
      </BTModal.Header>
      <BTModal.Footer>
        <BTButton variant="outline-primary"
          onClick={() => {
            stepOnClickModalBtnState[0] === 0 ?
              dispatch({ type: "task/changeState", data: { isShowStepOnClickModal: false } })
              : dispatch({
                type: "task/completeOneTask",
                callback: (status: number, msg?: any) => {
                  if (status === 1) { // 标记完成成功！
                    Toast.success("任务点已标记完成", 2,
                      () => dispatch({
                        type: "task/changeState", data: { isShowStepOnClickModal: false }
                      }));
                  } else if (status === 0) { // 标记完成失败
                    console.log(msg);
                    Toast.offline("标记完成失败,请重试！", 1);
                  }
                }
              })
          }}
          style={{ width: stepOnClickModalBtnState[2] === 0 ? "30%" : "23%", fontSize: "15px" }}>
          {stepOnClickModalBtnState[0] === 0 ? "取消" : "完成"}
        </BTButton>
        <BTButton variant="outline-info"
          onClick={() => {
            if (stepOnClickModalBtnState[1] === 0) { // 开始任务
              dispatch({
                type: "task/startTask",
                callback: (status: number, msg?: any) => {
                  Toast.hide();
                  if (status === 1) { // 开始任务成功！
                    Toast.success("任务点已标记开始，请认真完成任务，可点击“去这里”前往任务点", 3);
                  } else if (status === 0) { // 开始任务失败
                    console.log(msg);
                    Toast.offline("开始任务失败,请重试！", 1);
                  }
                }
              });
            } else if (stepOnClickModalBtnState[1] === 1) { // 记录信息
              dispatch({ type: "task/changeState", data: { isShowStepOnClickModal: false } }); // 关掉信息提示框
              Modal.prompt(
                `电塔${assignmentRoutes[currentOnClickStepIndex]}号`,
                '请输入需要记录的信息(必填)',
                [
                  { text: '取消', onPress: () => dispatch({ type: "task/changeState", data: { isShowStepOnClickModal: true } }) },
                  {
                    text: '提交', onPress: e => {
                      // 记录的信息输入完成以后，存入数据库，并刷新页面
                      if (e) {
                        const assignmentRecord = state!.get("assignmentRecord");
                        assignmentRecord[currentOnClickStepIndex] = `${assignmentRecord[currentOnClickStepIndex] ? `${assignmentRecord[currentOnClickStepIndex]}___` : ""}${e}`;

                        Toast.loading("信息保存中...");
                        dispatch({
                          type: "task/changeTaskRecord",
                          assignmentRecord: assignmentRecord,
                          callback: (status: number, msg?: any) => {
                            Toast.hide();
                            if (status === 1) { // 记录信息已保存成功！
                              Toast.success("记录信息已保存", 1);
                            } else if (status === 0) { // 记录信息保存失败
                              console.log(msg);
                              Toast.offline("记录信息保存失败,请重试！", 1);
                            }
                          }
                        });
                      } else {
                        Toast.offline("没有输入信息，无法保存！", 2);
                        dispatch({ type: "task/changeState", data: { isShowStepOnClickModal: true } });
                      }
                    }
                  },
                ],
                'default',
                ''
              )
            }
          }}
          style={{ width: stepOnClickModalBtnState[2] === 0 ? "30%" : "23%", fontSize: "15px" }}>
          {stepOnClickModalBtnState[1] === 0 ? "开始任务" : "记录"}
        </BTButton>
        <BTButton variant="outline-info"
          onClick={() => {
            Toast.loading("正在前往地图视图...", 2, () => {
              goTo(`/home/toPylon:${state!.get("assignmentRoutes")[state!.get("currentOnClickStepIndex")]}`);
            });
          }}
          style={{ width: stepOnClickModalBtnState[2] === 0 ? "30%" : "23%", fontSize: "15px" }}>
          去这里
        </BTButton>
        {stepOnClickModalBtnState[2] === 1 && < BTButton variant="outline-success"
          onClick={() => dispatch({ type: "task/changeState", data: { isRenderSubmitProblemsModal: true, isShowStepOnClickModal: false } })}
          style={{ width: "23%", fontSize: "15px" }}>
          提问题
        </BTButton>}
      </BTModal.Footer>
    </BTModal >
  }

  // 任务详情页提交问题的modal
  renderSubmitProblemsModal() {
    const currentOnClickStepIndex = state!.get("currentOnClickStepIndex"),
      assignmentRoutes = state!.get("assignmentRoutes"),
      ProblemPictures = state!.get("ProblemPictures") || [],
      currentUser = stateLogin!.get("currentUser");

    return assignmentRoutes && <Modal
      // popup // 是否弹窗模式
      visible={state!.get("isRenderSubmitProblemsModal")} // 对话框是否可见
      // closable={true} // 是否显示关闭按钮
      maskClosable={true} // 点击蒙层是否允许关闭
      // animationType="slide-up" // 可选: 'slide-down / up' / 'fade' / 'slide'
      title={<div style={{ height: "100%", backgroundColor: "#108ee9", color: "#ffffff" }}>电塔问题表单</div>} // 标题 React.Element
      footer={[
        {
          text: <div>返回</div>,
          onPress: () => {
            dispatch({ type: "task/changeState", data: { isRenderSubmitProblemsModal: false } });
          }
        },
        {
          text: <div style={{ backgroundColor: "#108ee9", color: "#ffffff" }}>提交</div>,
          onPress: () => {
            if (!state!.get("ProblemIntreduce")) { // 未输入问题介绍
              Toast.fail("请输入问题介绍！", 1);
            } else {
              Toast.loading("问题提交中...");
              dispatch({
                type: "task/submitProblem",
                callback: (status: number, msg?: any) => {
                  Toast.hide();
                  if (status === 1) { // 问题提交成功！
                    Toast.success("问题提交成功", 1, () => dispatch({ type: "task/changeState", data: { isRenderSubmitProblemsModal: false } }));
                  } else if (status === 0) { // 问题提交失败
                    console.log(msg);
                    Toast.offline("问题提交成功,请重试！", 1);
                  }
                }
              });
            }
          }
        }
      ]} // 底部内容  Array {text, onPress}
      style={{ height: "100%" }}
    >
      {<Form style={{ padding: "15px", textAlign: "left" }}>
        <Form.Group controlId="ProblemPylonNumber" >
          <Form.Label style={{ color: "black" }}>电塔名称：</Form.Label>
          <Form.Control style={{ fontSize: "15px" }} value={`电塔${assignmentRoutes[currentOnClickStepIndex]}号`} disabled />
        </Form.Group>
        <Form.Group controlId="ProblemIntreduce" >
          <Form.Label style={{ color: "black" }}>问题介绍(必填)：</Form.Label>
          <Form.Control as="textarea" rows={6} style={{ fontSize: "15px" }}
            onChange={(e: any) => dispatch({ type: "task/changeState", data: { ProblemIntreduce: e.target.value } })} />
        </Form.Group>
        {<Form.Group controlId="ProblemPictures">
          <Form.Label style={{ color: "black" }}>任务图片：</Form.Label>
          <ImagePicker
            files={ProblemPictures}
            onChange={(files: any) => dispatch({
              type: "task/changeState",
              data: {
                ProblemPictures: files.length > 12 ? files.slice(0, 12) : files
              }
            })}
            selectable={ProblemPictures.length <= 12}
            multiple={true}
          />
          <Form.Text className="text-muted">最多选择12张图片(超出则取前12张图片)</Form.Text>
        </Form.Group>}
        <Form.Group controlId="releasePersonName" >
          <Form.Label style={{ color: "black" }}>问题发布者姓名：</Form.Label>
          <Form.Control style={{ fontSize: "15px" }} value={currentUser.Name || ""} disabled />
        </Form.Group>
        <Form.Group controlId="releasePersonPhone" >
          <Form.Label style={{ color: "black" }}>问题发布者手机号：</Form.Label>
          <a href={`tel:${currentUser.Account}`}>
            <Form.Control style={{ fontSize: "15px" }} value={currentUser.Account || ""} disabled />
          </a>
        </Form.Group>
      </Form>}
    </Modal >
  }

  // 当某一个step被点击时，先判断当前电塔的状态，
  // 1、若为未开始，则判断在该step之前的step是否有未开始、进行中，有则提示“请先完成以上任务”，
  //    没有则弹出提示框是否开始执行任务（可判断是否进入执行任务范围，通过定位及计算距离）,点击开始执行任务时，该step状态为进行中
  // 2、若为进行中，则弹出提示框完成、记录、提出问题(只有巡检人员才有)，
  //    点击完成按钮，则修改该step状态为完成
  //    点击记录按钮，弹出输入框，输入记录，点击确定时，存入数据库
  //    若当前为巡检人员，还可以点击提出问题按钮，弹出提出问题表单，巡检人员填写表单并提交
  // 3、若为已完成、有问题，则不能点击
  assignmentStepOnClick(currentUser: any, i: number, assignmentProgress: any) {
    if (assignmentProgress[i] === "0") { // 被点击step的状态为未开始
      if (i === 0) { // 被点击的是第一个step
        dispatch({
          type: "task/changeState", data: {
            isShowStepOnClickModal: true, stepOnClickModalBtnState: [0, 0, 0], currentOnClickStepIndex: i
          }
        });
      } else { // 被点击的不是是第一个step，则判断在该step之前的step是否有未开始、进行中，有则提示“请先完成以上任务”
        let isStart = true;
        for (let key of assignmentProgress.slice(0, i)) {
          if (key === "0" || key === "1") { // 在该step之前的step有未开始、进行中的step
            isStart = false;
            break;
          }
        }
        !isStart ? Toast.show("请先完成前面步骤", 1)
          : dispatch({
            type: "task/changeState", data: {
              isShowStepOnClickModal: true,
              stepOnClickModalBtnState: [0, 0, 0],
              currentOnClickStepIndex: i
            }
          });
      }
    } else if (assignmentProgress[i] === "1") { // 被点击step的状态为进行中，需判断当前用户是巡检人员、还是维修人员
      dispatch({
        type: "task/changeState", data: {
          isShowStepOnClickModal: true,
          stepOnClickModalBtnState: [1, 1, currentUser.Type === "2" ? 0 : 1],
          currentOnClickStepIndex: i
        }
      });
    }
  }

  // 渲染每一个step的信息记录
  renderAssignmentStepRecord(index: number) {
    const assignmentRecord = state!.get("assignmentRecord");

    return assignmentRecord[index] ?
      assignmentRecord[index].split("___").map((item: any, i: number) => <div style={{ wordBreak: "break-all" }}>
        <span style={{ color: "rgb(58, 161, 113)" }}>任务记录{i + 1}：</span><span>{item}</span>
      </div>)
      : <div>任务记录：暂无记录</div>;
  }

  // 任务详情页问题编号被点击，展示该问题的详细信息的modal
  renderProblemNumberClickedModal() {
    const problemDetail = state!.get("problemDetail"),
      changeProblemPictures = state!.get("changeProblemPictures") || [],
      currentUser = stateLogin!.get("currentUser");

    return problemDetail && <Modal
      // popup // 是否弹窗模式
      visible={state!.get("isRenderProblemNumberClickedModal")} // 对话框是否可见
      // closable={true} // 是否显示关闭按钮
      maskClosable={true} // 点击蒙层是否允许关闭
      // animationType="slide-up" // 可选: 'slide-down / up' / 'fade' / 'slide'
      title={<div style={{ height: "100%", backgroundColor: "#108ee9", color: "#ffffff" }}>电塔问题表单</div>} // 标题 React.Element
      footer={[
        {
          text: <div>返回</div>,
          onPress: () => {
            dispatch({ type: "task/changeState", data: { isRenderProblemNumberClickedModal: false } });
          }
        },
        {
          text: <div style={{ backgroundColor: currentUser.Type === "1" && problemDetail.State === "0" ? "#108ee9" : "rgb(206, 203, 203)", color: "#ffffff" }}>修改</div>,
          onPress: () => {
            if (currentUser.Type !== "1") Toast.offline("您的身份不能修改该表单！", 1); // 不是巡检人员身份
            else if (problemDetail.State !== "0") Toast.offline("该阶段不能修改！", 1); // 是巡检人员身份，但问题已被解决时，不能修改
            else {
              if (!state!.get("changeProblemIntreduce")) { // 未输入问题介绍
                Toast.fail("请输入问题介绍！", 1);
              } else {
                Toast.loading("问题修改中...");
                dispatch({
                  type: "task/changeProblemInfo",
                  callback: (status: number, msg?: any) => {
                    Toast.hide();
                    if (status === 1) { // 问题修改成功！
                      Toast.success("问题修改成功", 1, () => dispatch({ type: "task/changeState", data: { isRenderProblemNumberClickedModal: false } }));
                    } else if (status === 0) { // 问题修改失败
                      console.log(msg);
                      Toast.offline("问题修改成功,请重试！", 1);
                    }
                  }
                });
              }
            }
          }
        }
      ]} // 底部内容  Array {text, onPress}
      style={{ height: "100%" }}
    >
      {<Form style={{ padding: "15px", textAlign: "left" }}>
        <Form.Group controlId="ProblemPylonNumber" >
          <Form.Label style={{ color: "black" }}>电塔名称：</Form.Label>
          <Form.Control style={{ fontSize: "15px" }} value={`电塔${problemDetail.PylonNumber}号`} disabled />
        </Form.Group>
        <Form.Group controlId="ProblemIntreduce" >
          <Form.Label style={{ color: "black" }}>问题介绍：</Form.Label>
          {currentUser.Type === "1" && problemDetail.State === "0" ? <Form.Control as="textarea" rows={6} style={{ fontSize: "15px" }}
            value={state!.get("changeProblemIntreduce")}
            onChange={(e: any) => dispatch({ type: "task/changeState", data: { changeProblemIntreduce: e.target.value } })} />
            : <Form.Control as="textarea" rows={6} style={{ fontSize: "15px" }}
              value={state!.get("changeProblemIntreduce")} disabled />}
        </Form.Group>
        {currentUser.Type === "1" && problemDetail.State === "0" ?
          <Form.Group controlId="ProblemPictures">
            <Form.Label style={{ color: "black" }}>任务图片：</Form.Label>
            <ImagePicker files={changeProblemPictures}
              onChange={(files: any) => dispatch({
                type: "task/changeState",
                data: {
                  changeProblemPictures: files.length > 12 ? files.slice(0, 12) : files
                }
              })}
              selectable={changeProblemPictures.length <= 12}
              multiple={true}
            />
            <Form.Text className="text-muted">最多选择12张图片(超出则取前12张图片)</Form.Text>
          </Form.Group>
          : changeProblemPictures.length > 0 && <Form.Group controlId="ProblemPictures">
            <Form.Label style={{ color: "black" }}>任务图片：</Form.Label>
            <ImagePicker files={changeProblemPictures} selectable={false} disableDelete={true} />
            <Form.Text className="text-muted">最多选择12张图片(超出则取前12张图片)</Form.Text>
          </Form.Group>}
        <Form.Group controlId="probleState" >
          <Form.Label style={{ color: "black" }}>问题状态：</Form.Label>
          <Form.Control style={{ fontSize: "15px" }} value={problemDetail.State === "2" ? "已解决" : "未解决"} disabled />
        </Form.Group>
        <Form.Group controlId="problemCreatedDate" >
          <Form.Label style={{ color: "black" }}>问题发布最新时间：</Form.Label>
          <Form.Control style={{ fontSize: "15px" }} value={getFormatDate(new Date(problemDetail.CreatedDate))} disabled />
        </Form.Group>
        <Form.Group controlId="changeReleasePersonName" >
          <Form.Label style={{ color: "black" }}>问题发布者姓名：</Form.Label>
          <Form.Control style={{ fontSize: "15px" }} value={problemDetail.CheckPeople || ""} disabled />
        </Form.Group>
        <Form.Group controlId="changeReleasePersonPhone" >
          <Form.Label style={{ color: "black" }}>问题发布者手机号：</Form.Label>
          <a href={`tel:${problemDetail.CheckPeoplePhone}`}>
            <Form.Control style={{ fontSize: "15px" }} value={problemDetail.CheckPeoplePhone || ""} disabled />
          </a>
        </Form.Group>
      </Form>}
    </Modal >
  }

  // 渲染每一个step提交的问题的Number
  renderAssignmentStepProblemNumber(index: number) {
    const assignmentProblemsNumber = state!.get("assignmentProblemsNumber");

    return assignmentProblemsNumber[index] ?
      assignmentProblemsNumber[index].split("___").map((item: any, i: number) => <div style={{ wordBreak: "break-all" }}>
        <span style={{ color: "red" }}>问题编码{i + 1}：</span>
        <a
          style={{ color: "blue" }}
          onClick={(e) => {
            e.stopPropagation();
            dispatch({ type: "task/getProblemDetail", problemNumber: item });
          }}>{item}</a>
      </div>)
      : <div>问题编码：暂无记录</div>;
  }

  renderAssignmentSteps() {
    const assignmentRoutes = state!.get("assignmentRoutes"),
      assignmentIntroduce = state!.get("assignmentIntroduce"),
      assignmentProgress = state!.get("assignmentProgress"),
      currentUser = stateLogin!.get("currentUser");

    return <Steps size="small" current={0}>
      {assignmentRoutes.map((item: any, i: number) => {
        const currentProgress = Number(assignmentProgress[i]);
        return <Steps.Step
          title={<div>
            {`电塔${item}号`}
            <span style={{ marginLeft: "15px", color: TasksTypeBadgeColor[currentProgress], fontSize: "15px" }}>
              {TaskDetailStepTitle[currentProgress]}
            </span>
          </div>}
          onClick={() => !(currentUser.Type === "0") && this.assignmentStepOnClick(currentUser, i, assignmentProgress)}
          description={<div>
            <div>{`任务要求： ${assignmentIntroduce[i]}`}</div>
            {this.renderAssignmentStepRecord(i)}
            {this.renderAssignmentStepProblemNumber(i)}
          </div>}
          status={TaskDetailStepStatus[currentProgress]}
          icon={<Icon type={TaskDetailStepIcon[currentProgress]} />} />
      })}
    </Steps>
  }

  // 任务详情的Modal
  renderAssignmentDetailModal() {
    const currentShowTask = state!.get("currentShowTask"),
      TaskPictures = state!.get("TaskPictures") || [],
      currentUser = stateLogin!.get("currentUser"),
      TaskReport = state.get("TaskReport"),
      taskTypeStr = currentShowTask && (currentShowTask.Type === "0" ? "巡检" : "维修");

    return currentShowTask && currentUser && <Modal
      // popup // 是否弹窗模式
      visible={state!.get("isShowAssignmentDetailModal")} // 对话框是否可见
      // closable={true} // 是否显示关闭按钮
      maskClosable={true} // 点击蒙层是否允许关闭
      // animationType="slide-up" // 可选: 'slide-down / up' / 'fade' / 'slide'
      title={<div style={{ height: "100%", backgroundColor: "#108ee9", color: "#ffffff" }}>
        {taskTypeStr}任务详情
      </div>} // 标题 React.Element
      footer={[
        {
          text: <div>返回</div>,
          onPress: () => {
            this.getData(stateLogin!.get("currentUser"));
            dispatch({ type: "task/changeState", data: { isShowAssignmentDetailModal: false } });
          }
        },
        {
          text: <div style={{
            backgroundColor: currentUser.Type === "0" || currentShowTask.State !== "2" ? "rgb(206, 203, 203)" : "#108ee9",
            color: "#ffffff"
          }}>完成</div>,
          onPress: () => {
            if (currentUser.Type === "0") {
              Toast.info("管理员不能做任何操作！", 1);
            } else {
              if (currentShowTask.State === "0" || currentShowTask.State === "1") { // 任务未完成
                Toast.offline("任务未完成，请先完成任务！", 1);
              } else if (currentShowTask.State !== "2") {
                Toast.offline("任务已完成！", 1);
              } else if (currentShowTask.State === "2") {
                // 验证报告、图片是否上传
                if (!TaskReport) { // 任务报告没有填写
                  Toast.fail("请填写任务报告！", 1);
                } else {
                  Toast.loading("表单提交中...");
                  dispatch({
                    type: "task/submitReport",
                    callback: (status: number, msg?: any) => {
                      Toast.hide();
                      if (status === 1) { // 表单提交成功！
                        Toast.success("表单提交成功", 1);
                      } else if (status === 0) { // 表单提交失败
                        console.log(msg);
                        Toast.offline("表单提交成功,请重试！", 1);
                      }
                    }
                  });
                }
              }
            }
          }
        }
      ]} // 底部内容  Array {text, onPress}
      style={{ height: "100%" }}
      onClose={() => dispatch({ type: "task/changeState", data: { isShowAssignmentDetailModal: false } })}
    >
      {<Form style={{ padding: "15px", textAlign: "left" }}>
        <Form.Group controlId="assignmentRoutes">
          <Form.Label style={{ color: "black" }}>{taskTypeStr}路线：</Form.Label>
          {this.renderAssignmentSteps()}
        </Form.Group>
        {currentUser.Type !== "0" && currentShowTask.State <= "2" && <Form.Group controlId="taskReport" >
          <Form.Label style={{ color: "black" }}>任务报告：</Form.Label>
          <Form.Control as="textarea" rows={6} style={{ fontSize: "15px" }} value={TaskReport || ""}
            onChange={(e: any) => dispatch({ type: "task/changeState", data: { TaskReport: e.target.value } })} />
        </Form.Group>}
        {currentShowTask.State > "2" && <Form.Group controlId="taskReport" >
          <Form.Label style={{ color: "black" }}>任务报告：</Form.Label>
          <Form.Control as="textarea" rows={7} style={{ fontSize: "15px" }} value={currentShowTask.Report} readOnly />
        </Form.Group>}
        {currentUser.Type !== "0" && currentShowTask.State === "2" && <Form.Group controlId="TaskPictures">
          <Form.Label style={{ color: "black" }}>任务图片：</Form.Label>
          <ImagePicker
            files={TaskPictures}
            onChange={(files: any) => dispatch({
              type: "task/changeState",
              data: {
                TaskPictures: files.length > 12 ? files.slice(0, 12) : files
              }
            })}
            selectable={TaskPictures.length <= 12}
            multiple={true}
          />
          <Form.Text className="text-muted">最多选择12张图片(超出则取前12张图片)</Form.Text>
        </Form.Group>}
        {<Form.Group controlId="taskResponsiblePeople" >
          <Form.Label style={{ color: "black" }}>负责人员：</Form.Label>
          <Form.Control style={{ fontSize: "15px" }} value={currentShowTask.ResponsiblePeople} disabled />
        </Form.Group>}
        {<Form.Group controlId="taskCount" >
          <Form.Label style={{ color: "black" }}>电塔数量：</Form.Label>
          <Form.Control style={{ fontSize: "15px" }} value={currentShowTask.Count} disabled />
        </Form.Group>}
        {<Form.Group controlId="taskCreatedDate" >
          <Form.Label style={{ color: "black" }}>发布时间：</Form.Label>
          <Form.Control style={{ fontSize: "15px" }} value={getFormatDate(new Date(currentShowTask.CreatedDate))} disabled />
        </Form.Group>}
        {<Form.Group controlId="taskEndDate" >
          <Form.Label style={{ color: "black" }}>截止时间：</Form.Label>
          <Form.Control style={{ fontSize: "15px" }} value={getFormatDate(new Date(currentShowTask.EndDate))} disabled />
        </Form.Group>}
        {<Form.Group controlId="taskType" >
          <Form.Label style={{ color: "black" }}>任务类型：</Form.Label>
          <Form.Control style={{ fontSize: "15px" }} value={currentShowTask.Type === "0" ? "巡检任务" : "维修任务"} disabled />
        </Form.Group>}
        {currentShowTask.State === "2" && <Form.Group controlId="taskCompletedDate" >
          <Form.Label style={{ color: "black" }}>任务完成时间：</Form.Label>
          <Form.Control style={{ fontSize: "15px" }} value={getFormatDate(new Date(currentShowTask.CompletedDate))} disabled />
        </Form.Group>}
        <Form.Group controlId="releasePersonName" >
          <Form.Label style={{ color: "black" }}>任务发布者姓名：</Form.Label>
          <Form.Control style={{ fontSize: "15px" }} value={currentShowTask.ReleasePersonName || ""} disabled />
        </Form.Group>
        <Form.Group controlId="releasePersonPhone" >
          <Form.Label style={{ color: "black" }}>任务发布者手机号：</Form.Label>
          <a href={`tel:${currentShowTask.ReleasePersonPhone}`}>
            <Form.Control style={{ fontSize: "15px" }} value={currentShowTask.ReleasePersonPhone || ""} disabled />
          </a>
        </Form.Group>
      </Form>}
    </Modal >
  }

  renderTabsOneContent(item: any, i: number) {
    const currentUser = stateLogin!.get("currentUser"),
      rigthBtn = [
        {
          text: '详情',
          onPress: () => dispatch({
            type: "task/changeState", data: {
              isShowAssignmentDetailModal: true,
              currentShowTask: item,
              TaskReport: item.Report,
              assignmentIntroduce: item.Introduce.split("---"),
              assignmentProgress: item.Progress.split(","),
              assignmentRoutes: item.Routes.split(","),
              assignmentResponsiblePeople: item.ResponsiblePeople.split(","),
              assignmentRecord: item.Record ? item.Record.split("---") : Array(Number(item.Count)).fill(""),
              assignmentProblemsNumber: item.ProblemNumber ? item.ProblemNumber.split("---") : Array(Number(item.Count)).fill(""),
            }
          }),
          style: { backgroundColor: 'rgb(6, 213, 250)', color: 'white' },
        }
      ];

    currentUser.Type === "0" && rigthBtn.push({ // 当前为管理员的话，可以删除任务
      text: '删除',
      onPress: () => {
        if (item.State !== "0") Toast.fail("当前任务不能被删除，只有未开始的任务可以删除！", 2);
        else
          Modal.alert('操作提示', '确认删除该任务？', [
            { text: '取消' },
            {
              text: '确定', onPress: () => {
                Toast.loading("删除中...");
                dispatch({
                  type: "task/deleteOneTask",
                  data: item,
                  callback: (state: number, msg?: any) => {
                    Toast.hide();
                    if (state === 1) { // 删除成功！
                      Toast.success("删除成功！", 1, () => this.getData(stateLogin!.get("currentUser")));
                    } else if (state === 0) { // 删除失败
                      console.log(msg);
                      Toast.offline("删除失败,请重试！", 1);
                    }
                  }
                });
              }
            },
          ])
      },
      style: { backgroundColor: 'red', color: 'white' },
    });

    return <SwipeAction
      autoClose
      right={rigthBtn}
    >
      <List.Item
        multipleLine
        wrap
        key={i}
        extra={getBadge(Number(item.State))}
      >
        <div>
          <div style={{ fontSize: "15px" }}>负责人员: {item.ResponsiblePeople}</div>
          <div style={{ fontSize: "15px" }}>电塔数量: {item.Count}</div>
          <div style={{ fontSize: "15px" }}>发布时间: {getFormatDate(new Date(item.CreatedDate))}</div>
          <div style={{ fontSize: "15px" }}>截止时间: {getFormatDate(new Date(item.EndDate))}</div>
          {item.State === "2" &&
            <div style={{ fontSize: "15px" }}>完成时间: {getFormatDate(new Date(item.CompletedDate))}</div>}
          {currentUser.Type === "0" &&
            <div style={{ fontSize: "15px" }}>任务类型: {item.Type === "0" ? "巡检" : "维修"}任务</div>}
        </div>
      </List.Item>
    </SwipeAction>
  }

  renderTabsContent() {
    const currentTab = state!.get("currentTab"),
      myTasks = state!.get("myTasks"),
      myTasksType = state!.get("myTasksType");

    return currentTab === 0 ? myTasks && (myTasks.data.length > 0 ?
      <List>
        {myTasks.data.map((item: any, i: number) => {
          return this.renderTabsOneContent(item, i);
        })}
      </List> : renderNoData())
      : myTasksType && (myTasksType[TasksType[currentTab - 1]].length > 0 ?
        <List>
          {myTasksType[TasksType[currentTab - 1]].map((item: any, i: number) => {
            return this.renderTabsOneContent(item, i);
          })}
        </List> : renderNoData())
  }

  renderTasksContent() {
    const currentUser = stateLogin!.get("currentUser");
    const tabsData = [
      { title: <Badge text={'3'}>{currentUser && currentUser.Type === "0" ? "全部发起" : "全部任务"}</Badge> },
      ...tabs
    ]

    return <div style={{ width: "100%", height: "93%", overflowY: "auto", overflowX: "hidden" }}>
      <Tabs tabs={tabsData}
        initialPage={0}
        swipeable={false}
        onChange={(tab, index) => dispatch({ type: "task/changeState", data: { currentTab: index } })}
        onTabClick={(tab, index) => dispatch({ type: "task/changeState", data: { currentTab: index } })}
      >
        {this.renderTabsContent()}
      </Tabs>
    </div>
  }

  renderTasks() {
    return <TabBar.Item
      title="任务"
      key="home"
      icon={<div style={{
        width: '22px',
        height: '22px',
        background: `url(${api_url}/Assert/task/task1.png) center center /  21px 21px no-repeat`
      }} />}
      selectedIcon={<div style={{
        width: '22px',
        height: '22px',
        background: `url(${api_url}/Assert/task/task2.png) center center /  21px 21px no-repeat`
      }} />}
      selected={true}
      badge={1}
    >
      {this.renderTitle()}
      {this.renderTasksContent()}
    </TabBar.Item >
  }


  render() {
    return <>
      {this.renderFooter()}
      {this.renderAssignmentDetailModal()}
      {this.renderStepOnClickModal()}
      {this.renderSubmitProblemsModal()}
      {this.renderProblemNumberClickedModal()}
    </>
  }

  renderFooter() {
    return <div style={{ position: 'fixed', height: '100%', width: '100%' }}>
      <TabBar
        unselectedTintColor="#949494"
        tintColor="#33A3F4"
        barTintColor="white"
      >
        {HomeMap(goTo)}
        {this.renderTasks()}
        {Contacts(goTo)}
        {My(goTo)}
      </TabBar>
    </div>
  }
}

function mapStateToProps(state: any) {// 获取state
  // console.log(state) // state中有所有命名空间的数据
  let task = state.task;
  let login = state.login;
  let loading = state.loading;
  return { task, login, loading };
}

let dispatch: any;
let state: any;
let stateLogin: any;
let goBack: any;
let goTo: any;
let isLoading: any; // 是否正在加载

export const TaskPage = connect(mapStateToProps)((props: any) => {
  dispatch = props.dispatch;
  state = props.task;
  stateLogin = props.login;
  goBack = props.history.goBack;
  goTo = props.history.push;
  isLoading = props.loading.global;
  // console.log(props) // props中有match、location、contact(命名空间)、history(goBack、push、go...)、dispatch
  return <TaskComponent />
});
