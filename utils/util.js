const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const phoneReg = (value) => {
  const reg = /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[35678]\d{2}|4(?:0\d|1[0-2]|9\d))|9[189]\d{2}|66\d{2})\d{6}$/
  return reg.test(value)
}
function setTime(value){
  if (value == null || value == '') {
    return ''
  } else {
    const date = new Date(value) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    const Y = date.getFullYear() + '-'
    const M =
        (date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1) + '-'
    const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    const h =
        date.getHours() < 10
            ? '0' + date.getHours() + ':'
            : date.getHours() + ':'
    const m =
        date.getMinutes() < 10
            ? '0' + date.getMinutes() + ':'
            : date.getMinutes() + ':'
    const s =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return Y + M + D + ' ' + h + m + s
  }
}
//日期转换问题
function dateFormat(value){
  let val=new Date(value);
  let year = val.getFullYear();
  let month = val.getMonth() + 1;
  let dey = val.getDate() < 10 ? '0' + val.getDate() : val.getDate();
  if (month >= 1 && month <= 9) { month = `0${month}` };
  return `${year}-${month}-${dey}`;
 }
module.exports = {
  formatTime,phoneReg,setTime,dateFormat
}
