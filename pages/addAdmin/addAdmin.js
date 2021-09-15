// pages/addAdmin/addAdmin.js
import fetch from '../../utils/serve';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData:{
      // merchCode:'',
      // merchId:'',
      // merchName:'',
      name:'',
      phoneNumber:'',
      workNumber:'',
    },
  },
  //保存会员
  submitReview(){
    let data=this.data.detailData;
    // let keyArr = {name: 'title', };
    // let keys = Object.keys(keyArr);
    // for(let i = 0; i < keys.length; i++) {
    //   if(!data[keys[i]]) {
    //     wx.showToast({
    //       icon:"none",
    //       title: '请填写完整信息',
    //     })
    //     return false
    //   }
    // }
    if(data.name=="" || data.name==null){
      wx.showToast({
        icon:"none",
        title: '请填写店员名称',
      })
      return false
    }
    fetch.post('/meMerchants/saveAssistant.do',data,{'content-type': 'application/json'}).then((res)=>{
      wx.showToast({
        title:'添加成功',
        icon:'none'
      })
      setTimeout(()=>{
        wx.navigateTo({
          url: '../index/index',
        },1000)
      })
    }).catch();
  },

changeInputValue(e) { // 当输入框值发生变化时
  let key=e.currentTarget.dataset.key;
  let keys = `detailData.${key}`;
  this.setData({
    [keys]:e.detail
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // let data= JSON.parse(wx.getStorageSync("meMerchantsInfo"));
    // this.setData({
    //   'detailData.merchId':data.merchId,
    //   'detailData.merchCode':data.merchCode,
    //   'detailData.merchName':data.merchName,
    // })
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
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})