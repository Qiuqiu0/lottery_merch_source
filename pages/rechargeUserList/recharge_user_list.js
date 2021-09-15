// pages/rechargeUserList/recharge_user_list.js
import fetch from '../../utils/serve'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({
  mixins: [require('../../utils/myMixin.js')],
  /**
   * 页面的初始数据
   */
  data: {
    show: false, // 弹窗
    listItem: [], // 数据列表
    searchValue: '', // 搜索数据
    merchId:'',
    amt:0,
    type:'',//3充值管理 1,余额扣费 2，积分扣费
    remark:'',//备注
    userMerchIdObj:{},
    userLabel:'',
    btnTitle:'',
    isDisabled:false,
    userText:'',
    userAmt:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  let {type,merchId}=options;
  let userLabel=type==1?"扣费金额":(type==2?"扣费积分":"充值金额");
  let btnTitle=type==3?"充值":"扣费";
  let userText=type==2?"用户积分":"用户余额";
  wx.setNavigationBarTitle({
    title:type==1?"余额扣费列表":(type==2?"积分扣费列表":"充值管理列表")
  })
    this.setData({
      userLabel,
      type:type,
      merchId:merchId,
      btnTitle,
      userText
    })
    this.getDataItem();
  },
  getDataItem() { // 获取列表
    let data={
      userNameOrPhone: this.data.searchValue,
      merchId:this.data.merchId,
      pageNum:this.data.pageNum,
      pageSize:this.data.pageSize,
    }
    fetch.post('/getLoLotteryUserInfoList.do',data,{'content-type': 'application/json'}).then(res => {
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
 
  handleToPageDetail(e) {
   let {id}=e.currentTarget.dataset;
   fetch.post('/getLoLotteryUserInfo.do',{userId:id}).then(res => {
    let intergralOrPayAmt=this.data.type==3?0:(this.data.type==1?res.balanceAmt:res.balanceIntegral);
    let isDisabled=intergralOrPayAmt>0?false:true;
    let userAmt=this.data.type==2?res.balanceIntegral:res.balanceAmt;
      this.setData({
          show:true,
          userMerchIdObj:res,
          amt:intergralOrPayAmt,
          userAmt,
          isDisabled
        })
  }).catch(err => {
    console.log(err)
  })
  },
  changeAmt(e){
    let isDisabled=e.detail.value>0?false:true;
    this.setData({
      amt:e.detail.value,
      isDisabled
    })
  },
  changeRemark(e){
    this.setData({
      remark:e.detail.value
    })
  },
  onClose() {
    this.setData({ show: false });
  },
  //
  rechargeSure(){
    let tips=this.data.btnTitle;
    Dialog.confirm({
      message:`是否确定${tips}?`,
    })
      .then(() => {
        let url='';
        let data={
        merchantsId:this.data.merchId,
        userId:this.data.userMerchIdObj.userId,
        amt:this.data.amt,
        bz:this.data.remark
        }
        //3，充值管理  1，余额扣费。2积分扣费
        if(this.data.type==3){
          url='/topUp.do';
        }else{
          let obj=this.data.userMerchIdObj;
          let intergralOrPayAmt=this.data.type==1?obj.balanceAmt:obj.balanceIntegral;
          //let tips=this.data.type==1?"扣费不能大于用户的充值余额":"积分扣费不能大于用户的积分余额";
          if(intergralOrPayAmt<this.data.amt){
            wx.showToast({
              icon:'none',
              title:"用户余额不足",
            });
            return;
          }
          url='/deduction.do';
          delete data.bz;
          delete data.amt;
          delete data.merchantsId;
          if(this.data.type==1){
            data.payAmt=this.data.amt;
          }else{
            data.integral=this.data.amt;
          }
          data.merchId=this.data.merchId;
          data.type=this.data.type;
          data.merchCode=obj.merchCode;
          data.merchName=obj.merchName;
          data.userName=obj.userName;
          data.userPhone=obj.userPhone;
          data.userNickname=obj.userNickname;
          data.remark=this.data.remark;
         }
        fetch.post(url,data,{'content-type': 'application/json'}).then(res => {
          let titile=this.data.type==3?"充值成功":(this.data.type==1?"余额扣费成功":"积分扣费成功");
          wx.showToast({
            title:titile,
          })
          setTimeout(()=>{
            wx.navigateTo({
              url: '/pages/index/index',
            })
          },800)
        }).catch(err => {
          console.log(err)
        })
      })
      .catch(() => {
        // on cancel
      });
    
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