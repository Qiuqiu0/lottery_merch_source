// pages/accountDetails/account_details.js
import fetch from '../../utils/serve';
import util from '../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    monthList:[],//所有月份
    detailsData:[],//明细
    merchId:'',
    itemData:[],
    total:0,
    pageNum:1,
    pageSize:10,
    noMore:false,
    isShowNull:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let {merchId}=options;
    this.setData({
      merchId
    })
    this.getMonthList();
    
  },
  getMonthList(){
    const endDate = new Date();
    let endTime=endDate.getTime();
    let beginTime=endDate.setFullYear(endDate.getFullYear() - 1);
    let data={
      merchId:this.data.merchId,
      beginTime:beginTime,
      endTime:endTime,
    }
    fetch.post('/meMerchants/getMeMerchantsAmtBookMonthList.do',data,{'content-type': 'application/json'}).then((res)=>{
      this.setData({
        monthList:res.data
      })
      //console.log(res);
      this.getDetails();
    });
  },
  //获取明细
  getDetails(){
    let data={
      pageNum:this.data.pageNum,
      pageSize:this.data.pageSize,
      merchId:this.data.merchId
    }
    fetch.post('/meMerchants/getMeMerchantsAmtBookList.do',data,{'content-type': 'application/json'}).then((res)=>{
      let aryy=[];
      let detailsData = this.data.detailsData.concat(res.data);
      if(detailsData.length){
        this.data.monthList.forEach(item=>{
          let  object=new Object();
          object.outAmt=item.outAmt;
          object.inAmt=item.inAmt;
           object.month=item.month;
           object.detail=[];
           detailsData.forEach(it=>{
            if(item.month==it.changePeriod){
              it.changeDate=util.setTime(it.changeDate);
              object.detail.push(it);
            }
          })
          aryy.push(object);
       });
       this.setData({
         itemData:aryy,
         total:res.total,
         detailsData,
        
       })
      }else{
        this.setData({
          isShowNull:true
        })
      }
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
  onReachBottom: function () {
    if(this.data.detailsData.length==this.data.total){
      this.setData({
        noMore:true
      })
    }else{
      let page=this.data.pageNum+1;
      this.setData({
        pageNum:page
      })
      this.getDetails();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})