interface MessagePageData extends PageData {
  messages: any[];
  notifications: Array<{ notificationId: string; time: string; type: string }>;
}

interface MessagePageInstance {
  loadMessages: () => void;
  loadNotifications: () => void;
  navigateToDetail: (e: any) => void;
}

Page<MessagePageData, MessagePageInstance>({
  data: {
    messages: [],
    currentTab: 3,  // 消息页对应的索引
    tabPages: [
      '/pages/home/home',
      '/pages/activity/activity',
      '/pages/publish/publish',
      '/pages/message/message',
      '/pages/userProfile/userProfile'
    ],
    notifications: []
  },

  onLoad() {
    this.loadMessages();
    this.loadNotifications();
  },

  onShow() {
    this.loadMessages();
  },

  loadMessages() {
    // 加载消息数据
  },

  loadNotifications() {
    const token = wx.getStorageSync('token'); // 获取存储的 token

    wx.request({
      url: 'http://localhost:10010/notification',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': `${token}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          const responseData = res.data as { code: string; message: string; data: Array<{ notificationId: string; time: string; type: string }> };
          this.setData({
            notifications: responseData.data
          });
        } else {
          console.error('获取通知失败', res.data);
        }
      },
      fail: (err) => {
        console.error('请求失败', err);
      }
    });
  },

  navigateToDetail(e: any) {
    const notificationId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/notificationDetail/notificationDetail?notificationId=${notificationId}`
    });
  }
});
