// pages/consumptionManagement/vipList/vip_list.js
import fetch from '../../../utils/serve'
Page({
  mixins: [require('../../../utils/myMixin.js')],
  /**
   * 页面的初始数据
   */
  data: {
    listItem: [], // 数据列表
    searchValue: '', // 搜索数据
    merchId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  handleToPageDetail(e){
    let {userid}=e.currentTarget.dataset;
    let merchId=this.data.merchId;
    wx.navigateTo({
      url: `/pages/customer/consumptionHistory/consumptionHistory?userId=${userid}&merchId=${merchId}`,
    })
  },
  onClick(){
    wx.navigateTo({
      url: '../addVip/add_vip',
    })
  },
  onLoad: function (options) {
    this.setData({
      merchId:options.merchId
    })
    this.getlistItem();
  },
  getlistItem() { // 获取列表
    let data={
      userName: this.data.searchValue,
      merchId:this.data.merchId,
      pageSize:this.data.pageSize,
      pageNum:this.data.pageNum
    }
    fetch.post('/getLoLotteryUserInfoList.do',data,{'content-type': 'application/json'}).then(res => {
      this.setDatas(res);
    }).catch(err => {
      console.log(err)
    })
  },
  handleSearch(e) { // 搜索
    this.setData({
      searchValue: e.detail.value
    })
    this.getlistItem();
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