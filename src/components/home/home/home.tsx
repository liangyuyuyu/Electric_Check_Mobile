import React, { Component } from 'react';

import { connect } from 'dva';

import NProgress from 'nprogress';

import { NoticeBar, SearchBar, NavBar, Icon, InputItem, WingBlank, Button, WhiteSpace, Flex, Checkbox, TabBar, Toast, Modal, List, Badge, SegmentedControl, Drawer, Accordion } from "antd-mobile";

import { Modal as BTModal, Button as BTButton, Alert, Form } from "react-bootstrap";

import { api_url } from "../../../functions/index";

import { PylonIconType } from "../models/index";

import { Tasks, Contacts, My, pylonStatusBadge, PylonStatusColor, PylonStatusString } from './common';

export class HomeComponent extends Component {
  constructor(props) {
    super(props);
  }

  map: any;
  bindClickOnMap: any; // 点击事件绑定到地图上
  mapOnClickMarker: any;
  isFirstNavigation = true; // 用来判别是否是第一次进入导航选择界面
  walkingNavigation: any; // 步行导航
  ridingNavigation: any; // 骑行导航
  transferNavigation: any; // 公交导航
  drivingNavigation: any; // 驾车导航

  componentWillMount() {
    dispatch({ type: "home/getPylons" });
  }

  componentDidMount() {
    console.log(window.location.href, NProgress);
    this.renderMap();
    // NProgress.done(); // 页面加载进度条结束
  }

  componentWillUnmount() {
    dispatch({
      type: "home/changeState",
      data: {
        isRenderMapOnClick: 0,
        isShowNavigationChoice: false,
        isRenderPylonsMaker: true
      }
    });

    Toast.hide(); // 全局配置和全局销毁Toast的方法
  }

  renderTitle(title: any, showLoading: boolean) {
    return <>
        <NavBar
            mode="dark"
            leftContent={<Icon key="1" type="ellipsis" />}
            onLeftClick={() => dispatch({ type: "home/changeState", data: { isShowSideBar: true } })}
            rightContent={<img src={`${api_url}/Assert/home/refresh.png`} width='22px' height='22px' onClick={() => location.reload()} />}
            style={{ height: "7%", fontSize: "15" }}
        >
            {title} 
            {showLoading ? <Icon type={"loading"} size="xs"/> : <></>}
        </NavBar>
    </>
  }

  renderMap() {
    this.map = new AMap.Map('mapDiv', {
      resizeEnable: true, // 是否监控地图容器尺寸变化，默认值为false
      // mapStyle: , // 设置地图的显示样式, https://lbs.amap.com/dev/mapstyle/index
      expandZoomRange: true, // 是否支持可以扩展最大缩放级别,和zooms属性配合使用,设置为true的时候，zooms的最大级别在PC上可以扩大到20级，移动端还是高清19/非高清20
      center: [121.629114, 31.186431],
      // zooms: [10,24],//设置地图级别范围
      zoom: 13,
      showIndoorMap: true, // 是否在有矢量底图的时候自动展示室内地图，PC端默认是true，移动端默认是false
      // rotateEnable: true, // 地图是否可旋转，3D视图默认为true，2D视图默认false
      isHotspot: true, // 是否开启地图热点和标注的hover效果。PC端默认是true，移动端默认是false 
      showBuildingBlock: true, // 设置地图显示3D楼块效果
      buildingAnimation: true, // 楼块出现和消失的时候是否显示动画过程，3D视图有效，PC端默认true，手机端默认false
      preloadMode: true, // 设置地图的预加载模式，开启预加载的地图会在适当时刻提前加载周边和上一级的地图数据，优化使用体验。该参数默认值true
      viewMode: '3D', // 使用3D视图
      pitchEnable: true, // 是否允许设置俯仰角度，3D视图下为true，2D视图下无效。
      pitch: 30 // 俯仰角度，默认0，[0,83]，2D地图下无效 
    });

    this.bindClickOnMap = e => this.renderMapOnClick(e);
    dispatch({ type: "home/changeState", data: { isRenderMapOnClick: 1 } });

    this.renderMapPlugin();
    this.renderMapDW();
  }

  // 根据经纬度搜索地点及周边信息
  renderMapService(lng: any, lat: any) {
    new AMap.service('AMap.Geocoder', () => {
      let geocoder = new AMap.Geocoder({
        city: "全国", // 地理编码时，设置地址描述所在城市,可选值：城市名（中文或中文全拼）、citycode、adcode,默认值：“全国”
        extensions: "all" // 逆地理编码时，返回信息的详略,默认值：base，返回基本地址信息,取值为：all，返回地址信息及附近poi、道路、道路交叉口等信息
      });
      geocoder.getAddress([lng, lat], (status: any, result: any) => {
        if (status === 'complete' && result.info === 'OK') {
          //获得了有效的地址信息

          const regeocode = result.regeocode,
            formattedAddress = regeocode.formattedAddress,
            pois = regeocode.pois;

          let first_name = "",
            second_name = "",
            direction = "",
            distance = "";
          if (regeocode.crosses.length > 0) { // 避免出现十字路口数据为空的情况
            first_name = regeocode.crosses[0].first_name;
            second_name = regeocode.crosses[0].second_name;
            direction = regeocode.crosses[0].direction;
            distance = regeocode.crosses[0].distance;
          }

          let nearestRoad: any;
          if (regeocode.roads.length > 0)
            nearestRoad = regeocode.roads[0];

          let nearestPois: any = [];
          for (let i in pois) {
            if (Number(i) >= 6) break;
            nearestPois.push(<Badge key={i} text={pois[i].name}
              style={{
                marginRight: 12,
                padding: '0 3px',
                backgroundColor: '#fff',
                borderRadius: 2,
                color: '#f19736',
                border: '1px solid #f19736',
              }}
            />)
          }

          dispatch({
            type: "home/changeState",
            data: {
              isShowMapOnClickModal: true,
              mapOnClickLng: lng,
              mapOnClickLat: lat,
              mapOnClickAddress: formattedAddress,
              mapOnClickCrosses: first_name ? `${first_name}与${second_name}交叉口，位于所点位置的${direction}方向${distance}米处` : "",
              mapOnClickRoad: nearestRoad ? `${nearestRoad.name}，位于所点位置的${nearestRoad.direction}方向${nearestRoad.distance}米处` : null,
              mapOnClickPois: nearestPois
            }
          });
        }
        else {
          //获取地址失败
          Toast.fail("获取地址失败, 请在中国范围内选择地址", 2);

          this.mapOnClickMarker && this.map.remove(this.mapOnClickMarker);
        }
      });
    })
  }

  // 为地图注册click事件获取鼠标点击出的经纬度坐标和地址
  renderMapOnClick(e: any) {
    const lng = e.lnglat.getLng();
    const lat = e.lnglat.getLat();
    const lnglatXY = [lng, lat];//地图上所标点的坐标

    this.mapOnClickMarker = new AMap.Marker({
      offset: new AMap.Pixel(-23, -36),
      position: lnglatXY, // 位置
      content: `<img src="${api_url}/Assert/home/maker.png" style="width:40px;height:40px"/>`
    });
    this.map.add(this.mapOnClickMarker);//添加到地图

    this.map.setCenter([lng, lat]); //设置地图中心点

    this.renderMapService(lng, lat);
  }

  renderMapOnClickModalContent() {
    const mapOnClickLng = state!.get("mapOnClickLng"),
      mapOnClickLat = state!.get("mapOnClickLat"),
      currentLng = state!.get("currentLng"),
      currentLat = state!.get("currentLat"),
      distance = (AMap.GeometryUtil.distance([currentLng, currentLat], [mapOnClickLng, mapOnClickLat]) / 1000).toFixed(2), // 计算地面距离，单位：米
      mapOnClickAddress = state!.get("mapOnClickAddress"),
      mapOnClickCrosses = state!.get("mapOnClickCrosses"),
      mapOnClickRoad = state!.get("mapOnClickRoad"),
      mapOnClickPois = state!.get("mapOnClickPois") || [],
      isShowMapOnClickModal = state!.get("isShowMapOnClickModal"),
      valueArray = [`${mapOnClickLng},${mapOnClickLat}`, mapOnClickAddress],
      keyArray: any = ['经纬度:', '详细地址:']; // mapOnClickCrosses, mapOnClickRoad, mapOnClickPois];

    if (mapOnClickCrosses) {
      valueArray.push(mapOnClickCrosses)
      keyArray.push('最近路口:')
    }
    if (mapOnClickRoad) {
      valueArray.push(mapOnClickRoad)
      keyArray.push('最近的路:')
    }
    if (mapOnClickPois.length > 0) {
      valueArray.push(mapOnClickPois)
      keyArray.push('附近地点:')
    }

    return <Modal
      popup // 是否弹窗模式
      visible={isShowMapOnClickModal} // 对话框是否可见
      // closable={true} // 是否显示关闭按钮
      maskClosable={true} // 点击蒙层是否允许关闭
      animationType="slide-up" // 可选: 'slide-down / up' / 'fade' / 'slide'
      title={<span>详情 | <img src={`${api_url}/Assert/home/distance.png`} style={{ width: "27px", height: "27px" }} />{distance}km</span>} // 标题 React.Element
      footer={[
        {
          text: '取消', onPress: () => {
            this.mapOnClickMarker && this.map.remove(this.mapOnClickMarker);
            dispatch({
              type: "home/changeState",
              data: {
                isShowMapOnClickModal: false
                // mapOnClickLng: 0, // 点击地图上某个点，该点的经度
                // mapOnClickLat: 0, // 点击地图上某个点，该点的纬度
                // mapOnClickAddress: '', // 点击地图上某个点，该点的地址
                // mapOnClickCrosses: '', // 点击地图上某个点，该点的最近的路口
                // mapOnClickRoad: '', // 点击地图上某个点，该点的最近的路
                // mapOnClickPois: null, // 点击地图上某个点，该点的附近地点 } });
              }
            });
          }
        },
        {
          text: '去这里', onPress: () => dispatch({
            type: "home/changeState", data: {
              isShowMapOnClickModal: false, isShowNavigationChoice: true, isRenderMapOnClick: 2
            }
          })
        }
      ]} // 底部内容  Array {text, onPress}
      onClose={() => {
        this.mapOnClickMarker && this.map.remove(this.mapOnClickMarker);
        dispatch({ type: "home/changeState", data: { isShowMapOnClickModal: false } });
      }} // 点击 x 或 mask 回调 (): void
      style={{ maxHeight: "70%", overflowY: "auto", overflowX: "hidden" }}
    >
      <List>
        {keyArray.map((item: any, index: number) => (
          <List.Item wrap={true} key={index}>
            <table style={{ width: "100%" }}>
              <tr>
                <td style={{ width: "25%" }}>{item}</td>
                <td style={{ width: "75%" }}>{valueArray[index]}</td>
              </tr>
            </table>
          </List.Item>
        ))}
      </List>
    </Modal>
  }

  renderMapPylonsModalContent() {
    const pylons = state!.get("pylons"),
      isShowPylonInfoModal = state!.get("isShowPylonInfoModal"),
      currentOnClickPylonIndex = state!.get("currentOnClickPylonIndex"),
      currentLng = state!.get("currentLng"),
      currentLat = state!.get("currentLat"),
      valueArray: any = [],
      keyArray: any = [];

    let distance = "";
    if(currentOnClickPylonIndex >= 0){
      const pylonInfo = pylons.data[currentOnClickPylonIndex];

      distance=(AMap.GeometryUtil.distance([currentLng, currentLat], [pylonInfo.Lng, pylonInfo.Lat]) / 1000).toFixed(2); // 计算地面距离，单位：米

      keyArray.push("经纬度:");
      valueArray.push(`${pylonInfo.Lng},${pylonInfo.Lat}`);
      
      keyArray.push("电塔名称:");
      valueArray.push(`电塔${pylonInfo.Number}号`);

      keyArray.push("详细地址:");
      valueArray.push(pylonInfo.Address);

      keyArray.push("电塔简介:");
      valueArray.push(pylonInfo.Introduce);

      keyArray.push("问题数量:");
      valueArray.push(pylonInfo.Problems);

      keyArray.push("当前状态:");
      valueArray.push(pylonStatusBadge(pylonInfo.State));
    }

    return currentOnClickPylonIndex >= 0 && <Modal
      popup // 是否弹窗模式
      visible={isShowPylonInfoModal} // 对话框是否可见
      // closable={true} // 是否显示关闭按钮
      maskClosable={true} // 点击蒙层是否允许关闭
      animationType="slide-up" // 可选: 'slide-down / up' / 'fade' / 'slide'
      title={<span>详情 | <img src={`${api_url}/Assert/home/distance.png`} style={{ width: "27px", height: "27px" }} />{distance}km</span>} // 标题 React.Element
      footer={[
        {
          text: '取消', onPress: () => {
            dispatch({
              type: "home/changeState",
              data: {
                isShowPylonInfoModal: false,
                // currentOnClickPylonLng: 0, // 当前被点击电塔的经度
                // currentOnClickPylonLat: 0, // 当前被点击电塔的纬度
                // currentOnClickPylonIndex: -1, // 当前被点击电塔在电塔数组的下标
              }
            });
          }
        },
        {
          text: '去这里', onPress: () => dispatch({
            type: "home/changeState", data: {
              isShowPylonInfoModal: false, isShowNavigationChoice: true, isRenderMapOnClick: 2,
              mapOnClickLng: pylons.data[currentOnClickPylonIndex].Lng,
              mapOnClickLat: pylons.data[currentOnClickPylonIndex].Lat
            }
          })
        }
      ]} // 底部内容  Array {text, onPress}
      onClose={() => {
        dispatch({ type: "home/changeState", data: { isShowPylonInfoModal: false } });
      }} // 点击 x 或 mask 回调 (): void
      style={{ maxHeight: "70%", overflowY: "auto", overflowX: "hidden" }}
    >
      <List>
        {keyArray.map((item: any, index: number) => (
          <List.Item wrap={true} key={index}>
            <table style={{ width: "100%" }}>
              <tr>
                <td style={{ width: "25%" }}>{item}</td>
                <td style={{ width: "75%" }}>{valueArray[index]}</td>
              </tr>
            </table>
          </List.Item>
        ))}
      </List>
    </Modal>
  }

  // 地图电塔被点击时触发
  renderPylonMakerOnClick() {
    const lng = state!.get("currentOnClickPylonLng"),
      lat = state!.get("currentOnClickPylonLat");

    let isFirstComeIn = true;

    return <BTModal
      show={state!.get("isShowPylonModal")}
      onHide={() => {
        !isFirstComeIn && dispatch({ type: "home/changeState", data: { isShowPylonModal: false } });
        isFirstComeIn = false;
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
            dispatch({ type: "home/changeState", data: { isShowPylonModal: false } });
            this.renderMapService(lng, lat);
          }}
          style={{ width: "33%", fontSize: "15px" }}>电塔周边</BTButton>
        <BTButton variant="outline-info"
          onClick={() => dispatch({ type: "home/changeState", data: { isShowPylonModal: false, isShowPylonInfoModal: true } })}
          style={{ width: "33%", fontSize: "15px" }}>电塔信息</BTButton>
        <BTButton variant="outline-success"
          onClick={() => dispatch({
            type: "home/changeState", data: {
              isShowPylonModal: false, isShowNavigationChoice: true, isRenderMapOnClick: 2, mapOnClickLng: lng, mapOnClickLat: lat
            }
          })}
          style={{ width: "33%", fontSize: "15px" }}>去这里</BTButton>
      </BTModal.Footer>
    </BTModal>
  }

  // 在地图上渲染圆圈
  renderMapCircle(lng: any, lat: any, i: number) {
    let circleMarker = new AMap.CircleMarker({
      center: new AMap.LngLat(lng, lat),  // 圆心位置
      radius: 50, //半径
      strokeColor: PylonStatusColor[i],  // 线条颜色
      strokeOpacity: 0.5, // 轮廓线透明度，取值范围[0,1]
      strokeWeight: 3, // 轮廓线宽度
      fillOpacity: 0.3, // 圆形填充透明度，取值范围[0,1]
      strokeStyle: 'dashed', // 轮廓线样式，实线:solid，虚线:dashed
      strokeDasharray: [10, 10], // 勾勒形状轮廓的虚线和间隙的样式，此属性在strokeStyle 为dashed 时有效
      fillColor: '#1791fc', // 圆形填充颜色
      zIndex: 50, // 层叠顺序 默认zIndex:10
    });
  
    this.map.add(circleMarker);
  }

  renderMapPylonsMarker(pylons: any) {
    pylons && pylons.data.map((item: any, i: number) => {

      let marker = new AMap.Marker({
        offset: new AMap.Pixel(-23, -36),
        position: [item.Lng, item.Lat], // 位置
        content: `<img src="${api_url}/Assert/home/${PylonIconType[parseInt(item.State)]}.png" style="width:46px;height:56px"/>`
      });

      let onMarkerClick = e => {
        const lnglat = e.target.getPosition();

        dispatch({
          type: "home/changeState",
          data: {
            isShowPylonModal: true,
            currentOnClickPylonLng: lnglat.lng, // 当前被点击电塔的经度
            currentOnClickPylonLat: lnglat.lat, // 当前被点击电塔的纬度
            currentOnClickPylonIndex: i // 当前被点击电塔在电塔数组的下标
          }
        })
      }

      marker.on('click', onMarkerClick);//绑定click事件
      this.map.add(marker);//添加到地图

      this.renderMapCircle(item.Lng, item.Lat, Number(item.State));

      dispatch({ type: "home/changeState", data: { isRenderPylonsMaker: false } });
    })
  }

  // 渲染地图控件
  renderMapPlugin() {
    this.map.plugin(["AMap.ToolBar"], () => {
      // 加载工具条
      let tool = new AMap.ToolBar({
        position: "RB", // 控件停靠位置,LT:左上角,RT:右上角, LB:左下角, RB:右下角, 默认位置：LT
        ruler: true, // 标尺键盘是否可见，默认为true
        noIpLocate: false, // 定位失败后，是否开启IP定位，默认为false
        // locate: true, // 是否显示定位按钮，默认为false
        liteStyle: true, // 是否使用精简模式，默认为false
        direction: true, // 方向键盘是否可见，默认为true
        // autoPosition: true, // 是否自动定位，即地图初始化加载完成后，是否自动定位的用户所在地, 默认为false
        // locationMarker:  // 自定义定位图标，值为Marker对象
        useNative: true // 是否使用高德定位sdk用来辅助优化定位效果,仅供在使用了高德定位sdk的APP中，嵌入webview页面时使用
      });
      this.map.addControl(tool);
    });
    this.map.plugin(["AMap.Scale"], () => {
      // 比例尺控件
      let scale = new AMap.Scale({
        position: "LT"
      });
      this.map.addControl(scale);
    });
    this.map.plugin(["AMap.MapType"], () => {
      // 地图类型切换
      let type = new AMap.MapType({
        defaultType: 0, // 初始化默认图层类型。 取值为0：默认底图 取值为1：卫星图 默认值：0
        // showTraffic: false, // 叠加实时交通图层 默认值：false
        // showRoad: true // 叠加路网图层 默认值：false
      });
      this.map.addControl(type);
    });
    this.map.plugin(["AMap.OverView"], () => {
      // 加载鹰眼
      let view = new AMap.OverView();
      this.map.addControl(view);
    });
  }

  // 渲染地图定位
  renderMapDW() {
    this.map.plugin('AMap.Geolocation', () => {
      let geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, // 是否使用高精度定位，默认:true
        GeoLocationFirst: true, // 默认为false，设置为true的时候可以调整PC端为优先使用浏览器定位，失败后使用IP定位
        timeout: 30000,          // 超过30秒后停止定位，默认：无穷大
        maximumAge: 0,           // 定位结果缓存0毫秒，默认：0
        convert: true,           // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true,        // 显示定位按钮，默认：true
        // buttonDom: <div>定位</div> , // 自定义定位按钮的内容
        buttonPosition: 'LB',    // 定位按钮停靠位置，默认：'LB'，左下角
        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showMarker: true,        // 定位成功后在定位到的位置显示点标记，默认：true
        markerOptions: { // 自定义定位点样式，同Marker的Options
          'offset': new AMap.Pixel(-18, -36),
          'content': `<img src="${api_url}/Assert/home/user.png" style="width:36px;height:36px"/>`,
          // 'animation': 'AMAP_ANIMATION_BOUNCE', // 点标记的动画效果, AMAP_ANIMATION_NONE:无动画效果，AMAP_ANIMATION_DROP:点标掉落效果，AMAP_ANIMATION_BOUNCE:点标弹跳效果 
          'autoRotation': true // 是否自动旋转。点标记在使用moveAlong动画时，路径方向若有变化，点标记是否自动调整角度，默认为false。广泛用于自动调节车辆行驶方向。
        },
        // showCircle: false,        // 定位成功后用圆圈表示定位精度范围，默认：true
        // circleOptions: { // 定位点Circle的配置，不设置该属性则使用默认Circle样式
        //   radius: 20, // 圆半径
        //   fillColor: '#1791fc',   // 圆形填充颜色
        //   strokeColor: '#FF33FF', // 描边颜色
        //   strokeWeight: 6, // 描边宽度
        //   borderWeight: 2,
        //   strokeOpacity: 0.2,
        //   fillOpacity: 0.4,
        //   strokeStyle: 'dashed',
        //   strokeDasharray: [10, 10],
        //   zIndex: 50,
        // },
        panToLocation: true,     // 定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy: true,     // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        useNative: true, // 是否使用安卓定位sdk用来进行定位，默认：false, 适用于同时在APP中使用安卓定位sdk并在APP WebView中使用了JSAPI的开发者。开启后，将优先尝试使用sdk进行定位，失败后依次尝试浏览器定位和IP定位。
        extensions: "all" // extensions用来设定是否需要周边POI、道路交叉口等信息，可选值'base'、'all',默认为'base',只返回地址信息
      });
      this.map.addControl(geolocation);
      geolocation.getCurrentPosition();
      AMap.event.addListener(geolocation, 'complete', onComplete); // 返回定位信息
      AMap.event.addListener(geolocation, 'error', onError);      // 返回定位出错信息

      function onComplete(data: any) {
        Toast.success(`当前位置:${data.formattedAddress}`, 1)
        // data是具体的定位信息
        // console.log(data)
        dispatch({
          type: "home/changeState",
          data: {
            currentAddress: data.formattedAddress,
            currentLng: data.position.lng,
            currentLat: data.position.lat
          }
        })
      }

      function onError(data: any) {
        // 定位出错
        Toast.fail(`定位失败`, 1)
      }
    })
  }


  // 步行导航
  renderWalkingNavigation() {
    Toast.loading("步行路线规划中...");
    this.map.plugin('AMap.Walking', () => {
      this.walkingNavigation = new AMap.Walking({
        map: this.map,
        panel: "naviPanel", // 结果列表的HTML容器id或容器元素，提供此参数后，结果列表将在此容器中进行展示
        isOutline: true, // 使用map属性时，绘制的规划线路是否显示描边。缺省为true
        outlineColor: 'white', // 使用map属性时，绘制的规划线路的描边颜色。缺省为'white'
        hideMarkers: true, // 设置隐藏路径规划的起始点图标，设置为true：隐藏图标；设置false：显示图标 默认值为：false
        autoFitView: true // 用于控制在路径规划结束后，是否自动调整地图视野使绘制的路线处于视口的可见范围
      });
      //根据起终点坐标规划步行路线
      this.walkingNavigation.search([state!.get("currentLng"), state!.get("currentLat")], [state!.get("mapOnClickLng"), state!.get("mapOnClickLat")], (status: any, result: any) => {
        // result即是对应的步行路线数据信息
        Toast.hide();
        if (status === 'complete') {
          // console.log(result)
          // dispatch({ type: "home/changeState",
          //   data: {
          //     walkingNavigationStepsCount: result.routes[0].steps.length
          //   }
          // });
          Toast.success('步行路线规划成功', 1);
        } else {
          // Toast.fail('步行路线数据查询失败' + result, 2);
          Toast.fail('距离太远，建议选择驾车或公交出行', 1);
          dispatch({ type: "home/changeState", data: { selectedNavigationWay: 3 } });
        }
      });
    })
  }

  // 骑行导航
  renderRidingNavigation() {
    Toast.loading("骑行路线规划中...");
    this.map.plugin('AMap.Riding', () => {
      this.ridingNavigation = new AMap.Riding({
        map: this.map,
        panel: "naviPanel", // 结果列表的HTML容器id或容器元素，提供此参数后，结果列表将在此容器中进行展示
        policy: 0, // 骑行路线规划策略；可选值为 0：推荐路线及最快路线综合,1：推荐路线,2：最快路线 默认值：0
        isOutline: true, // 使用map属性时，绘制的规划线路是否显示描边。缺省为true
        outlineColor: 'white', // 使用map属性时，绘制的规划线路的描边颜色。缺省为'white'
        hideMarkers: true, // 设置隐藏路径规划的起始点图标，设置为true：隐藏图标；设置false：显示图标 默认值为：false
        autoFitView: true // 用于控制在路径规划结束后，是否自动调整地图视野使绘制的路线处于视口的可见范围
      });
      //根据起终点坐标规划骑行路线
      this.ridingNavigation.search([state!.get("currentLng"), state!.get("currentLat")], [state!.get("mapOnClickLng"), state!.get("mapOnClickLat")], (status: any, result: any) => {
        // result即是对应的骑行路线数据信息
        Toast.hide();
        if (status === 'complete') {
          // console.log(result)
          // dispatch({ type: "home/changeState",
          //   data: {
          //     walkingNavigationStepsCount: result.routes[0].steps.length
          //   }
          // });
          Toast.success('骑行路线规划成功', 1);
        } else {
          // Toast.fail('骑行路线数据查询失败' + result, 1);
          Toast.fail('距离太远，建议选择驾车或公交出行', 1);
          dispatch({ type: "home/changeState", data: { selectedNavigationWay: 3 } });
        }
      });
    })
  }


  // 公交导航
  renderTransferNavigation() {
    Toast.loading("公交路线规划中...");
    this.map.plugin('AMap.Transfer', () => {
      //构造公交换乘类
      this.transferNavigation = new AMap.Transfer({
        map: this.map,
        city: '上海市', // 公交换乘的城市，支持城市名称、城市区号、电话区号，此项为必填
        policy: AMap.TransferPolicy.LEAST_TIME, // 公交换乘策略, LEAST_TIME:最快捷模式,LEAST_FEE:最经济模式,LEAST_TRANSFER:最少换乘模式,LEAST_WALK:最少步行模式,MOST_COMFORT:最舒适模式,NO_SUBWAY:不乘地铁模式
        nightflag: true, // 是否计算夜班车，默认为不计算
        cityd: "贵阳市", // 终点城市，跨城公交路径规划时为必填参数
        panel: "naviPanel", // 结果列表的HTML容器id或容器元素，提供此参数后，结果列表将在此容器中进行展示
        isOutline: true, // 使用map属性时，绘制的规划线路是否显示描边。缺省为true
        outlineColor: 'white', // 使用map属性时，绘制的规划线路的描边颜色。缺省为'white'
        hideMarkers: true, // 设置隐藏路径规划的起始点图标，设置为true：隐藏图标；设置false：显示图标 默认值为：false
        autoFitView: true // 用于控制在路径规划结束后，是否自动调整地图视野使绘制的路线处于视口的可见范围
      });
      //根据起、终点坐标查询公交换乘路线
      this.transferNavigation.search([state!.get("currentLng"), state!.get("currentLat")], [state!.get("mapOnClickLng"), state!.get("mapOnClickLat")], (status: any, result: any) => {
        // result即是对应的公交路线数据信息
        Toast.hide();
        if (status === 'complete') {
          console.log(result.info);
          // dispatch({ type: "home/changeState",
          //   data: {
          //     walkingNavigationStepsCount: result.routes[0].steps.length
          //   }
          // });
          result.info === "NO_DATA" ? Toast.offline("距离太近，请选择步行或者骑行出行", 2) : Toast.success('公交路线规划成功', 1);
        } else {
          Toast.fail('公交路线数据查询失败' + result, 2);
        }
      });
    })
  }


  // 驾车导航
  renderDrivingNavigation() {
    Toast.loading("驾车路线规划中...");
    this.map.plugin('AMap.Driving', () => {
      // 构造路线导航类
      this.drivingNavigation = new AMap.Driving({
        map: this.map,
        panel: "naviPanel", // 结果列表的HTML容器id或容器元素，提供此参数后，结果列表将在此容器中进行展示
        hideMarkers: true, // 设置隐藏路径规划的起始点图标，设置为true：隐藏图标；设置false：显示图标 默认值为：false
        autoFitView: true // 用于控制在路径规划结束后，是否自动调整地图视野使绘制的路线处于视口的可见范围
      });
      // 根据起终点经纬度规划驾车导航路线
      this.drivingNavigation.search([state!.get("currentLng"), state!.get("currentLat")], [state!.get("mapOnClickLng"), state!.get("mapOnClickLat")], (status: any, result: any) => {
        // result 即是对应的驾车导航信息
        Toast.hide();
        if (status === 'complete') {
          // console.log(result)
          // dispatch({ type: "home/changeState",
          //   data: {
          //     walkingNavigationStepsCount: result.routes[0].steps.length
          //   }
          // });
          Toast.success('驾车路线规划成功', 1);
        } else {
          // Toast.fail('获取驾车数据失败' + result, 2);
          Toast.fail('距离太远，建议选择公交出行', 1);
        }
      });
    })
  }


  // 切换导航方式时，清除上一次地图上的导航路线及导航内容
  renderNavigation() {
    const selectedNavigationWay = state!.get("selectedNavigationWay");

    if (this.isFirstNavigation) {
      this.renderWalkingNavigation();
      this.isFirstNavigation = false;
    } else {
      this.walkingNavigation && this.walkingNavigation.clear!(); // 清除规划的路线，clear()函数清除上一次结果，可以清除地图上绘制的路线以及路径文本结果
      this.ridingNavigation && this.ridingNavigation.clear!(); // 清除规划的路线，clear()函数清除上一次结果，可以清除地图上绘制的路线以及路径文本结果
      this.transferNavigation && this.transferNavigation.clear!(); // 清除规划的路线，clear()函数清除上一次结果，可以清除地图上绘制的路线以及路径文本结果
      this.drivingNavigation && this.drivingNavigation.clear!(); // 清除规划的路线，clear()函数清除上一次结果，可以清除地图上绘制的路线以及路径文本结果

      selectedNavigationWay === 0 ? this.renderWalkingNavigation() // 步行导航
        : selectedNavigationWay === 1 ? this.renderRidingNavigation() // 骑行导航
          : selectedNavigationWay === 2 ? this.renderTransferNavigation() // 公交导航
            : selectedNavigationWay === 3 && this.renderDrivingNavigation(); // 驾车导航
    }
  }

  // 步行导航点击了取消按钮
  removeNavigation() {
    this.mapOnClickMarker && this.map.remove(this.mapOnClickMarker); // 删除点击地图展示的marker

    this.walkingNavigation && this.walkingNavigation.clear!(); // 清除规划的路线，clear()函数清除上一次结果，可以清除地图上绘制的路线以及路径文本结果
    this.ridingNavigation && this.ridingNavigation.clear!(); // 清除规划的路线，clear()函数清除上一次结果，可以清除地图上绘制的路线以及路径文本结果
    this.transferNavigation && this.transferNavigation.clear!(); // 清除规划的路线，clear()函数清除上一次结果，可以清除地图上绘制的路线以及路径文本结果
    this.drivingNavigation && this.drivingNavigation.clear!(); // 清除规划的路线，clear()函数清除上一次结果，可以清除地图上绘制的路线以及路径文本结果

    dispatch({ type: "home/changeState", data: { isRemoveNavigation: false, selectedNavigationWay: 0 } });
  }

  render() {
    const pylons = state!.get("pylons");
    state!.get("isRenderPylonsMaker") && pylons && this.map && this.renderMapPylonsMarker(pylons);

    this.map && this.renderMapAutoComplete();

    state!.get("isShowNavigationChoice") ? this.renderNavigation() : (this.isFirstNavigation = true);
    state!.get("isRemoveNavigation") && this.removeNavigation();
    state!.get("isRenderMapOnClick") === 1 ? this.map.on('click', this.bindClickOnMap) // 在地图上绑定点击事件
      : state!.get("isRenderMapOnClick") === 2 && this.map.off('click', this.bindClickOnMap); // 解绑地图上绑定的点击事件

    console.log(state!.toJS())
    return <Drawer
      transitions // 是否开启动画
      touch // 是否开启触摸手势
      position={"left"} // 抽屉所在位置, 'left', 'right', 'top', 'bottom'
      dragToggleDistance={30} // 打开关闭抽屉时距 sidebar 的拖动距离
      className="my-drawer"
      sidebarStyle={{ width: '60%', height: "100%", backgroundColor: "#ffffff" }}
      sidebar={this.renderSideBar()} // 抽屉里的内容
      open={state!.get("isShowSideBar")} // 开关状态
      onOpenChange={e => dispatch({ type: "home/changeState", data: { isShowSideBar: false } })} //	open 状态切换时调用
    >
      {this.renderFooter()}
      {this.renderMapOnClickModalContent()}
      {this.renderPylonMakerOnClick()}
      {this.renderMapPylonsModalContent()}
      {this.renderAddPylonModal()}
    </Drawer>
  }

  // 渲染添加电塔的表单
  renderAddPylonModal() {
    return <Modal
      popup // 是否弹窗模式
      visible={state!.get("isRenderAddPylonModal")} // 对话框是否可见
      // closable={true} // 是否显示关闭按钮
      maskClosable={true} // 点击蒙层是否允许关闭
      animationType="slide-up" // 可选: 'slide-down / up' / 'fade' / 'slide'
      style={{ height: "100%" }}
    >
      <NavBar mode="dark" style={{ height: "6.5%", fontSize: "15px" }} >添加电塔表单</NavBar>
      <Form style={{ width:"100%", height:"93.5%" }}>
          <div style={{ width:"100%", height:"94%", overflowY: "auto", overflowX: "hidden", padding: "15px", textAlign: "left" }}>
              <Form.Group controlId="pylonName">
                <Form.Label style={{color: "black"}}>电塔名称：</Form.Label>
                <Form.Control style={{fontSize: "15px"}} required type="text" placeholder="请输入电塔的名称" value={"电塔14号"} disabled />
                <Form.Text className="text-muted">此项不可修改</Form.Text>
                <Form.Control.Feedback>检查通过</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="pylonLng">
                <Form.Label style={{color: "black"}}>电塔经度：</Form.Label>
                <Form.Control style={{fontSize: "15px"}} required type="number" placeholder="请输入电塔的经度(必填)" onChange={e => console.log(e.target.value)} />
                <Form.Text className="text-muted">只能输入数字或小数</Form.Text>
                <Form.Control.Feedback>检查通过</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="pylonName">
                <Form.Label style={{color: "black"}}>电塔维度：</Form.Label>
                <Form.Control style={{fontSize: "15px"}} required type="number" placeholder="请输入电塔的维度(必填)" onChange={e => console.log(e.target.value)} />
                <Form.Text className="text-muted">只能输入数字或小数</Form.Text>
                <Form.Control.Feedback>检查通过</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="pylonIntruduce">
                <Form.Label style={{color: "black"}}>电塔介绍：</Form.Label>
                <Form.Control style={{fontSize: "15px"}} as="textarea" required  placeholder="请输入电塔的介绍(必填)" rows="3" onChange={e => console.log(e.target.value)}/>
                <Form.Control.Feedback>检查通过</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="pylonAddress">
                <Form.Label style={{color: "black"}}>电塔地址：</Form.Label>
                <Form.Control style={{fontSize: "15px"}} type="text" required placeholder="请输入电塔的地址(必填)" onChange={e => console.log(e.target.value)} />
                <Form.Text className="text-muted">必须输入详细地址</Form.Text>
                <Form.Control.Feedback>检查通过</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="pylonProblems">
                <Form.Label style={{color: "black"}}>曾出现的问题数：</Form.Label>
                <Form.Control style={{fontSize: "15px"}} type="number" placeholder="请输入电塔的曾出现的问题数" onChange={e => console.log(e.target.value)} />
                <Form.Text className="text-muted">只能输入整数</Form.Text>
                <Form.Control.Feedback>检查通过</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="pylonState">
                <Form.Label style={{color: "black"}}>电塔状态：</Form.Label>
                <Form.Control style={{fontSize: "15px"}} as="select" onChange={e => console.log(e.target.value)}>
                  <option value={0} selected>运行正常</option>
                  <option value={1}>正在巡检中</option>
                  <option value={2}>正在维修中</option>
                  <option value={3}>一级危险中</option>
                  <option value={4}>二级危险中</option>
                  <option value={5}>三级危险中</option>
                </Form.Control>
              </Form.Group>
          </div>
          <div style={{ width:"100%", height:"6%" }}>
            <BTButton variant="outline-secondary" style={{width: "50%", height: "100%"}} 
              onClick={()=>dispatch({ type: "home/changeState", data: { isRenderAddPylonModal: false } })}>取消</BTButton>
            <BTButton type="submit" variant="outline-primary" style={{width: "50%", height: "100%"}}>添加</BTButton>
          </div>
      </Form>
    </Modal>
  }

  // 管理员点击发起巡检、维修任务时，先判断当前是否有需要巡检、维修的电塔
  assignmentBefore(status: number, pylonCount: number) {
    if(status === 1) { // 管理员发起了巡检任务，判断当前是否有需要巡检的电塔
      if(pylonCount === 0) {
        Toast.info("当前没有需要巡检的电塔", 2);
        return;
      }
    } else if(status === 2) { // 管理员发起了维修任务，判断当前是否有需要维修的电塔
      if(pylonCount === 0) {
        Toast.info("当前没有需要维修的电塔", 2);
        return;
      }
    }
    dispatch({ type: "home/changeState", data: { isShowAssignmentsModal: true, isShowSideBar: false } });
  }
  
  renderSideBar() {
    const pylonsType = state!.get("pylonsType"),
      isCurrentUserManager = state!.get("isCurrentUserManager"),
      isCurrentUserInspector = state!.get("isCurrentUserInspector"),
      isCurrentUserRepairer = state!.get("isCurrentUserRepairer"),
      normalCount = pylonsType ? pylonsType.normal.length : 0,
      dangeringCount = pylonsType ? pylonsType.dangering1.length + pylonsType.dangering2.length + pylonsType.dangering3.length : 0;

    return <div style={{ width: '100%', height: "100%" }}>
      <NavBar mode="dark" style={{ height: "6.5%", fontSize: "15px" }} >操作</NavBar>
      <div style={{ height: "93.5%", overflowY: "auto", overflowX: "hidden" }}>
        {pylonsType && <Accordion>
          <Accordion.Panel header={<div style={{ fontSize: "15px" }}>所有电塔</div>}>
            <Alert key={1} variant="primary">
              <List>
                {PylonStatusString.map((item: any, i: number) => <List.Item key={i}
                  extra={
                    i===0 ? normalCount
                      : i===1 ? pylonsType.checking.length
                      : i===2 ? pylonsType.repairing.length
                      : i===3 ? pylonsType.dangering1.length
                      : i===4 ? pylonsType.dangering2.length
                      : i===5 && pylonsType.dangering3.length
                  }>
                  {item}
                </List.Item>)}
              </List>
            </Alert>
          </Accordion.Panel>
        </Accordion>}
        {isCurrentUserManager && pylonsType &&
          <Accordion>
            <Accordion.Panel header={<div style={{ fontSize: "15px" }}>发起任务</div>}>
              <Alert key={2} variant="warning">
                <List>
                  <List.Item onClick={() => this.assignmentBefore(1, normalCount)} extra={normalCount}>
                    发起巡检任务
                  </List.Item>
                  <List.Item onClick={() => this.assignmentBefore(2, dangeringCount)} extra={dangeringCount}>
                    发起维修任务
                  </List.Item>
                </List>
              </Alert>
            </Accordion.Panel>
          </Accordion>
        }
        {isCurrentUserManager &&
          <List>
            <List.Item onClick={() => dispatch({ type: "home/changeState", data: { isRenderAddPylonModal: true } })}>
              添加电塔
            </List.Item>
          </List>
        }
        {isCurrentUserInspector &&
          <Accordion>
            <Accordion.Panel header={<div style={{ fontSize: "15px" }}>巡检任务</div>}>
              <Alert key={2} variant="success">
                <List>
                  <List.Item onClick={() => console.log("完成巡检任务1")}>
                    巡检任务1
                  </List.Item>
                  <List.Item onClick={() => console.log("完成巡检任务2")}>
                    巡检任务2
                  </List.Item>
                  <List.Item onClick={() => console.log("完成巡检任务2")}>
                    巡检任务3
                  </List.Item>
                </List>
              </Alert>
            </Accordion.Panel>
          </Accordion>
        }
        {isCurrentUserRepairer &&
          <Accordion>
            <Accordion.Panel header={<div style={{ fontSize: "15px" }}>维修任务</div>}>
              <Alert key={3} variant="danger">
                <List>
                  <List.Item onClick={() => console.log("完成维修任务1")}>
                    维修任务1
                  </List.Item>
                  <List.Item onClick={() => console.log("完成维修任务2")}>
                    维修任务2
                  </List.Item>
                  <List.Item onClick={() => console.log("完成维修任务2")}>
                    维修任务3
                  </List.Item>
                </List>
              </Alert>
            </Accordion.Panel>
          </Accordion>
        }
      </div>
    </div>
  }

  // 地图的输入提示插件
  renderMapAutoComplete() {
    this.map.plugin('AMap.Autocomplete', () => {
      // 实例化Autocomplete
      let autoOptions = {
        //city 限定城市，默认全国
        city: '全国',
        input: "searchKey"
      }
      let autoComplete = new AMap.Autocomplete(autoOptions);

      AMap.event.addListener(autoComplete, "select", data => {
        console.log(data);
        const lng = data.poi.location.lng,
          lat = data.poi.location.lat;

        this.mapOnClickMarker = new AMap.Marker({ // 注册监听，当选中某条记录时会触发
          offset: new AMap.Pixel(-23, -36),
          position: [lng, lat], // 位置
          content: `<img src="${api_url}/Assert/home/maker.png" style="width:40px;height:40px"/>`
        });
        this.map.add(this.mapOnClickMarker);// 添加到地图

        this.map.setCenter([lng, lat]); //设置地图中心点

        this.renderMapService(lng, lat);
      });
    })
  }

  renderAssignmentsModal() {

  }

  renderHomeMap() {
    const mapOnClickLng = state!.get("mapOnClickLng"),
      mapOnClickLat = state!.get("mapOnClickLat"),
      currentLng = state!.get("currentLng"),
      currentLat = state!.get("currentLat"),
      selectedNavigationWay = state!.get("selectedNavigationWay");

    const SegmentedControlValues = ['步行', '骑行', '公交', '驾车'];

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
      selected={true}
    // badge={'new'}
    >
      {!state!.get("isShowNavigationChoice") ?
        <>
          {this.renderTitle("巡检地图", state!.get("showLoading"))}
          <div style={{ width: "100%", height: "6%", padding: "3px", backgroundColor: "#efeff4" }}>
            <input
              name={"searchKey"}
              id={"searchKey"}
              placeholder="请输入详细地址"
              style={{ width: "90%", height: "100%", fontSize: "15px", border: "0" }} />
            <div style={{ width: "10%", height: "100%", backgroundColor: "#ffffff", float: "right", textAlign: "center", paddingTop: "1%" }}>
              <Icon type="search" size={"md"} style={{ color: "#0a8cf7", width: "80%", height: "80%" }} />
            </div>
          </div>
        </>
        : <>
          <SegmentedControl
            style={{ height: "6%", fontSize: "15px" }}
            selectedIndex={selectedNavigationWay}
            values={SegmentedControlValues}
            onChange={e => dispatch({ type: "home/changeState", data: { selectedNavigationWay: e.nativeEvent.selectedSegmentIndex } })} />
          <div style={{ width: "100%", height: "35%" }} >
            <div id="naviPanel" style={{ width: "100%", overflowY: "auto", height: "85%" }} />
            <div style={{ width: "100%", height: "15%" }}>
              <Flex style={{ width: "100%", height: "100%" }}>
                <Flex.Item style={{ width: selectedNavigationWay !== 2 ? "50%" : "100%", height: "100%" }}>
                  <Button
                    style={{ height: "100%", fontSize: "15px", lineHeight: "250%" }}
                    onClick={() => {
                      dispatch({
                        type: "home/changeState", data: {
                          isRemoveNavigation: true,
                          isShowNavigationChoice: false,
                          isRenderMapOnClick: 1,
                          isFirstNavigation: true
                        }
                      });
                    }}
                  >
                    取消
                </Button>
                </Flex.Item>
                {selectedNavigationWay !== 2 && <Flex.Item style={{ width: "50%", height: "100%" }}>
                  <a href={`navi:${selectedNavigationWay}&${currentLng}&${currentLat}&${mapOnClickLng}&${mapOnClickLat}`}>
                    <Button
                      type="primary"
                      style={{ height: "100%", fontSize: "15px", lineHeight: "250%", color: "#ffffff" }}
                    >
                      开始导航
                    </Button>
                  </a>
                </Flex.Item>}
              </Flex>
            </div>
          </div>
        </>}
      <div id="mapDiv" style={{ width: "100%", height: !state!.get("isShowNavigationChoice") ? "87%" : "59%" }} />
    </TabBar.Item>
  }

  renderFooter() {
    return <div style={{ position: 'fixed', height: '100%', width: '100%' }}>
      <TabBar
        unselectedTintColor="#949494"
        tintColor="#33A3F4"
        barTintColor="white"
      >
        {this.renderHomeMap()}
        {Tasks()}
        {Contacts(goTo)}
        {My()}
      </TabBar>
    </div>
  }
}

function mapStateToProps(state: any) {// 获取state
  // console.log(state) // state中有所有命名空间的数据
  let home = state.home;
  let loading = state.loading;
  return { home, loading };
}

let dispatch: any;
let state: any;
let goBack: any;
let goTo: any;
let isLoading: any; // 是否正在加载

// export const HomePage = connect(mapStateToProps)(HomeComponent);

export const HomePage = connect(mapStateToProps)((props: any) => {
  dispatch = props.dispatch;
  state = props.home;
  goBack = props.history.goBack;
  goTo = props.history.push;
  isLoading = props.loading.global;
  // console.log(props) // props中有match、location、home(命名空间)、history(goBack、push、go...)、dispatch
  return <HomeComponent />
});
