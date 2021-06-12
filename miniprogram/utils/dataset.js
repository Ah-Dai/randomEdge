// 数据库添加数据，collectionName 集合名称，data 请求参数
export function onCollectionAdd(collectionName, data){
  const db = wx.cloud.database();
  return new Promise((resolve, reject) => {
    db.collection(collectionName).add({
      data,
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

// 查询数据库，collectionName 集合名称，data 请求参数
export function onCollectionWhere(collectionName,data){
  const db = wx.cloud.database();
  return new Promise((resolve,reject) => {
    db.collection(collectionName).where(data).get({
      success: res => {
        resolve(res.data)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

// 查询数据库，collectionName 集合名称，没有请求参数，skip 从第几条查起，limit 返回多少条
export function onGetCollectionSkipLimit(collectionName,skip,limit = 1){
  const db = wx.cloud.database();
  return new Promise((resolve,reject) => {
    db.collection(collectionName).skip(skip).limit(limit).get({
      success: res => {
        resolve(res.data[0])
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

// 查询集合有多少条记录
export function onCollectionCount(collectionName){
  const db = wx.cloud.database();
  return new Promise((resolve,reject) => {
    db.collection(collectionName).count({
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

// 文件上传
export function onUploadFile(params){
  return new Promise((resolve, reject) => {
    wx.cloud.uploadFile({
      ...params,
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}