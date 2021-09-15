import fetch from '../../../utils/serve'
import {formatDay} from '../../../utils/formatDate'
Page({
  mixins: [require('../../../utils/myMixin.js')],
  /**
   * 页面的初始数据
   */
  data: {
    show: false, // 商品配置弹窗
    listItem: [], // 数据列表
    searchValue: '', // 搜索数据
    type: '', // 判断是否发送短信( 1： 是)
    checked: false,
    merchId:'',
    userType:'',//查用户
    levelList:["青铜","白银","黄金","铂金","钻石"],
    tabItem: [ '全部', '今日', '本周', '本月' ],
    checkArr:'',//选择的数据

     //用户等级（1：青铜 2：白银 3：黄金 4：铂金 5：钻石）
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  let {type,merchId,userType}=options;
    this.setData({
      type:type,
      merchId:merchId,
      userType:userType
    })
    this.getDataItem();
  },
  changeTab(e) { // 标签发生更改
    this.setData({
      userType: e.detail
    })
    this.resetPageNum();
  },
  getDataItem() { // 获取列表
    let data={
      userNameOrPhone: this.data.searchValue,
      merchId:this.data.merchId,
      pageNum:this.data.pageNum,
      pageSize:this.data.pageSize,
      type:this.data.userType
    }
    fetch.post('/getLoLotteryUserInfoList.do',data,{'content-type': 'application/json'}).then(res => {
      res.data.forEach(item => {
        item.checked = false
      })
      res.data.forEach(item=>{
        item.payTimeLast = formatDay(item.payTimeLast);
      })
      this.setDatas(res);
    }).catch(err => {
      console.log(err)
    })
  },
  
  handleSearch(e) { // 搜索
      this.setData({
        searchValue: e.detail.value,
        listItem:[]
      })
      this.getDataItem();
 
   
  },
  //添加会员
  onClick(e) {
    //let { type } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../sendMessage/sendMessage',
    })
  },
  onClickHide(e){
    let {type}=e.currentTarget.dataset;
    switch(type) {
      case 'checkGoods': // 商品选择
      let checkList=this.data.listItem.filter(item => {return !item.checked})
      let checkArr =JSON.stringify(checkList);
        this.setData({show:checkList.length > 0 ? true : false,checkArr})
        break;
      case 'close': // 关闭弹窗
        this.setData({
          show: false
        })
        break;
      case 'confrim':

        break;
    }  
  },
  checkdUser(e){
    let {type}=e.currentTarget.dataset;
    this.setData({
      type:type=="checked"?1:0
    })
  },
  onChange(e) {
    let { index, type } = e.currentTarget.dataset;
    let { listItem } = this.data;
    if(type == 'all') {
      listItem.forEach(item => {
        item.checked = e.detail
      })
      let checkList=this.data.listItem.filter(item => {return !item.checked})
      let checkArr =JSON.stringify(checkList);
      this.setData({
        checked: e.detail,
        listItem,
        
        checkArr
        
      })
    } else {
      listItem[index].checked = e.detail
      let checkList=this.data.listItem.filter(item => {return !item.checked})
      let checkArr =JSON.stringify(checkList);
      this.setData({
        listItem,
        checked: checkList.length > 0 ? false : true,
        checkArr
      });
    }
  },
  handleToPageDetail(e) {
    let {id, type} = e.currentTarget.dataset
    if(type != 1) {
      wx.navigateTo({
        url: `/pages/customer/customerDetail/customerDetail?id=${id}`
      });
    }
  },
  handleToPage(e){
    let {id,type}=e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/customer/balanceOrIntegralHistory/balanceOrIntegralHistory?type=${type}&userId=${id}`
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})