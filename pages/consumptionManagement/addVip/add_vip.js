// pages/consumptionManagement/addVip/add_vip.js
import fetch from '../../../utils/serve';
import util from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData:{
      merchCode:'',
      merchId:'',
      merchName:'',
      userName:'',
      userPhone:'',
      birthday:'',
      userAddress:'',
    },
    selectedDate:'',//选中的日期
    currentDate: new Date().getTime(),//当前日期
    minDate: new Date(1970, 1, 1).getTime(),
    maxDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }else if (type === 'day') {
        return `${value}日`;
      }
      return value;
    },
  },
  //保存会员
  submitReview(){
    let data=this.data.detailData;
    let keyArr = {userName: 'title', 
                  userPhone: 'title'
                };
    let keys = Object.keys(keyArr);
    for(let i = 0; i < keys.length; i++) {
      if(!data[keys[i]]) {
        wx.showToast({
          icon:"none",
          title: '请填写完整信息',
        })
        return false
      }
    }
    fetch.post('/saveLoLotteryUserInfo.do',data,{'content-type': 'application/json'}).then((res)=>{
      wx.showToast({
        title:'添加成功',
        icon:'none'
      })
      setTimeout(()=>{
        wx.navigateTo({
          url: '../vipList/vip_list',
        },1000)
      })
    }).catch();
  },
//选择年月确认
confirmPicker(){
  let birthday=this.data.selectedDate;
   this.setData({
     'detailData.birthday':birthday,
     popupDateShow:false
   })
},
chanageDate(event){
  this.setData({
    selectedDate:util.dateFormat(event.detail)
  });
 },
changeInputValue(e) { // 当输入框值发生变化时
  let key=e.currentTarget.dataset.key;
  let keys = `detailData.${key}`;
  this.setData({
    [keys]:e.detail
  })
},
 onClose() {
   this.setData({ popupDateShow: false });
 },
 checkDate(){
   this.setData({ popupDateShow: true });  
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
    let data= JSON.parse(wx.getStorageSync("meMerchantsInfo"));
    this.setData({
      'detailData.merchId':data.merchId,
      'detailData.merchCode':data.merchCode,
      'detailData.merchName':data.merchName,
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