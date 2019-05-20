import React, { Component } from 'react';

import { SearchBar, NavBar, TabBar, Toast } from "antd-mobile";

import { api_url } from "../../../functions/index";

export class TestComponent extends Component {
    map: any;

    componentDidMount() {
        this.renderMap();
    }

    renderMap() {
        console.log(this.refs)
        let map = new AMap.Map(this.refs['container'], {
            // resizeEnable: true, // 是否监控地图容器尺寸变化，默认值为false
            // mapStyle: , // 设置地图的显示样式, https://lbs.amap.com/dev/mapstyle/index
            // expandZoomRange: true, // 是否支持可以扩展最大缩放级别,和zooms属性配合使用,设置为true的时候，zooms的最大级别在PC上可以扩大到20级，移动端还是高清19/非高清20
            center: [121.629114, 31.186431],
            // zooms: [4,18],//设置地图级别范围
            zoom: 13,
            // showBuildingBlock: true, // 设置地图显示3D楼块效果
            // buildingAnimation: true, // 楼块出现和消失的时候是否显示动画过程，3D视图有效，PC端默认true，手机端默认false
            // preloadMode: true, // 设置地图的预加载模式，开启预加载的地图会在适当时刻提前加载周边和上一级的地图数据，优化使用体验。该参数默认值true
            // viewMode: '3D', // 使用3D视图
            // pitch: 30 // 俯仰角度，默认0，[0,83]，2D地图下无效 
        });

    }

    render() {
        return <div style={{ position: 'fixed', height: '100%', width: '100%' }}>
            <TabBar
                unselectedTintColor="#949494"
                tintColor="#33A3F4"
                barTintColor="white"
            >
                <TabBar.Item
                    title="地图"
                    key="home"
                    icon={<div style={{
                        width: '22px',
                        height: '22px',
                        background: `url(${api_url}/Assert/home/home1.png) center center /  21px 21px no-repeat`
                    }}
                    />
                    }
                    selectedIcon={<div style={{
                        width: '22px',
                        height: '22px',
                        background: `url(${api_url}/Assert/home/home2.png) center center /  21px 21px no-repeat`
                    }}
                    />
                    }
                    selected={true}
                >
                    <a onClick={() => {
                        console.log(1111)
                        location.reload()
                    }}>加载</a>
                    <NavBar
                        mode="dark"
                        style={{ height: "7%", fontSize: "15" }}
                    >巡检地图</NavBar>
                    <SearchBar
                        key="searchKey"
                        placeholder="请输入详细地址"
                        onSubmit={e => console.log(e)}
                        style={{ width: "100%", height: "6%", padding: "0 0", fontSize: "13" }} />
                    <div ref="container" id="container" style={{ width: "100%", height: "87%" }} />
                </TabBar.Item>
            </TabBar>
        </div>
    }
}

