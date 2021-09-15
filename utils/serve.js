//const API = 'http://10.22.108.210:8082' //登录测试地址
//const API = 'http://10.22.108.132:8181'
const API = 'https://shoppingtest.zjmiec.cn/lottot/merchants'  


function fetch(url, type = 'get', data, header) {
    if(url.indexOf("getLoLotteryUserInfoList")==-1){
        wx.showLoading({
            title: ''
        })
    }
    return new Promise(function (resolve, reject) {
        let token = wx.getStorageSync('token') || "";
        // let token = 'a43c8988e6824866a42ab3552c99387a';
        // 'content-type': 'application/json'
        let head = {'content-type': 'application/x-www-form-urlencoded', token}
        if (header) {
            Object.assign(head, header);
        }
        let request = {
            url: API + url,
            data: data,
            method: type,
            dataType: "json",
            header: head,
            success: function (res) {
                let {data, code, message,total} = res.data;
                if (code === "success" || code === "warnning") {         
                    if(total || total==0){
                        resolve({data,total})
                    }else{
                        resolve(data)
                    }
                } else {
                    if (code === "1000" || code === "-100") { //未登录 token未检测到
                        wx.showToast({title: '请先到首页登录', mask: true, icon: 'none', duration: 800});
                        setTimeout(()=>{
                            wx.redirectTo({url: "/pages/index/index"});
                        },1000)
                    } else if (code === "fail") {
                        setTimeout(()=>{
                            wx.showToast({title: message, mask: true, icon: 'none', duration: 1000});
                        })
                    }
                    reject(code,message);
                }
                wx.hideLoading();
            },
            fail: reject,
            complete:function(){
                wx.hideLoading();
            }
        }
        wx.request(request);
    })

}

module.exports = {
    "get": function (url, data, header) {
        return fetch(url, "GET", data, header);
    },
    "post": function (url, data, header) {
        return fetch(url, "POST", data, header);
    }
};
