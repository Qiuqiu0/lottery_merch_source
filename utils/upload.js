const URL = "https://shoppingtest.zjmiec.cn/lottot/platform";
// const URL = "http://10.22.108.210:8083";

function uploadOne(event, cb) {
  const { file } = event.detail;
  // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
  wx.uploadFile({
    url: URL + '/oss/uploadOss.do', // 接口地址
    filePath: file.url,
    name: 'file',
    formData: { user: 'test' },
    header: {
      token: wx.getStorageSync('token')
    },
    success(res) {
      // 上传完成需要更新 fileList
      let { filePath } = JSON.parse(res.data).data;
      cb(filePath)
    },
  });
}

function uploadMore(event, cb) {
  const { file } = event.detail;
  let promise = Promise.all(file.map(item => {
    return new Promise(function(resolve, reject) {
      wx.uploadFile({
        url: URL + '/oss/uploadOss.do', // 接口地址
        filePath: item.url,
        name: 'file',
        formData: { user: 'test' },
        header: {
          token: wx.getStorageSync('token')
        },
        success(res) {
          // 上传完成需要更新 fileList
          resolve(JSON.parse(res.data).data.filePath);
        },
      });
    })
  }))
  promise.then(res => {
    cb(res)
  }).catch(err => {
    console.log(err);
  });
}

module.exports = {
	uploadOne,
  uploadMore
}