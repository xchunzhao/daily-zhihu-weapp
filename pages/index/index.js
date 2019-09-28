//index.js
//获取应用实例
const app = getApp()

import CONFIG from "../../utils/config.js";
import wxRequest from '../../utils/wxRequest';
import dialog from '../../utils/dialog';
import moment from '../../utils/moment.min.js';
var util = require("../../utils/util.js");

const day2Zh = {
  0: '天',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六'
};

function range(start, end){
  const result = [];
  for(var i = start; i < end; i ++) {
    result.push(i);
  }
  return result;
}

function transformDate(date){
  return moment(date).format('YYYY-MM-DD') + " 星期" + day2Zh[moment(date).day()]
}

Page({
  data: {
    swiperConfig: {
      indicatorDots: true,
      //自动轮播
      autoplay: true,
      //自动切换时间间隔
      interval: 5000,
      //滑动动画时长
      duration: 1000,
    },
    stories: [],
    topStories: [],
  },
  getNewsList: function(){
    const self = this;
    //只获取最近5天数据
    wxRequest({
      url: CONFIG.API_URL.NEWS_LATEST_QUERY, 
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if(res.statusCode == 200){
        const nowDate = res.data.date;
        const stories = [];
        stories.push({
          date: transformDate(nowDate),
          stories: res.data.stories
        });
        //再获取前4天数据
        const promises = range(0,9).map(i => {
          const queryDate = moment(nowDate).subtract(i, 'days').format('YYYYMMDD');
          return wxRequest({
            url: CONFIG.API_URL.NEWS_HOSTORY_QUERY + queryDate, 
            method: 'GET',
            header: {
              'Content-Type': 'application/json'
            }
          });
        })
        Promise.all(promises)
        .then(responses => {
          self.setData({
            topStories: res.data.top_stories,
            stories: stories.concat(responses.map(res => {
              return {
                date: transformDate(res.data.date),
                stories: res.data.stories
              }
            }))
          })
        });
      }
    });
  },
  //跳转到详情页
  navToDetail: function(e) {
    wx.navigateTo({
      url: '../detail/index?id=' + e.currentTarget.id,
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  onLoad: function () {
    wx.showShareMenu({
      // 要求小程序返回分享目标信息
      withShareTicket: true
    });
    //获取知乎日报信息
    this.getNewsList();
  },
  onShareAppMessage: function (ops) {
    return {
      title: 'Daily zhihu',
      path: `pages/index/index`,
      success: function (res) {
        dialog.toast('转发成功');
      },
      fail: function (res) {
        dialog.toast('转发失败');
      }
    }
  }
})
