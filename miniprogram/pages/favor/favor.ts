Page({
  data: {
    favoriteList: []
  },

  onLoad() {
    this.fetchFavoriteList();
  },

  fetchFavoriteList() {
    const token = wx.getStorageSync('token');
    wx.request({
      url: 'http://localhost:10010/activity/favorite',
      method: 'GET',
      header: {
        'Authorization': `${token}`,
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === 0) {
          const formattedList = res.data.data.map(item => ({
            ...item,
            startTime: this.formatDate(item.startTime),
            category: this.formatCategory(item.category),
            status: this.formatStatus(item.status)
          }));
          this.setData({
            favoriteList: formattedList
          });
          console.log('获取到的收藏列表:', this.data.favoriteList);
        } else {
          console.error('Failed to fetch favorite list:', res);
        }
      },
      fail: (err) => {
        console.error('Request failed:', err);
      }
    });
  },

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  formatCategory(category) {
    const categoryMap = {
      Study: '学习',
      Romance: '恋爱',
      Sports: '运动',
      Carpool: '拼车',
      Other: '其他'
    };
    return categoryMap[category] || category;
  },

  formatStatus(status) {
    const statusMap = {
      NORMAL: '正常',
      OVER: '已结束',
      ABNORMAL: '异常终止',
      LOCKED: '已锁定'
    };
    return statusMap[status] || status;
  },

  goBack() {
    wx.navigateBack();
  }
}); 