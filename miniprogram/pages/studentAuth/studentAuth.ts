Page({
  data: {
    studentInfo: {
      name: '',
      college: '',
      major: '',
      studentId: '',
      authStatus: ''
    },
    isVerified: false
  },

  onLoad() {
    this.loadStudentInfo();
  },

  loadStudentInfo() {
    const token = wx.getStorageSync('token'); // 获取存储的 token

    wx.request({
      url: 'http://localhost:10010/user/studentInfo',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': `${token}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          const responseData = res.data as { code: string; message: string; data: { name: string; college: string; major: string; studentId: string; authStatus: string } };
          const data = responseData.data;
          this.setData({
            studentInfo: data,
            isVerified: data.authStatus === 'VERIFIED'
          });
        } else {
          console.error('获取学生认证信息失败', res.data);
        }
      },
      fail: (err) => {
        console.error('请求失败', err);
      }
    });
  },

  onBackTap() {
    wx.navigateBack();
  },

  onSubmitAuth() {
    // 提交认证逻辑
  }
}); 