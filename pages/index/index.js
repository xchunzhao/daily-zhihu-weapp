//index.js
//获取应用实例
const app = getApp()

import CONFIG from "../../utils/config.js";
var dialog = require("../../utils/dialog.js");
var util = require("../../utils/util.js");

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
    datetime: ""
  },
  getNewsList: function(){
    const self = this;
    wx.request({
      url: CONFIG.API_URL.NEWS_LATEST_QUERY, 
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(res);//errMsg: "request:ok", data: Object, statusCode: 200
        if(res.statusCode == 200){
          //日期格式化 '19930701' -> 1993-07-01  
          var dateString = res.data.date;
          var pattern = /(\d{4})(\d{2})(\d{2})/;
          var formatedDate = dateString.replace(pattern, '$1-$2-$3');

          self.setData({
            stories: res.data.stories,
            topStories: res.data.top_stories,
            datetime: formatedDate
          })
        }
      },
      fail: function() {
        setTimeout(function(){
          dialog.toast("请求失败，请检查您的网络！");
        },1000);
      },
      complete: function() {
        wx.stopPullDownRefresh();//停止下拉刷新
      }
    })
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
