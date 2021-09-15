// pages/consumptionManagement/consumptionRecord/consumption_record.js
import fetch from '../../../utils/serve';
import util from '../../../utils/util'
let status=0;
Page({
  mixins: [require('../../../utils/myMixin.js')],
  /**
   * 页面的初始数据
   */
  data: {
    detailData:{
      userId:'',
      userNickname:'',
      userName:'',
      userPhone:'',
      birthday:'',
      userAddress:'',
      integral:0,//积分
      cycleDay:0,//周期
      goodsId:'',
      goodsCode:'',
      goodsName:'',
      goodsImg:'',
      goodsDescription:'',
      merchId:'',
      merchCode:'',
      merchName:'',
      payAmt:0,//消费金额
    },
    searchValue:'',
    popupGoodsShow:'',//添加商品层
    goodsName:'',//添加商品名称
    listItem:[],//消费产品列表
    userPhoneList:[],//用户手机号列表
    goodsShow:false,//消费产品列表层
    popupDateShow:false,
    phoneInfoViewShow:false,
    userNameInfoViewShow:false,
    selectedDate:'',//选中的日期
    currentDate: new Date().getTime(),//当前日期
    minDate: new Date(1970, 1, 1).getTime(),
    maxDate: new Date().getTime(),
    isDisabled:false,
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
 
 //保存消费记录
 submitReview(){
  let data=this.data.detailData;
  let keyArr = {
                userName: 'title', 
                userPhone: 'title',
                integral:'',//积分
                cycleDay:'',
                goodsName:'',
                payAmt:''};
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
  fetch.post('/customerPayBook/saveCustomerPayBook.do',data,{'content-type': 'application/json'}).then((res)=>{
    let title='';
    if(status){
      title="修改成功";
    }else{
      title="添加成功";
    }
    wx.showToast({
      title:title,
      icon:'none'
    })
    setTimeout(()=>{
      wx.navigateTo({
        url: '../consumption_management',
      })
    },900);
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
//输入手机号
onClickPhone(e){
  this.setData({
    isDisabled:false,
    "detailData.userName":'',
    "detailData.userNickname":'',
    "detailData.userId":'',
  })
  this.data.detailData.userPhone=e.detail;
  let phoneNum=this.data.detailData.userPhone;
  if(phoneNum.length>3){
    fetch.post('/getLoLotteryUserInfoList1.do',{userPhone:phoneNum,merchId:this.data.detailData.merchId},{'content-type': 'application/json'}).then((res)=>{
      if(res.data.length){
        this.setData({
          userPhoneList:res.data,
          phoneInfoViewShow:true
        })
        if(phoneNum.length==11){//搜索为11位时，默认选中第一条，且用户名称不可修改
          let obj=res.data[0];
          this.setData({
            isDisabled:true,
            "detailData.userPhone":obj.userPhone,
            "detailData.userName":obj.userName,
            "detailData.userNickname":obj.userNickname,
            "detailData.userId":obj.userId,
            "detailData.userAddress":obj.userAddress,
            "detailData.birthday":obj.birthday,
            phoneInfoViewShow:false
          })
        }
      }else{
        this.setData({
          phoneInfoViewShow:false
        })
      }
     
    }).catch();
  }else{
    this.setData({
      phoneInfoViewShow:false
    })
  }
},
//选中手机号
onClickPhoneNum(e){
  let data=e.currentTarget.dataset.userinfo;
  this.setData({
    isDisabled:true,
    "detailData.userPhone":data.userPhone,
    "detailData.userName":data.userName,
    "detailData.userNickname":data.userNickname,
    "detailData.userId":data.userId,
    "detailData.userAddress":data.userAddress,
    "detailData.birthday":data.birthday,
    phoneInfoViewShow:false
  })
},
chanageDate(event){
 this.setData({
   selectedDate:util.dateFormat(event.detail)
 });
},
//点击消费产品
getDataItem(){
  let data={
    merchId:this.data.detailData.merchId,
    pageSize:this.data.pageSize,
    pageNum:this.data.pageNum,
    goodsName:this.data.searchValue,
    goodsAddType:1

  }
  this.setData({
    goodsShow:true, 
    listItem:[]
  });
  fetch.post('/getGoodsInfoList.do',data,{'content-type': 'application/json'}).then((res)=>{
    this.setDatas(res);
 }).catch((res)=>{
   console.log(res)
 })
  
},
handleSearch(e) { // 搜索
  this.setData({
    searchValue: e.detail.value,
    listItem:[]
  })
  this.getDataItem();
},
//添加商品
addGoodsSure(){
  let data={
    goodsName:this.data.goodsName,
    merchId:this.data.detailData.merchId,
    merchCode:this.data.detailData.merchCode,
    merchName:this.data.detailData.merchName,
  }
  let keyArr = {
    goodsName:'',
    merchId:'',
    merchCode:'',
    merchName:''
  };
  let keys = Object.keys(keyArr);
  for(let i = 0; i < keys.length; i++) {
    if(!data[keys[i]]) {
      return false
    }
  }
  fetch.post('/addOrEditGoodsInfo.do',data,{'content-type': 'application/json'}).then((res)=>{
    this.setData({
      popupGoodsShow:false
    })
    wx.showToast({
      title:"添加成功",
      icon:'none'
    })
    setTimeout(()=>{
      this.getDataItem();
    },900);
    
  }).catch();
 
},
//选中商品
checkGoods(e){
  let goodsObj=e.currentTarget.dataset.obj;
  this.setData({
    'detailData.goodsId':goodsObj.goodsId,
    'detailData.goodsCode':goodsObj.goodsCode,
    'detailData.goodsName':goodsObj.goodsName,
    'detailData.goodsImg':goodsObj.goodsImg,
    'detailData.goodsDescription':goodsObj.goodsDescription,
  })
  this.onGoodsClose();
},

 changeInputValue(e) { // 当输入框值发生变化时
  let {key, type}=e.currentTarget.dataset;
  let keys = `detailData.${key}`;
  this.setData({
    [keys]:type!=1?e.detail.value:e.detail
  })
},
changeGoodsName(e){
  this.setData({
    goodsName:e.detail.value
  })
},
 onClose() {
   this.setData({ popupDateShow: false });
 },
 onClose2() {
  this.setData({ popupGoodsShow: false });
},
addGoods(){
  this.setData({ popupGoodsShow: true,goodsName:'' });
},
 checkDate(){
   this.setData({ popupDateShow: true });  
 },
 //商品列表
 onGoodsClose(){
  this.setData({ goodsShow: false }); 
 },
 //查看/修改
 getConsumptionInfo(bookId){
    fetch.post('/customerPayBook/getCustomerPayBookByBookId.do',{bookId:bookId}).then(res=>{
      this.setData({
         detailData:Object.assign(res)
      })
    })
 },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let bookId=options.bookId;
    if(bookId){
      status=1;
      this.getConsumptionInfo(bookId);
    }
   
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
    console.log(data);
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