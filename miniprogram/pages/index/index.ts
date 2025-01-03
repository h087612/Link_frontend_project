// index.ts
// 获取应用实例
const app = getApp<IAppOption>();
const defaultAvatarUrl = 'http://114.55.119.2:9000/person/default.png';

Page({
  data: {
    motto: '欢迎来到搭哒小程序！',
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
  },
  onLoad: function () {
    // 页面加载时执行的代码
    // 获取页面栈
    const pages = wx.getStorageSync('pages') || []
    console.log('页面栈:', pages)

    // 更新页面栈
    let currentPage = this.route  // 获取当前页面的路由
    pages.push(currentPage) // 将当前页面加入栈中
    wx.setStorageSync('pages', pages) // 存储页面栈

  },
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs',
    });
  },
  onChooseAvatar: function (e:any) {
    const { avatarUrl } = e.detail;
    const { nickName } = this.data.userInfo;
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    });
  },
  onInputChange: function (e:any) {
    const nickName = e.detail.value;
    const { avatarUrl } = this.data.userInfo;
    this.setData({
      "userInfo.nickName": nickName,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    });
  },
  getUserProfile: function () {
    wx.getUserProfile({
      desc: '展示用户信息',
      success: (res) => {
        console.log(res);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        });
      },
    });
  },
  handleLogin: function () {
    console.log('现在开始登录');
    
    const loginCode = app.globalData.loginCode; // 获取登录 code

    wx.request({
      url: 'http://localhost:10010/user/login', // 后端登录接口
      method: 'POST',
      data: {
        code: loginCode, // 使用登录 code
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        if (res.statusCode === 200) {
          const responseData = res.data as { code: string; message: string; data: { token: string } };
          console.log('登录成功', responseData);
          // 处理登录成功后的逻辑，例如存储 token 或用户信息
          const token = responseData.data;
          console.log( token)
          wx.setStorageSync('token', token); // 存储 token
          wx.switchTab({ url: '/pages/home/home' });
        } else {
          console.error('登录失败', res.data);
          // 处理登录失败的逻辑
        }
      },
      fail: (err) => {
        console.error('请求失败', err);
        // 处理请求失败的逻辑
      }
    });
  }
});