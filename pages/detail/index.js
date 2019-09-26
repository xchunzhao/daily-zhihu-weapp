// index.js

//获取应用实例
var app = getApp();

const util = require('../../utils/util');
const CONFIG = require("../../utils/config");
const dialog = require("../../utils/dialog");

// 引入富文本解析自定义组件
const WxParse = require('../../wxParse/wxParse');

Page({
  //初始化数据
  data: {
    newsId: "",
    title: "",
    imgSrc: "",
    article: "",
    //评论数
    comments: 0,
    //点赞数
    popularity: 0,
    //长评论数
    longComments: 0,
    //短评论数
    shortComments: 0
  },
  //评论页面跳转
  showComments:function(e){
    // wx.navigateTo({
    //   url: '../comments/comments?id=' + e.currentTarget.id
    // })
  },
  //富文本链接处理
  wxParseTagATap: function(e){
    const link = e.currentTarget.dataset.src;
    wx.navigateTo({
      url: '../outlink/index?src=' + link,
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
  loadExtraData: function(newsId){
    var self = this;
    wx.request({
      url: CONFIG.API_URL.NEWS_EXTRADATA_QUERY + newsId, 
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        self.setData({
          comments: res.data.comments,
          popularity: res.data.popularity,
          longComments: res.data.long_comments,
          shortComments: res.data.short_comments
        })
      }
    })
  },
  // 加载文章内容
  onLoad: function(option){
    dialog.loading();
    var self = this;
    wx.request({
      url: CONFIG.API_URL.NEWS_DETAIL_QUERY + option.id, 
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        //富文本解析
        var article = res.data.body;
        WxParse.wxParse('article', 'html', article, self, 0);
        self.setData({
          newsId: res.data.id,
          title: res.data.title,
          imgSrc: res.data.image
        })
        //加载评论信息
        // self.loadExtraData(res.data.id);
      },
      complete: function(){
        setTimeout(function(){
          dialog.hide(); 
        },1000);
      }
    })
  }
});