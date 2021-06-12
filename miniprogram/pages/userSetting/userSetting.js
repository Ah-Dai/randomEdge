// // pages/userSetting/userSetting.js
import {
  onCollectionWhere,
  onCollectionAdd
} from '../../utils/dataset'
import { 
  onNotify, 
  canIRemoveStroage
} from '../../utils/utils'
const app = getApp()

Component({
  data: {
    userInfo: {},
    hasUserInfo: false,
    settingData: [{
      id: 'setArticle',
      name: '赏赐一段文言'
    }, {
      id: 'setImage',
      name: '赏赐一张图'
    }, {
      id: 'set',
      name: '设置'
    }]
  },
  lifetimes: {
    attached(options) {
      if(!canIRemoveStroage('deleteUserInfoTime')){
        return this.setData({
          hasUserInfo: true,
          userInfo: wx.getStorageSync('userInfo')
        })
      }
    }
  },
  methods: {
    getUserProfile(e) {
      const date = new Date();
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
      // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (userProfileRes) => {
          app.globalData.userInfo = userProfileRes.userInfo;
          wx.setStorageSync('userInfo', userProfileRes.userInfo);
          wx.setStorageSync('deleteUserInfoTime', date.setHours(date.getHours() + 3));
          wx.cloud.callFunction({
            name: 'login',
            complete: loginRes => {
              app.globalData.openid = loginRes.result.openid;
              this.getDatasetUser(loginRes.result.openid,userProfileRes.userInfo)
            }
          })
          this.setData({
            userInfo: userProfileRes.userInfo,
            hasUserInfo: true
          })
        }
      })
    },

    getDatasetUser(openid,userInfoData){
      onCollectionWhere('userInfo',{
        _openid: openid
      }).then(res => {
        if(res.length === 0){
          onCollectionAdd('userInfo',{
            userInfoData
          })
        }
      })
    },

    onSkip(e){
      const { target } = e;
      if(canIRemoveStroage('deleteUserInfoTime') && target.dataset.id !== 'set'){
        return onNotify('warning', '请先登录再馈赠于江湖', {
          context: this
        })
      }
      if(target.dataset.id === 'set'){
        return onNotify('warning', '功能正在完善', {
          context: this
        })
      }
      wx.navigateTo({
        url: `../set/set?id=${ target.dataset.id }`,
      })
    }
  }
})