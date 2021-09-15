//app.js
import fetch from './utils/serve'
require('./utils/mixins')
App({
  onLaunch: function () {


  },
  globalData: {
  },
  login(cb){
    wx.login({
      success: (res)=> {
        if (res.code) {
          const {code} = res; //code换取token
          //发起网络请求
          fetch.post('/login/loginByWX.do',{code}).then(({token,meMerchantsInfo=null,meMerchantsUser=null})=>{
            wx.setStorageSync('token',token)
            if(meMerchantsInfo){
              wx.setStorageSync("meMerchantsInfo",JSON.stringify(meMerchantsInfo));
               Object.assign(meMerchantsInfo,meMerchantsUser);
            }
            cb({token,userInfo:meMerchantsInfo});

          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)

        }
      }
    });
  }
})
