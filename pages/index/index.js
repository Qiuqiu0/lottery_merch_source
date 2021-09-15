//index.js
import fetch from '../../utils/serve'
const app = getApp();
Page({
  data: {
     userInfo:{
         merchName:"",//商家名称
         merchLogo:'',//商家logo
         incomeAmt: '',//提现总额
         balanceAmt:'',//提现余额
         sumChangeAmtNowMonth:'', //当月补贴金额
         sumChangeAmtNowDay:'', //当日补贴金额
     },

     applyList:[
       {name:'中奖核销',url:"/pages/businessVerification/business_verification",iconUrl:"../images/prize.png",class:'icon_class1'},
       {name:'核销记录',url:"/pages/writeOffRecord/write_off_record",iconUrl:"../images/write_off.png",class:'icon_class2'},
       {name:'用户管理',url:`/pages/customer/customer`,iconUrl:"../images/user.png",class:'icon_class3'},
       {name:'消费管理',url:"/pages/consumptionManagement/consumption_management",iconUrl:"../images/register.png",class:'icon_class4'},
       {name:'发短信',url:"/pages/customer/customerList/customer_list",iconUrl:"../images/message.png",class:'icon_class5'},
       {name:'余额充值',url:"/pages/rechargeUserList/recharge_user_list",type:3,iconUrl:"../images/recharge.png",class:'icon_class2'},
       {name:'余额扣费',url:"/pages/rechargeUserList/recharge_user_list",type:1,iconUrl:"../images/recharge2.png",class:'icon_class2'},
       {name:'积分扣费',url:"/pages/rechargeUserList/recharge_user_list",type:2,iconUrl:"../images/integral3.png",class:'icon_class2'},
       {name:'商品管理', url:'/pages/commodity/commodity', iconUrl: '../images/goods.png',class:'icon_class3'},
       {name:'店员管理', url:'/pages/addAdmin/addAdmin', iconUrl: '../images/add_admin.png',class:'icon_class2'},
     ]
  },
  //事件处理函数
  onLoad: function () {
      // app.login(({userInfo})=>{
      //       if(userInfo){
      //           this.setData({userInfo});
                
      //       }
      // })

  },
  initData(){
    let data={
      merchId:this.data.userInfo.merchId
    }
    fetch.post('/meMerchants/getMeMerchantsVO.do',data,{'content-type': 'application/json'}).then((res)=>{
        this.setData({
         userInfo:res
        });
        console.log(res.merchLogo);
    }).catch((res)=>{
      console.log(res)
    })
  },
    getPhoneNumber({detail: {encryptedData, iv,errMsg}}) { //授权手机
        console.log(encryptedData)
        console.log(iv)
        if(errMsg==='getPhoneNumber:ok' ){
            this.getTel({encryptedData, iv})
        }
    },
    getTel({encryptedData, iv}) {
        wx.login({
            success: (res)=> {
                if (res.code) {
                    const {code} = res; //code换取token
                    //发起网络请求
                    fetch.post('/merchants/decryptData.do', {data: encryptedData, iv,code}).then(({meMerchantsInfo,meMerchantsUser,token}) => {
                        Object.assign(meMerchantsInfo,meMerchantsUser)
                        this.setData({userInfo:meMerchantsInfo});
                        wx.setStorageSync('token',token)
                        this.initData();
                        wx.setStorageSync("meMerchantsInfo",JSON.stringify(meMerchantsInfo));
                        console.log(meMerchantsUser);
                    }).catch(() => {

                    })
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                }
            }
        });



    },
  //核销记录
  handleToPage(e) {
    let {merchid}=e.currentTarget.dataset;
    let {url,type}=e.currentTarget.dataset.info;
    let path=url;
   if(url=="/pages/customer/customerList/customer_list"){
      path=`${url}?type=1&merchId=${merchid}`;
    }else if(url=='/pages/rechargeUserList/recharge_user_list'){
      path=`${url}?type=${type}&merchId=${merchid}`;
    }else{
      path=`${url}?merchId=${merchid}`;
    }
    console.log(path);
    wx.navigateTo({
      url:path
    });
  },
  //立即提现
  withdrawal:(e)=>{
    wx.showToast({title: '该功能暂未开放', mask: true, icon: 'none', duration: 800});
    //let merchId=e.currentTarget.dataset.merchid;
    // wx.navigateTo({
    //   url: `/pages/withdrawal/withdrawal?merchId=${merchId}`
    // })
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      app.login(({userInfo})=>{
        if(userInfo){
            this.setData({userInfo});
            this.initData();  
        }
    })
    
  },

})
