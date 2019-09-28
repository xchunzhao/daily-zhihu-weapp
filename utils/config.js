// config.js

const WEB_API_URL = "https://news-at.zhihu.com";
const CONFIG = {
  API_URL: {
    //最新日报
    NEWS_LATEST_QUERY: WEB_API_URL + "/api/4/news/latest",
    //查看历史日报
    NEWS_HOSTORY_QUERY: WEB_API_URL + '/api/4/news/before/',
    //热门日报
    NEWS_HOT_QUERY: WEB_API_URL + "/api/4/news/hot",
    //文章详情{ID}
    NEWS_DETAIL_QUERY: WEB_API_URL + "/api/4/news/",
    //文章评论信息
    NEWS_EXTRADATA_QUERY: WEB_API_URL + "/api/4/story-extra/",
    // 专栏列表
    NEWS_THEMES_QUERY: WEB_API_URL + "/api/4/themes",
    // 专栏内容
    NEWS_THEMES_CONTETN_QUERY: WEB_API_URL + "/api/4/theme/"
  }
}
module.exports = CONFIG;
