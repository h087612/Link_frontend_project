Page({
  data: {
    userPoint: 0,
    transactions: [] as Array<{ transactionId: string; points: number; time: string }>
  },

  onLoad() {
    this.loadUserPoint();
    this.loadPointTransactions();
  },

  loadUserPoint() {
    const token = wx.getStorageSync('token'); // 获取存储的 token

    wx.request({
      url: 'http://localhost:10010/point/userPoint',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': `${token}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          const responseData = res.data as { code: string; message: string; data: { point: number } };
          console.log(responseData)
          this.setData({
            userPoint: responseData.data.point
          });
          console.log(this.data.userPoint)
        } else {
          console.error('获取用户积分失败', res.data);
        }
      },
      fail: (err) => {
        console.error('请求失败', err);
      }
    });
  },

  loadPointTransactions() {
    const token = wx.getStorageSync('token'); // 获取存储的 token

    wx.request({
      url: 'http://localhost:10010/point/pointTransaction',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': `${token}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          const responseData = res.data as { code: string; message: string; data: Array<{ transactionId: string; points: number; time: string }> };
          this.setData({
            transactions: responseData.data
          });
        } else {
          console.error('获取积分变动记录失败', res.data);
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