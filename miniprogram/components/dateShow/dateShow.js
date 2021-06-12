import { onGetNowDate } from '../../utils/utils'

Component({
  data:{
    date: {}
  },
  lifetimes: {
    attached(){
      this.setData({
        date: onGetNowDate()
      })
    }
  }
})