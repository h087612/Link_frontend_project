// app.ts
interface IAppOption {
  globalData: {
    loginCode: string; // 添加 loginCode 的类型定义
    userInfo?: WechatMiniprogram.UserInfo;
  };
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback;
}

App<IAppOption>({
  globalData: {
    loginCode: '' // 用于存储登录的 code
  },
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log('登录 code:', res.code)
        // 将 code 存储到 globalData 中
        this.globalData.loginCode = res.code;
      },
    })
  },
})