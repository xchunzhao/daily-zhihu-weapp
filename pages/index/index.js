//index.js
//获取应用实例
const app = getApp()

import CONFIG from "../../utils/config.js";
import wxRequest from '../../utils/wxRequest';
import moment from '../../utils/moment.min.js';
var util = require("../../utils/util.js");

function range(start, end){
  const result = [];
  for(var i = start; i < end; i ++) {
    result.push(i);
  }
  return result;
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
          date: nowDate,
          stories: res.data.stories
        });
        //再获取前4天数据
        const promises = range(0,4).map(i => {
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
            stories: stories.concat(responses.map(res => res.data))
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
    //获取知乎日报信息
    this.getNewsList();
  },
})
