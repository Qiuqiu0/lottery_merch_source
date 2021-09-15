// pages/businessVerification/business_verification.js
import fetch from '../../utils/serve'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    errorShow:false,
    winningInfo:{},
    winningCode:'',
    showView:false,
    errorTips:'',
    merchId:'',
  },
  //扫码
  scanCodes(){
    let that=this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success (res) {
        if(res.errMsg=="scanCode:ok"){
          that.setData({
            winningCode:res.result
          })
          that.initData();
        }
      },
      fail(e){
        console.log(e);
      }
})
  },
  //核销
  showPopup() {
    let data={
      winningCode:this.data.winningCode,
      winningId:this.data.winningInfo.winningId
    }
    fetch.post('/cancelAfterVerification/doCancelAfterVerification.do',data,{'content-type': 'application/json'}).then((res)=>{
      this.setData({ 
         show:true,
         winningInfo:{},
         showView:false,
         winningCode:''

      })
   }).catch((res)=>{
     console.log(data)
   })
   
  },
  onClose() {
    this.setData({ show: false });
  },
  onClickHide() {
    this.setData({ errorShow: false });
  },
  //
  bindKeyInput(e){
    this.setData({
      winningCode: e.detail.value
    })
    if(this.data.winningCode.length>11){
      this.initData();
    }
  },
  initData(){
    let data={
      winningCode:this.data.winningCode,
      merchId:this.data.merchId,
    }
    fetch.post('/loUserWinningInfo/getLoUserWinningInfo.do',data,{'content-type': 'application/json'}).then((res)=>{
       if(JSON.stringify(res) !="{}"){
          let winningInfo=res;
          this.setData({
            winningInfo,
            showView:true
          })
       }else{
        wx.showToast({
          title:'暂无数据',
          icon:'none'
        })
       }
       
    }).catch((res)=>{
      console.log(res)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
  },
    //核销/cancelAfterVerification/doCancelAfterVerification.do
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let merchData=JSON.parse(wx.getStorageSync("meMerchantsInfo"));
    this.setData({
      merchId:merchData.merchId
    })
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