export enum Namespaces {
    task = "task"
}

// 任务的tabs类型
export const TasksType = [
    "NoStart", // 未开始
    "Going", // 进行中
    "NoReport", // 未发报告
    "Completed", // 已完成
    "returning", // 退回中
    "OutTime", // 已超时
]

// 任务的tabs类型
export const TasksTypeBadge = [
    "未开始",
    "进行中",
    "未报告",
    "已完成",
    "退回中",
    "已超时",
]

// 任务的Step的Title
export const TaskDetailStepTitle = [
    "未开始",
    "进行中",
    "已完成",
    "巡检出问题",
]

// 任务的Step的Status
export const TaskDetailStepStatus = [
    "wait",
    "process",
    "finish",
    "error",
]

// 任务的Step的Icon
export const TaskDetailStepIcon = [
    "ellipsis",
    "loading",
    "check-circle-o",
    "cross-circle",
]

// 任务的tabs类型
export const TasksTypeBadgeColor = [
    "rgba(248, 167, 17, 0.884)",
    "rgba(17, 221, 248, 0.945)",
    "rgba(4, 131, 250, 0.897)",
    "rgba(27, 247, 7, 0.884)",
    "rgba(248, 17, 229, 0.945)",
    "rgba(248, 63, 17, 0.945)",
    "rgba(248, 17, 113, 0.945)"
]

export function tasksDataHandle(myTasks: any) {
    let myTasksType: any = {
        [TasksType[0]]: [],
        [TasksType[1]]: [],
        [TasksType[2]]: [],
        [TasksType[3]]: [],
        [TasksType[4]]: [],
        [TasksType[5]]: [],
    };

    myTasks && myTasks.data && myTasks.data.map(item => {
        if (item.State === "0") myTasksType[TasksType[0]].push(item);
        else if (item.State === "1") myTasksType[TasksType[1]].push(item);
        else if (item.State === "2") myTasksType[TasksType[2]].push(item);
        else if (item.State === "3") myTasksType[TasksType[3]].push(item);
        else if (item.State === "4") myTasksType[TasksType[4]].push(item);
        else if (item.State === "5") myTasksType[TasksType[5]].push(item);
    });

    return myTasksType;
}