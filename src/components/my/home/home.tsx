import React, { Component } from 'react';
import { connect } from 'dva';

import { NoticeBar, SearchBar, NavBar, Icon, InputItem, WingBlank, Button, WhiteSpace, Flex, Checkbox, TabBar, Toast, Modal, List, Badge, SegmentedControl, Accordion } from "antd-mobile";

import { api_url } from "../../../functions/index";
// import { Map } from 'react-amap';
// import Autocomplete from 'react-amap-plugin-autocomplete';

// import { Namespaces } from '../models/index';
import NProgress from 'nprogress'

export function Title({ title }) {
  return <>
    <NavBar
      mode="dark"
      rightContent={<img src={`${api_url}/Assert/home/refresh.png`} width='22px' height='22px' onClick={() => location.reload()} />}
      style={{ height: "7%", fontSize: "15" }}
    >{title}</NavBar>
  </>
}

export function HomeMap() {
  const SegmentedControlValues = ['步行', '骑行', '公交', '驾车'];

  return <TabBar.Item
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
    selected={state!.get("tabBarChoice") === 1}
    // badge={'new'}
    onPress={() => dispatch({ type: "home/changeState", data: { tabBarChoice: 1 } })}
  >
    {!state!.get("isShowNavigationChoice") ?
      <>
        <Title title={"巡检地图"} />
        <SearchBar
          key="searchKey"
          value={state!.get("searchKey") || ""}
          onChange={e => {
            dispatch({ type: "home/changeState", data: { searchKey: e } });
          }}
          placeholder="请输入详细地址"
          onSubmit={e => console.log(e)}
          style={{ width: "100%", height: "6%", padding: "0 0", fontSize: "13" }} />
      </>
      : <>
        <SegmentedControl
          style={{ height: "6%", fontSize: "15px" }}
          selectedIndex={state!.get("selectedNavigationWay")}
          values={SegmentedControlValues}
          onChange={e => dispatch({
            type: "home/changeState", data: { selectedNavigationWay: e.nativeEvent.selectedSegmentIndex }
          })} />
        <div style={{ width: "100%", height: "35%" }} >
          <div id="naviPanel" style={{ width: "100%", overflowY: "auto", height: "85%" }} />
          <div style={{ width: "100%", height: "15%" }}>
            <Flex style={{ width: "100%", height: "100%" }}>
              <Flex.Item style={{ width: "50%", height: "100%" }}>
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
              <Flex.Item style={{ width: "50%", height: "100%" }}>
                <Button
                  type="primary"
                  style={{ height: "100%", fontSize: "15px", lineHeight: "250%" }}
                  onClick={() => console.log(2222)}
                >
                  开始导航
                </Button>
              </Flex.Item>
            </Flex>
          </div>
        </div>
      </>}
    <div id="mapDiv" style={{ width: "100%", height: !state!.get("isShowNavigationChoice") ? "87%" : "59%" }} />
  </TabBar.Item>
}

export function Tasks() {
  return <TabBar.Item
    title="任务"
    key="home"
    icon={<div style={{
      width: '22px',
      height: '22px',
      background: `url(${api_url}/Assert/task/task1.png) center center /  21px 21px no-repeat`
    }}
    />
    }
    selectedIcon={<div style={{
      width: '22px',
      height: '22px',
      background: `url(${api_url}/Assert/task/task2.png) center center /  21px 21px no-repeat`
    }}
    />
    }
    selected={state!.get("tabBarChoice") === 2}
    badge={1}
    onPress={() => dispatch({ type: "home/changeState", data: { tabBarChoice: 2 } })}
  >
    <Title title={"任务"} />
    <input type={"file"} />
  </TabBar.Item>
}

export function ContactsItemInfo({ item, i, avatar, badge }) {
  const contactBadgeStyle = {
    padding: '0 3px',
    backgroundColor: '#fff',
    borderRadius: 2,
    color: '#f19736',
    border: '1px solid #f19736',
  };

  return <List.Item
    thumb={<div style={{
      width: "50px",
      height: "50px",
      borderRadius: '10px',
      background: `url(${api_url}/Assert/contact/${avatar}.png) center center /  50px 50px no-repeat`
    }} />}
    extra={<Badge key={i} text={badge} style={contactBadgeStyle} />}
    multipleLine={true}
    style={{ paddingBottom: "10px" }}
  >
    <div style={{ fontSize: "15px" }}>{item.Name}</div>
    <div>
      <a href={`tel:${item.Account}`}>
        <img src={`${api_url}/Assert/contact/tel.png`} width="15px" height="15px" />
      </a>
      <a href={`smsto:${item.Account}`} style={{ marginLeft: "20px" }}>
        <img src={`${api_url}/Assert/contact/sms.png`} width="15px" height="15px" />
      </a>
    </div>
  </List.Item>
}

// 按照联系人姓名首字母排序展示
export function SortContactsInfo({ item, i }) {
  const contactBadgeStyle = {
    padding: '0 3px',
    backgroundColor: '#fff',
    borderRadius: 2,
    color: '#f19736',
    border: '1px solid #f19736',
  },
    badge = item.Type === '0' ? '管理员' : item.Type === '1' ? '巡检人员' : item.Type === '2' ? '维修人员' : '普通用户';

  return <List.Item
    thumb={<div style={{
      width: "50px",
      height: "50px",
      lineHeight: "50px",
      textAlign: "center",
      borderRadius: '10px',
      backgroundColor: 'rgba(44, 183, 218, 0.664)'
    }} >{item.firstLetter}</div>}
    extra={<Badge key={i} text={badge} style={contactBadgeStyle} />}
    multipleLine={true}
    style={{ paddingBottom: "10px" }}
  >
    <div style={{ fontSize: "15px" }}>{item.Name}</div>
    <div>
      <a href={`tel:${item.Account}`}>
        <img src={`${api_url}/Assert/contact/tel.png`} width="15px" height="15px" />
      </a>
      <a href={`smsto:${item.Account}`} style={{ marginLeft: "20px" }}>
        <img src={`${api_url}/Assert/contact/sms.png`} width="15px" height="15px" />
      </a>
    </div>
  </List.Item>
}

export function Contacts() {
  const managers = state!.get("managers") || [],
    inspectors = state!.get("inspectors") || [],
    repairers = state!.get("repairers") || [],
    users = state!.get("users") || [],
    contacts = state!.get("contacts") || [];

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
    selected={state!.get("tabBarChoice") === 3}
    badge={1}
    onPress={() => dispatch({ type: "home/changeState", data: { tabBarChoice: 3 } })}
  >
    <Title title={"联系人"} />
    <div style={{ width: "100%", height: "93%", overflowY: "auto" }}>
      {/* <Accordion defaultActiveKey="0" onChange={e => console.log("目前打开的有：", e)}>
        <Accordion.Panel header="管理员">
          <List>
            {managers.length > 0 && managers.map((item: any, i: number) => {
              return <ContactsItemInfo item={item} i={i} avatar={item.Sex === '0' ? 'manage_boy' : 'manage_girl'} badge={'管理员'} />;
            })}
          </List>
        </Accordion.Panel>
        <Accordion.Panel header="巡检人员">
          <List>
            {inspectors.length > 0 && inspectors.map((item: any, i: number) => {
              return <ContactsItemInfo item={item} i={i} avatar={item.Sex === '0' ? 'check_boy' : 'check_girl'} badge={'巡检人员'} />;
            })}
          </List>
        </Accordion.Panel>
        <Accordion.Panel header="维修人员">
          <List>
            {repairers.length > 0 && repairers.map((item: any, i: number) => {
              return <ContactsItemInfo item={item} i={i} avatar={item.Sex === '0' ? 'repair_boy' : 'repair_girl'} badge={'维修人员'} />;
            })}
          </List>
        </Accordion.Panel>
        <Accordion.Panel header="普通用户">
          <List>
            {users.length > 0 && users.map((item: any, i: number) => {
              return <ContactsItemInfo item={item} i={i} avatar={item.Sex === '0' ? 'boy' : 'girl'} badge={'普通用户'} />;
            })}
          </List>
        </Accordion.Panel>
      </Accordion> */}
      <List>
        <List.Item
          thumb={<div style={{
            width: "50px",
            height: "50px",
            lineHeight: "50px",
            textAlign: "center",
            borderRadius: '10px',
            backgroundColor: 'rgba(44, 183, 218, 0.664)'
          }} >部</div>}
          extra={<a>查看</a>}
          multipleLine={true}
          style={{ paddingBottom: "10px", paddingTop: "10px" }}
        >
          <div style={{ fontSize: "15px" }}>部门分组</div>
        </List.Item>
      </List>
      <List>
        {contacts.length > 0 && contacts.map((item: any, i: number) => {
          return <SortContactsInfo item={item} i={i} />;
        })}
      </List>
    </div>
    {/* <a href={"tel:13918437134"}>打电话</a>
    <a href={"wtai://wp//mc;13918437134"}>wtai协议打电话</a>
    <a href={"smsto:13918437134"}>发短信</a> */}
  </TabBar.Item >
}

export function My() {
  return <TabBar.Item
    title="我的"
    key="home"
    icon={<div style={{
      width: '22px',
      height: '22px',
      background: `url(${api_url}/Assert/my/my1.png) center center /  21px 21px no-repeat`
    }}
    />
    }
    selectedIcon={<div style={{
      width: '22px',
      height: '22px',
      background: `url(${api_url}/Assert/my/my2.png) center center /  21px 21px no-repeat`
    }}
    />
    }
    selected={state!.get("tabBarChoice") === 4}
    badge={"new"}
    onPress={() => dispatch({ type: "home/changeState", data: { tabBarChoice: 4 } })}
  >
    <Title title={"我的"} />
  </TabBar.Item>
}

export function HomeComponent() {
  // NProgress.start(); // 页面加载进度条开始

  return <div style={{ position: 'fixed', height: '100%', width: '100%' }}>
    <TabBar
      unselectedTintColor="#949494"
      tintColor="#33A3F4"
      barTintColor="white"
    >
      {HomeMap()}
      {Tasks()}
      {Contacts()}
      {My()}
    </TabBar>
  </div>
}

export class Home extends Component {
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

  componentDidMount() {
    console.log(window.location.href, NProgress);
    this.renderMap();
    // NProgress.done(); // 页面加载进度条结束
    dispatch({ type: "home/getContacts" });
    dispatch({ type: "home/getPylons" });
  }

  renderMap() {
    this.map = new AMap.Map('mapDiv', {
      resizeEnable: true, // 是否监控地图容器尺寸变化，默认值为false
      // mapStyle: , // 设置地图的显示样式, https://lbs.amap.com/dev/mapstyle/index
      expandZoomRange: true, // 是否支持可以扩展最大缩放级别,和zooms属性配合使用,设置为true的时候，zooms的最大级别在PC上可以扩大到20级，移动端还是高清19/非高清20
      center: [121.629114, 31.186431],
      // zooms: [4,18],//设置地图级别范围
      zoom: 13,
      showIndoorMap: true, // 是否在有矢量底图的时候自动展示室内地图，PC端默认是true，移动端默认是false
      rotateEnable: true, // 地图是否可旋转，3D视图默认为true，2D视图默认false
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

    this.renderMapMarker();
    this.renderMapPlugin();
    this.renderMapDW();
  }

  // 为地图注册click事件获取鼠标点击出的经纬度坐标和地址
  renderMapOnClick(e: any) {
    const lng = e.lnglat.getLng();
    const lat = e.lnglat.getLat();
    const lnglatXY = [lng, lat];//地图上所标点的坐标

    console.log(lnglatXY)
    this.mapOnClickMarker = new AMap.Marker({
      offset: new AMap.Pixel(-23, -36),
      position: lnglatXY, // 位置
      content: `<img src="${api_url}/Assert/home/maker.png" style="width:40px;height:40px"/>`
    });
    this.map.add(this.mapOnClickMarker);//添加到地图

    new AMap.service('AMap.Geocoder', () => {
      let geocoder = new AMap.Geocoder({
        city: "", // 地理编码时，设置地址描述所在城市,可选值：城市名（中文或中文全拼）、citycode、adcode,默认值：“全国”
        extensions: "all" // 逆地理编码时，返回信息的详略,默认值：base，返回基本地址信息,取值为：all，返回地址信息及附近poi、道路、道路交叉口等信息
      });
      geocoder.getAddress(lnglatXY, (status: any, result: any) => {
        if (status === 'complete' && result.info === 'OK') {
          //获得了有效的地址信息
          console.log(result)

          const regeocode = result.regeocode,
            formattedAddress = regeocode.formattedAddress,
            { first_name, second_name, direction, distance } = regeocode.crosses[0],
            nearestRoad = regeocode.roads[0],
            pois = regeocode.pois;

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
              mapOnClickCrosses: `${first_name}与${second_name}交叉口，位于所点位置的${direction}方向${distance}米处`,
              mapOnClickRoad: `${nearestRoad.name}，位于所点位置的${nearestRoad.direction}方向${nearestRoad.distance}米处`,
              mapOnClickPois: nearestPois
            }
          });
        }
        else {
          //获取地址失败
          Toast.fail("获取地址失败", 2);
        }
      });
    })
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
      mapOnClickPois = state!.get("mapOnClickPois"),
      isShowMapOnClickModal = state!.get("isShowMapOnClickModal"),
      valueArray = [`${mapOnClickLng},${mapOnClickLat}`, mapOnClickAddress, mapOnClickCrosses, mapOnClickRoad, mapOnClickPois];

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
            this.map.remove(this.mapOnClickMarker);
            dispatch({ type: "home/changeState", data: { isShowMapOnClickModal: false } });
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
        this.map.remove(this.mapOnClickMarker);
        dispatch({ type: "home/changeState", data: { isShowMapOnClickModal: false } });
      }} // 点击 x 或 mask 回调 (): void
    >
      <List>
        {['经纬度:', '详细地址:', '最近路口:', '最近的路:', '附近地点:'].map((item: any, index: number) => (
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

  renderInfoWindowContent(content: string) {
    return `<div>电塔信息</div> <div>${content}</div> <button type="primary" onClick={console.log(1111)}>去这里</button><button type="primary">发布任务</button>`
    {/* <Button>去这里</Button><Button>发布任务</Button> */ }

  }

  renderMapMarker() {
    const MarkerCoordinate = [
      { lng: 116.365072, lat: 39.814797, msg: this.renderInfoWindowContent('二级危险，请马上维修！'), img: 'pylon_danger2' },
      { lng: 121.372394, lat: 31.260471, msg: this.renderInfoWindowContent('最高级危险，请马上维修！'), img: 'pylon_danger3' },
      { lng: 106.562823, lat: 26.628552, msg: this.renderInfoWindowContent('正常！'), img: 'pylon_normal' },
      { lng: 91.138019, lat: 29.650582, msg: this.renderInfoWindowContent('正常！'), img: 'pylon_normal' },
      { lng: 101.731283, lat: 36.710194, msg: this.renderInfoWindowContent('维修中！'), img: 'pylon_repairing' },
      { lng: 113.508626, lat: 34.856564, msg: this.renderInfoWindowContent('巡检中！'), img: 'pylon_checking' },
    ]

    MarkerCoordinate.map(item => {
      let infoWindow = new AMap.InfoWindow({ //创建信息窗体
        // isCustom: true,  //使用自定义窗体
        content: item.msg, //信息窗体的内容可以是任意html片段
        offset: new AMap.Pixel(6, -30)
      });

      let marker = new AMap.Marker({
        offset: new AMap.Pixel(-23, -36),
        position: [item.lng, item.lat], // 位置
        content: `<img src="${api_url}/Assert/home/${item.img}.png" style="width:46px;height:56px"/>`
      });

      let onMarkerClick = e => {
        console.log(e.target.getPosition())
        infoWindow.open(this.map, e.target.getPosition());//打开信息窗体
        //e.target就是被点击的Marker
      }

      marker.on('click', onMarkerClick);//绑定click事件
      this.map.add(marker);//添加到地图
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
        timeout: 10000,          // 超过10秒后停止定位，默认：无穷大
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
        showCircle: true,        // 定位成功后用圆圈表示定位精度范围，默认：true
        circleOptions: { // 定位点Circle的配置，不设置该属性则使用默认Circle样式
          radius: 20, // 圆半径
          fillColor: '#1791fc',   // 圆形填充颜色
          strokeColor: '#FF33FF', // 描边颜色
          strokeWeight: 6, // 描边宽度
          borderWeight: 3,
          strokeOpacity: 0.2,
          fillOpacity: 0.4,
          strokeStyle: 'dashed',
          strokeDasharray: [10, 10],
          // 线样式还支持 'dashed'
          zIndex: 50,
        },
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
        Toast.success(`定位成功:${data.formattedAddress}`, 3)
        // data是具体的定位信息
        console.log(data)
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
        console.log(data)
        Toast.success(`定位失败`, 1)
      }
    })
  }


  // 步行导航
  renderWalkingNavigation() {
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
        if (status === 'complete') {
          console.log(result)
          // dispatch({ type: "home/changeState",
          //   data: {
          //     walkingNavigationStepsCount: result.routes[0].steps.length
          //   }
          // });
          Toast.success('绘制步行路线完成', 2);
        } else {
          Toast.fail('步行路线数据查询失败' + result, 2);
        }
      });
    })
  }

  // 骑行导航
  renderRidingNavigation() {
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
        if (status === 'complete') {
          console.log(result)
          // dispatch({ type: "home/changeState",
          //   data: {
          //     walkingNavigationStepsCount: result.routes[0].steps.length
          //   }
          // });
          Toast.success('绘制骑行路线完成', 2);
        } else {
          Toast.fail('骑行路线数据查询失败' + result, 2);
        }
      });
    })
  }


  // 公交导航
  renderTransferNavigation() {
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
        if (status === 'complete') {
          console.log(result)
          // dispatch({ type: "home/changeState",
          //   data: {
          //     walkingNavigationStepsCount: result.routes[0].steps.length
          //   }
          // });
          Toast.success('绘制公交路线完成', 2);
        } else {
          Toast.fail('公交路线数据查询失败' + result, 2);
        }
      });
    })
  }


  // 驾车导航
  renderDrivingNavigation() {
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
        if (status === 'complete') {
          console.log(result)
          // dispatch({ type: "home/changeState",
          //   data: {
          //     walkingNavigationStepsCount: result.routes[0].steps.length
          //   }
          // });
          Toast.success('绘制驾车路线完成', 2);
        } else {
          Toast.fail('获取驾车数据失败' + result, 2);
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
    this.map.remove(this.mapOnClickMarker); // 删除点击地图展示的marker

    this.walkingNavigation && this.walkingNavigation.clear!(); // 清除规划的路线，clear()函数清除上一次结果，可以清除地图上绘制的路线以及路径文本结果
    this.ridingNavigation && this.ridingNavigation.clear!(); // 清除规划的路线，clear()函数清除上一次结果，可以清除地图上绘制的路线以及路径文本结果
    this.transferNavigation && this.transferNavigation.clear!(); // 清除规划的路线，clear()函数清除上一次结果，可以清除地图上绘制的路线以及路径文本结果
    this.drivingNavigation && this.drivingNavigation.clear!(); // 清除规划的路线，clear()函数清除上一次结果，可以清除地图上绘制的路线以及路径文本结果

    dispatch({ type: "home/changeState", data: { isRemoveNavigation: false, selectedNavigationWay: 0 } });
  }

  render() {
    state!.get("isShowNavigationChoice") ? this.renderNavigation() : (this.isFirstNavigation = true);
    state!.get("isRemoveNavigation") && this.removeNavigation();
    state!.get("isRenderMapOnClick") === 1 ? this.map.on('click', this.bindClickOnMap) // 在地图上绑定点击事件
      : state!.get("isRenderMapOnClick") === 2 && this.map.off('click', this.bindClickOnMap); // 解绑地图上绑定的点击事件

    console.log(state!.toJS())
    return <>
      <HomeComponent />
      {this.renderMapOnClickModalContent()}
    </>
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
let isLoading: any; // 是否正在加载

// export const HomePage = connect(mapStateToProps)(HomeComponent);

export const HomePage = connect(mapStateToProps)((props: any) => {
  dispatch = props.dispatch;
  state = props.home;
  goBack = props.history.goBack;
  isLoading = props.loading.global;
  // console.log(props) // props中有match、location、home(命名空间)、history(goBack、push、go...)、dispatch
  return <Home />
});
