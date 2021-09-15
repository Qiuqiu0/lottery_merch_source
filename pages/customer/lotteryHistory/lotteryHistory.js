// pages/customer/lotteryHistory/lotteryHistory.js
import fetch from '../../../utils/serve'
import {formatDay} from '../../../utils/formatDate'
Page({
  mixins: [require('../../../utils/myMixin.js')],
  /**
   * 页面的初始数据
   */
  data: {
    tabItem: [ '全部', '今日', '本周', '本月' ],
    type: '',
    userId: '',
    merchId:'',
    listItem: [],
    timeType:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {type,timeType, userId,merchId} = options
    this.setData({
      type,
      userId,
      merchId,
      timeType
    })
    wx.setNavigationBarTitle({
      title: type == 0 ? '抽奖历史' : '兑奖历史'
    })
    this.getDataItem();
  },
  changeTab(e) { // 标签发生更改
    this.setData({
      timeType: e.detail
    })
    this.resetPageNum();
  },
  getDataItem() {
    let {userId,pageNum,pageSize,timeType, type,merchId} = this.data;
    let params = {isInactive: 0,pageNum,pageSize,type:timeType, userId,merchId};
    params = type == 0 ? params : Object.assign(params, {isConvert: 1})
    fetch.post('/loUserWinningInfo/getLoUserWinningInfoList.do', params,{'content-type': 'application/json'}).then(res => {
        res.data.forEach(item => {
          if(type == 0) {
            item.dateTime = formatDay(item.convertBeginTime) + '至' + formatDay(item.convertEndTime)
          } else {
            item.dateTime = formatDay(item.convertDate)
          }
        })
        this.setDatas(res);
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