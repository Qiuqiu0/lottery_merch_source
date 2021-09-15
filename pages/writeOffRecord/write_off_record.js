// pages/writeOffRecord/write_off_record.js
import fetch from '../../utils/serve';
import util from '../../utils/util';
Page({
  mixins: [require('../../utils/myMixin.js')],
  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    navList:[
      {index:0,title:'已核销',type:0},
      {index:0,title:'未核销',type:1},
      {index:0,title:'已过期',type:1},
    ],
    merchId:'',
    listItem:[],//已核销
    convertDateMonth:'',//核销日期
    popupDateShow:false,
    currentDate: new Date().getTime(),//最后选中得日期
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
 //选择年月确认
 confirmPicker(){
   var that = this;
    this.setData({
      convertDateMonth:that.data.selectedDate,
      isMore:false,
      listItem:[]
      
    });
   this.getDataItem();
   this.setData({ popupDateShow: false });
    
 },
 chanageDate(event){
  this.setData({
    selectedDate:this.dateFormat(event.detail)
  });
 },
 //时间转换问题
 dateFormat(date){
  let val=new Date(date);
  let year = val.getFullYear();
  let month = val.getMonth() + 1;
  if (month >= 1 && month <= 9) { month = `0${month}` };
  return `${year}-${month}`;
 },
  onClose() {
    this.setData({ popupDateShow: false });
  },
  checkDate(){
    this.setData({ popupDateShow: true });  
  },
  //标签切换
  onChange(event) {
    let index=event.detail.index;
    this.setData({
      navIndex:index,
      listItem:[]
    })
    this.getDataItem();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let date=new Date().getTime();
    this.setData({ 
      convertDateMonth:this.dateFormat(date),
      merchId:options.merchId
    });
    this.getDataItem();
  },
  
  //查询类型（0：已核销 1：未核销 2：已过期）
  //已核销数据
  getDataItem(){
    let keys=['convertDateMonth','winningDateMonth','winningDateMonth'];
    let data={
      selectType:this.data.navIndex, //查询类型
      pageNum:this.data.pageNum,
      pageSize:this.data.pageSize,
      [keys[this.data.navIndex]]:this.data.convertDateMonth,
      merchId:this.data.merchId
      //时间查询
     }
     fetch.post('/loUserWinningInfo/getLoUserWinningInfoList.do',data,{'content-type': 'application/json'}).then((res)=>{   
      res.data.forEach(it => {
          let winDate=new Date(it.winningDate);
          it.winningDate=util.formatTime(winDate);
          let convertDate=new Date(it.convertDate);
          it.convertDate=util.formatTime(convertDate);
          let convertEndTime=new Date(it.convertEndTime);
          it.convertEndTime=util.formatTime(convertEndTime);
        });
        this.setDatas(res);
       
       
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
  // onReachBottom: function () {
  //   if( this.data.total ==this.data.listItem.length) {
  //     let page=this.data.pageNum+1;
  //     this.setData({
  //       pageNum:page
  //     })
  //     this.getDataItem();
  //   }else{
  //     this.setData({
  //       isMore:true
  //     })
  //   }
     
  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})