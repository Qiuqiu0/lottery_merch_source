// pages/withdrawal/withdrawal.js
import fetch from '../../utils/serve'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    withdrawalInfo:{},
    withdrawAmt:'',
    merchId:''
  },
  //账户明细
  withdrawalInfo(){
    wx.navigateTo({
      url: '/pages/accountDetails/account_details?merchId='+this.data.withdrawalInfo.merchId　　
    })
  },
  bindKeyInput(e){
    this.setData({
      withdrawAmt:e.detail.value
    })
  },
  //提交申请
  submitReview(){
    if(this.data.withdrawAmt){
      if(this.data.withdrawAmt>this.data.withdrawalInfo.balanceAmt){
        wx.showToast({
          title:'提现金额不能大于可提现金额',
          icon:'none'
        });
        return;
      }
      let data={
        withdrawAmt:this.data.withdrawAmt,
        merchId:this.data.withdrawalInfo.merchId,
        merchName:this.data.withdrawalInfo.merchName,
        merchCode:this.data.withdrawalInfo.merchCode
      }
      fetch.post('/withdrawalController/withdrawalApply.do',data,{'content-type': 'application/json'}).then((res)=>{
        wx.showToast({
          title:'提现申请成功',
          icon:'none'
        });
        this.setData({
          withdrawAmt:''
        });
        setTimeout(()=>{
          this.initData();
        },800);
       
      }).catch((res)=>{
        console.log(res)
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onClick(){
    this.setData({
      withdrawAmt:this.data.withdrawalInfo.balanceAmt
    })
  },
  onLoad: function (options) {
   this.setData({
     merchId:options.merchId
   })
   this.initData();
    
  },
  initData(){
    let data={
      merchId:this.data.merchId
    }
    fetch.post('/meMerchants/getMeMerchantsVO.do',data,{'content-type': 'application/json'}).then((res)=>{
      let withdrawalInfo=res;
        this.setData({
          withdrawalInfo
        });
    }).catch((res)=>{
      console.log(res)
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
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})