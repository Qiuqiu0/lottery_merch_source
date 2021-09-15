// pages/customer/customerDetail/customerDetail.js
import fetch from '../../../utils/serve'
Page({
  mixins: [require('../../../utils/scrollMixin.js')],
  /**
   * 页面的初始数据
   */
  data: {
    show: false, // 是否显示个签删除按钮
    customerShow: false, // 个签相关客户弹窗
    id: '',
    detailData: {}, // 客户详情信息
    labelItem: [], // 个性标签列表
    showLabel: false, // 个签添加弹窗
    tagName: '', // 标签名称
    activeTagName: '', // 点击的标签名称
    popupItem: [],
    merchLabelItem: [] ,// 商户标签列表
    pageNum:1,
    levelList:[
      {
        text:"青铜",
        value:1
      },
      {
        text:"白银",
        value:2
      },
      {
        text:"黄金",
        value:3
      },
      {
        text:"铂金",
        value:4
      },
      {
        text:"钻石",
        value:5
      },
    ],//用户等级（1：青铜 2：白银 3：黄金 4：铂金 5：钻石）
    checkValue:1,//选中等级
    type:0,
    checkArr:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getDetailData();
    this.getLabelData();
  },
  //改变用户等级
  onChangeUserlevel(e){
    let data={
      userId:this.data.detailData.userId,
      merchantsId:this.data.detailData.merchId,
      userLevel:e.detail
    }
    fetch.post('/editUserLevel.do', data,{'content-type': 'application/json'}).then(res => {
      wx.showToast({
        title: '等级修改成功',
      })
      setTimeout(()=>{
        this.getDetailData();
      },800)

    })
  },
  onClick(e) {
    let { type, address, name, item } = e.currentTarget.dataset;
    switch(type){
      case 'close': // 关闭爱车达人弹窗
        this.setData({ customerShow: false })
        break;
      case 'show': // 打开爱车达人弹窗
        this.getLabelUserData(item);
        this.setData({
          customerShow: true,
          activeTagName: item.tagName
        })
        break;
      case 'tagName': // 选择个性标签
        this.setData({
          tagName: name,
        })
        // this.getLabelData();
        break;
      // case 'map': // 地图详细信息
      //   wx.navigateTo({
      //     url: '/pages/map/map?address=' + address
      //   });
      //   break;
      case 'label':
        this.setData({// 关闭新增个签弹窗
          showLabel: false
        })
        break;
      case 'add': // 打开新增个签弹窗
        this.setData({
          showLabel: true
        })
        break;
      case 'send': // 新增个签
        this.handleAdd();
        break;
      case 'detail': // 点击爱车达人列表
        wx.redirectTo({
          url: `/pages/customer/customerDetail/customerDetail?id=${item.userId}`
        })
        break;
      default:
        this.setData({
          show: false
        })
    }
  },
  onChange(e) { // 标签信息变化
    console.log(e)
    this.setData({
      tagName: e.detail
    })
    this.resetPageNum(this.getLabelData)
  },
  handleBindscrolltolowerTag() {
    this.handleBindscrolltolower(this.getLabelData)
  },
  handleBindscrolltolowerUser() {
    this.handleBindscrolltolower(this.getLabelUserData)
  },
  handleLongPress() { // 长按打开删除图标
    this.setData({
      show: true
    })
  },
  handleAdd() { // 添加标签
    let {id, detailData, tagName} = this.data;
    fetch.post('/tagController/addUserTag.do',
      {tagName, merchId: detailData.merchId, userId: id},{'content-type': 'application/json'}
    ).then(res => {
      this.getDetailData();
      this.setData({
        showLabel: false
      })
    })
  },
  delLabel(e) { // 删除个性标签列表
    let { item } = e.currentTarget.dataset;
    fetch.post('/tagController/delUserTag.do', item).then(res => {
      this.getDetailData();
    })
  },
  getLabelData() { // 获取个性标签列表
    let { pageNum, tagName } = this.data;
    fetch.post('/tagController/getTagList.do', { tagName, pageNum, pageSize: 20  },{'content-type': 'application/json'}).then(res => {
      // console.log(res)
      // this.setData({
      //   popupItem: res.data
      // })
      this.setDatas(res, 'popupItem');
    })

  },
  getLabelUserData(info) { // 获取个性标签用户
    this.setData({
      merchLabelItem:[]
    });
    let data={
      merchId:info.merchId,
      tagId:info.tagId,
      pageNum:this.data.pageNum,
      pageSize:20
    }
    fetch.post('/tagController/getTagUserList.do', data,{'content-type': 'application/json'}).then(res => {
      this.setDatas(res, 'merchLabelItem');
    })
  },
  getDetailData() { // 获取详情信息
    fetch.post('/getLoLotteryUserInfo.do', {userId: this.data.id}).then(res => {
      this.setData({
        detailData: res,
        labelItem:res.meUserTagList,
        checkValue:res.userLevel
      });
      console.log(this.data.checkValue);
    })
  },
  checkdUser(e){
    let {type}=e.currentTarget.dataset;
    this.setData({
      type:type=="checked"?1:0
    })
  },
  onChange2(e) {
    let { index, type } = e.currentTarget.dataset;
    let { merchLabelItem } = this.data;
    if(type == 'all') {
      merchLabelItem.forEach(item => {
        item.checked = e.detail
      })
      let checkList =merchLabelItem.filter(item => {return !item.checked});
      this.setData({
        checked: e.detail,
        merchLabelItem,
        checkArr:JSON.stringify(checkList)
      })
    } else {
      merchLabelItem[index].checked = e.detail
      let checkList=merchLabelItem.filter(item => {return !item.checked});
      let checkArr =JSON.stringify(checkList);
      this.setData({
        merchLabelItem,
        checked: checkList.length > 0 ? false : true,
        checkArr
      });
    }
  },
  onClickHide(e){
    let checkList=this.data.merchLabelItem.filter(item => {return !item.checked})
  let checkArr =JSON.stringify(checkList);
  this.setData({show:checkList.length > 0 ? true : false,checkArr})
  }


})
