// pages/home/home.js
import {
  onCollectionCount,
  onGetCollectionSkipLimit
} from '../../utils/dataset'
import {
  onToast,
  canIRemoveStroage
} from '../../utils/utils'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

Component({
  data: {
    article: {}
  },
  lifetimes: {
    attached() {
      onToast('loading', '加载中...', {
        context: this,
        duration: 0
      });
      if(canIRemoveStroage('canIclearArticle')){
        const tasks = [onCollectionCount('imageId'), onCollectionCount('userArticle')];
      Promise.all(tasks).then(res => {
        const key = ['imageId', 'userArticle'];
        const getTasks = [];
        res.forEach((item, index) => {
          let skip = Math.round(Math.random() * item.total);
          if(item.total === skip){
            skip -= 1;
          }
          getTasks.push(onGetCollectionSkipLimit(key[index], skip))
        });
        Promise.all(getTasks).then(getTasksRes => {
          let article = {};
          const date = new Date();
          wx.setStorageSync('canIclearArticle', date.setDate(date.getDate() + 1))

          getTasksRes.forEach(item => {
            article = {...article, ...item}
          })
          wx.cloud.downloadFile({
            fileID: article.imgId,
            success: imgFileRes => {
              Toast.clear();
              const { tempFilePath } = imgFileRes;
              article = {...article, tempFilePath};
              wx.setStorageSync('article', article);
              this.setData({
                article
              })
            }
          })
        })
      })
      }else{
        setTimeout(() => {
          Toast.clear();
          this.setData({
            article: wx.getStorageSync('article')
          })
        }, 500)
      }
    }
  },

  methods: {
    previewImg() {
      wx.previewImage({
        urls: [this.data.article.tempFilePath]
      })
    }
  }
})