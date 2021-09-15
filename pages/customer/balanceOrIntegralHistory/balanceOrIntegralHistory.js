// pages/customer/consumptionHistory/consumptionHistory.js
import fetch from "../../../utils/serve"
import { format } from "../../../utils/formatDate"
Page({
  mixins: [require('../../../utils/myMixin.js')],
  /**
   * 页面的初始数据
   */
  data: {
    listItem:[],
    userId:'',
    merchId:'',
    type:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { userId,type} = options
    this.setData({
      userId,
      type
    })
    wx.setNavigationBarTitle({
      title: type == 1 ? '余额历史' : '积分历史'
    })
    this.getDataItem();
  },
  getDataItem() {
    let data={
      pageNum:this.data.pageNum,
      pageSize:this.data.pageSize,
      userId:this.data.userId,
      type:this.data.type
    }
    fetch.post("/getMeDeductionBookList.do",data,{'content-type': 'application/json'}).then(res=> {
      res.data.forEach(item => {
        item.updatedTime = format(item.updatedTime);
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