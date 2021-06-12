// pages/set/set.js
import {
    onCollectionAdd,
    onUploadFile,
    onCollectionWhere
} from '../../utils/dataset';
import {
    onNotify,
    onToast,
    canIRemoveStroage
} from '../../utils/utils'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
const app = getApp()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        showName: '',
        btnName: '',
        message: '',
        degree: 0,
        fileList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const {
            id
        } = options;
        const btnName = id === 'setArticle' ? '飞剑传书' : '飞剑传物';
        const key = id === 'setArticle' ? 'canIsetArticle' : 'canIsetImage';
        this.setData({
            showName: id,
            btnName,
            degree: Number(!canIRemoveStroage(key))
        })
    },

    
    // 删除图片触发事件
    onImgDetele({ detail }) {
        let { fileList } = this.data;
        fileList.splice(detail.index, 1)
        this.setData({
            fileList
        })
    },

    // 图片超出限制触发事件
    onImgOverSize() {
        return onNotify('warning', '施主的宝物太贵重还是另换一物吧！')
    },

    // 图片读取成功时触发事件
    afterRead({ detail }) {
        let { fileList } = this.data;
        fileList.push(detail.file)
        this.setData({
            fileList
        })
    },

    // 按钮事件
    onSetDataBtn() {
        const { showName, message, fileList, degree } = this.data;
        if (showName === 'setArticle') {
            if (!message || degree) {
                return onNotify('warning', '施主莫要冲动！')
            } else {
                const { globalData } = app;
                onCollectionAdd('userArticle', {
                    avatarUrl: globalData.userInfo.avatarUrl,
                    nickName: globalData.userInfo.nickName,
                    value: message
                }).then(res => {
                    this.onSetStorageTime('canIsetArticle');
                    onNotify('success', '已传送并告知江湖。', {
                        onClose: () => {
                            wx.navigateBack()
                        }
                    })
                })
            }
        }else{
            if(degree){
                return onNotify('warning', '施主今日已行善！')
            }
            if(!fileList.length){
                return onNotify('warning', '施主莫要戏耍江湖人！')
            }else{
                const thumb = fileList[0].thumb;
                const Imgsuffix = thumb.match(/\.[^.]+?$/)[0];

                onToast('loading', '加载中...', {
                    forbidClick: true,
                    duration: 0
                  });

                wx.getFileInfo({
                    filePath: thumb,
                    success: fileInfoRes => {
                        const { digest } = fileInfoRes;
                        // 上传文件
                        onUploadFile({
                            cloudPath: `images/${digest}${Imgsuffix}`,
                            filePath: thumb
                        }).then(res => {
                            // 根据imgId查询是否记录
                            onCollectionWhere('imageId', {
                                imgId: res.fileID
                            }).then(whereRes => {
                                if(!whereRes.length){
                                    // 添加到数据库
                                    onCollectionAdd('imageId',{
                                        imgId: res.fileID
                                    })
                                }
                                Toast.clear();
                                this.onSetStorageTime('canIsetImage')
                                return onNotify('success', '多谢施主馈赠江湖宝物',{
                                    onClose: () => {
                                        wx.navigateBack()
                                    }
                                })
                            })
                        })
                    }
                })
            }
        }
    },

    // 缓存当时上传的时间+24小时
    onSetStorageTime(key){
        const date = new Date();
        wx.setStorageSync(key, date.setDate(date.getDate() + 1))
    }
})