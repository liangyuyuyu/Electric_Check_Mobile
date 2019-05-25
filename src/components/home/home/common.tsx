import React from 'react';

import { NavBar, TabBar, Icon, Badge } from "antd-mobile";

import { api_url } from "../../../functions/index";

export const PylonStatusColor = ['#0a8cf7', '#6DFDE4', '#F0C066', '#FF2E00', '#FF2083', '#DF0000'];
export const PylonStatusString = ['运行正常', '正在巡检中', '正在维修中', '一级危险中', '二级危险中', '三级危险中'];

export const AllPylonFunctionType = [
    "直线塔",
    "转角塔",
    "换位塔",
    "终端塔",
    "跨越塔",
    "耐张塔"
]

export const AllPylonShapeType = [
    "干字型塔",
    "上字型塔",
    "V字型塔",
    "T字型塔",
    "门字型塔",
    "酒杯型塔",
    "羊角型塔"
]

export const pylonFunctionTypeIntreduce = [
    "直线塔：输电线路最常用的一种塔型，也叫过线塔。在输电线路中直线塔一般用来承受导线的重力，即垂直荷载。", // 直线塔
    "转角塔：根据输电线路转角塔外侧主材受拉应力控制，而不受压应力失稳影响的特点进行了理论分析和计算,提出了转角塔采用不对称设计可节约钢材5%～10%，甚至更多。", // 转角塔
    "换位塔：允许导线在沿线路方向变换相对位置的杆塔。", // 换位塔
    "终端塔：用于线路一端承受导线张力的杆塔。", // 终端塔
    "跨越塔：当线路跨越江河、山谷、铁路、通信线及其他电力线路时所采用的杆塔", // 跨越塔
    "耐张塔：线路要架空就必须有两种杆塔，即一是直线塔、另一种是耐张塔，简单的比喻就是你要晒衣裳拉一根线，两端要固定在墙上，中间用竹杆撑起；固定的墙即是耐张塔，因为导线受张力架空后，沿导线纵向拉起的力全部挂在耐张塔上，即耐张塔要承受电力线路架空后的张力载荷，也就是要当成墙壁一样承受导线的拉力，所以电力线路线路最易出危险的是耐张塔。" // 耐张塔
]

export const pylonShapeTypeIntreduce = [
    "干字型塔: 形似汉字“干”而得名，是直流和交流输电线路都常见的塔型。多为直线塔，也是≥220 kV输电线路常见的耐张&转角塔。", // 干字型塔
    "上字型塔: 杆塔上只架设一根架空地线，导线呈不对称三角形布置，其外形呈“上”字形。适用于轻雷及轻冰地区导线截面较小的线路，常用于110 kV及以下电压等级的电力线路。", // 上字型塔
    "V字型塔: 拉线V型塔，门型塔的特例，形似“V”，自带“大V认证”，所以在旷野很好辨认。它施工方便，耗钢量低于其它拉线门型塔，但占地较大，在河网及大面积机耕地区使用受到一定限制。常用于500 kV的线路，在220 kV中也有少量使用。", // V字型塔
    "T字型塔: 铁塔呈“T”型，下面吊着两回输电线路，一边正极，一边负极，是直流输电的主力杆塔，仔细看铁塔上面还有两个小“角”，一边也各一条地线，江湖人称“避雷线”。", // T字型塔
    "门字型塔: 用两个柱体来支持导线及架空地线的杆塔，就像一个大大的“门”字。这种杆塔适用性比较大，带拉线时更有很好的经济性，常用于双架空地线及导线呈水平排列的情况，一般用于≥220 kV的线路，可采用打拉线来提高杆塔的稳定性，柱体有时还带一定坡度。", // 门字型塔
    "酒杯型塔: 塔上架设两根架空地线，导线排列在一个水平面上，塔形呈酒杯状。它通常是220 kV及以上电压等级输电线路的常用塔型，有良好的施工运行经验，特别适用于重冰区或多雷区。", // 酒杯型塔
    "羊角型塔: 羊角塔是输电铁塔的一种，由其形象像羊角而得名。一般用于耐张塔。" // 羊角型塔
]

// 添加电塔时，选择的电塔的设备
export const pylonDevices = [
    "杆塔",
    "导线",
    "变压器",
    "换流站",
    "电容器",
    "消弧线圈",
    "互感器"
]

// 正常0、巡检中1、维修中2、危险1、危险2、危险3、危险4
export function pylonStatusBadge(pylonState: string) {
    return <Badge
        text={PylonStatusString[Number(pylonState)]}
        style={{
            marginRight: 12,
            padding: '0 3px',
            backgroundColor: '#fff',
            borderRadius: 2,
            fontSize: "15px",
            color: PylonStatusColor[Number(pylonState)],
            border: `1px solid ${PylonStatusColor[Number(pylonState)]}`
        }}
    />
};

export function Title({ title, showLoading }) {
    return <>
        <NavBar
            mode="dark"
            leftContent={<Icon key="1" type="ellipsis" />}
            onLeftClick={() => console.log("点击了左边")}
            rightContent={<img src={`${api_url}/Assert/home/refresh.png`} width='22px' height='22px' onClick={() => location.reload()} />}
            style={{ height: "7%", fontSize: "15" }}
        >
            {title}
            {showLoading ? <Icon type={"loading"} size="xs" /> : <></>}
        </NavBar>
    </>
}


export function HomeMap(goTo: any) {
    return <TabBar.Item
        title="地图"
        key="home"
        icon={<div style={{
            width: '22px',
            height: '22px',
            background: `url(${api_url}/Assert/home/home1.png) center center /  21px 21px no-repeat`
        }} />}
        selectedIcon={<div style={{
            width: '22px',
            height: '22px',
            background: `url(${api_url}/Assert/home/home2.png) center center /  21px 21px no-repeat`
        }} />}
        // badge={'new'}
        onPress={() => goTo("home")}
    >
    </TabBar.Item>
}

export function Tasks(goTo: any) {
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
        badge={1}
        onPress={() => goTo('task')}
    >
    </TabBar.Item>
}

export function Contacts(goTo: any) {
    return <TabBar.Item
        title="联系人"
        key="home"
        icon={<div style={{
            width: '22px',
            height: '22px',
            background: `url(${api_url}/Assert/contact/contact1.png) center center /  21px 21px no-repeat`
        }} />}
        selectedIcon={<div style={{
            width: '22px',
            height: '22px',
            background: `url(${api_url}/Assert/contact/contact2.png) center center /  21px 21px no-repeat`
        }} />}
        badge={1}
        onPress={() => goTo('contact')}
    >
    </TabBar.Item >
}

export function My(goTo: any) {
    return <TabBar.Item
        title="我的"
        key="home"
        icon={<div style={{
            width: '22px',
            height: '22px',
            background: `url(${api_url}/Assert/my/my1.png) center center /  21px 21px no-repeat`
        }} />}
        selectedIcon={<div style={{
            width: '22px',
            height: '22px',
            background: `url(${api_url}/Assert/my/my2.png) center center /  21px 21px no-repeat`
        }} />}
        badge={"new"}
        onPress={() => goTo('my')}
    >
    </TabBar.Item>
}
