import dialog from './dialog';
export default function wxRequest({url, method, header, data}){
  dialog.loading();
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      header: header,
      method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: res => {
        dialog.hide();
        resolve(res);
      },
      fail: err => {
        dialog.fail("请求失败！" + err.message);
        reject(err);
      }
    })
  });
}