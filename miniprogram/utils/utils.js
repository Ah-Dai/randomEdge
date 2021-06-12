import Notify from '../miniprogram_npm/@vant/weapp/notify/notify';
import Toast from '../miniprogram_npm/@vant/weapp/toast/toast';

export function onNotify(type, message, obj = {}){
  let new_obj = Object.assign({ 
    type, 
    message,
    duration: 1000
  }, obj)
  return Notify(new_obj)
}

export function onToast(type, message, obj = {}){
  let new_obj = Object.assign({ 
    type, 
    message,
    duration: 1000
  }, obj)
  return Toast(new_obj)
}

export function canIRemoveStroage(key){
  const date = new Date();
  const storage = wx.getStorageSync(key);
  // 当前时间要大于等于缓存的时间值才需要再次获取或者上传数据
  if(date.getTime() >= storage){
    return true
  }
  // 反之则使用缓存值来进行判断或者赋值
  return false
}

export function onGetNowDate(){
  const now_date = new Date();
  const month = now_date.getMonth() + 1;
  const day = now_date.getDate();
  return {
    month,
    day: day > 9 ? day : supplementZero(day, undefined, 'left')
  }
}

function supplementZero(value = '', digits = 2, direction = 'right'){
  const typeofValue = typeof value;
  let new_value = value.toString();
  let zero = Array(digits).join(0);
  if(!value || typeofValue !== "number" && typeofValue !== "string"){
    console.log("错误值")
  }
  if(direction === 'left'){
    return zero + new_value
  }
  return new_value + zero
}