
// pages/consumptionManagement/consumption_management.js
import fetch from '../../utils/serve';
import util from '../../utils/util'
Page({
  mixins: [require('../../utils/myMixin.js')],
  /**
   * 页面的初始数据
   */
  data: {
    userItem:[],
    labelData: [
      {
        id:1,
        title:'今日概况',
        label1:'今日客户(人)',
        label2:'今日金额(元)',
        label3:'客单价(元)',
      },
      {
        id:2,
        title:'本周概况',
        label1:'本周客户(人)',
        label2:'本周金额(元)',
        label3:'客单价(元)',
      },
      {
        id:3,
        title:'本月概况',
        label1:'本月客户(人)',
        label2:'本月金额(元)',
        label3:'客单价(元)'
      },
    ],
    listItem:[],
    merchId:'',
    indicatorDots: false,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    popupDateShow:false,
    currentDate: new Date().getTime(),//最后选中得日期
    payDateMonth:'',//记录查询日期
    selectedDate:"",//弹窗里改变得日期
    minDate: new Date(2019, 0, 1).getTime(),
    navIndex:0,//当前标签页
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
  },

  //概况查询
  initPaySituation(){
    let merchId=this.data.merchId;
    fetch.post('/customerPayBook/getCustomerPaySituation.do',{merchId}).then(res => {
        if(res.length){
          this.setData({
            userItem: res
          })
        }
    }).catch(err => {
      console.log(err)
    })
  },
  //消费记录列表查询
  getDataItem(){
    let data={
      pageSize:this.data.pageSize,
      pageNum:this.data.pageNum,
      merchId:this.data.merchId,
      payDateMonth:this.data.payDateMonth
    }
    fetch.post('/customerPayBook/getCustomerPayBookList.do',data,{'content-type': 'application/json'}).then(res => {
      res.data.forEach(element => {
        element.payTime=util.setTime(element.payTime);
      });
      this.setDatas(res);
      
  }).catch(err => {
    console.log(err)
  })
  },
  //查看详情，修改
  onDetail(e){
    let bookId=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './consumptionRecord/consumption_record?bookId='+bookId
    })
  },
  //选择年月确认
 confirmPicker(){
   this.setData({
    payDateMonth:this.data.selectedDate
   });
   this.setData({ popupDateShow: false,listItem:[] });
   this.getDataItem();
   
},
chanageDate(event){
 this.setData({
   selectedDate:this.dateFormat(event.detail)
 });
},
onClose() {
  this.setData({ popupDateShow: false });
},
checkDate(){
  this.setData({ popupDateShow: true });  
},
//时间转换问题
dateFormat(date){
 let val=new Date(date);
 let year = val.getFullYear();
 let month = val.getMonth() + 1;
 if (month >= 1 && month <= 9) { month = `0${month}` };
 return `${year}-${month}`;
},
  onShareAppMessage() {
    return {
      title: 'swiper',
      path: 'page/component/pages/swiper/swiper'
    }
  },
//选择会员
  checkVip(){
    wx.navigateTo({
      url: './vipList/vip_list?merchId='+this.data.merchId,
    })
  },
  //消费登记
  onClick(){
    wx.navigateTo({
      url: './consumptionRecord/consumption_record',
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
    let merchData=JSON.parse(wx.getStorageSync("meMerchantsInfo"));
    let date=new Date().getTime();
    this.setData({ 
      payDateMonth:this.dateFormat(date),
      merchId:merchData.merchId
    });
    this.initPaySituation();
    this.getDataItem();
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