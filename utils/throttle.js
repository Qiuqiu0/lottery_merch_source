module.exports = {
    throttleFunc: function throttleFunc(func, marginTime) {
      if (marginTime == undefined || marginTime == null) {
        marginTime = 1700
      }
      let lastTime = null
      return function () {
        let currentTime = + new Date()
        if (currentTime - lastTime > marginTime || !lastTime) {
          func.apply(this, arguments)
          lastTime = currentTime
        }
      }
    },
    debounceFn: function debounceFn(fn, wait) {
      let timer;
      return function () {
          clearTimeout(timer);
          timer = setTimeout(() => {
              fn.apply(this, arguments)   // 把参数传进去
          }, wait);
      }
    }
  }
