Page({
  data: {
    notificationId: '',
    notification: {
      content: '',
      time: '',
      type: ''
    }
  },

  onLoad(options) {
    const { notificationId } = options;
    if (notificationId) {
      this.setData({ notificationId });
      this.loadNotificationDetail(notificationId);
    } else {
      console.error('通知 ID 不存在');
    }
  },

  loadNotificationDetail(notificationId: string) {
    const token = wx.getStorageSync('token'); // 获取存储的 token

    wx.request({
      url: `http://localhost:10010/notification/${notificationId}`,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': `${token}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          const responseData = res.data as { code: string; message: string; data: { content: string; time: string; type: string } };
          this.setData({
            notification: responseData.data
          });
        } else {
          console.error('获取通知详情失败', res.data);
        }
      },
      fail: (err) => {
        console.error('请求失败', err);
      }
    });
  },

  onBackTap() {
    wx.navigateBack();
  }
}); 