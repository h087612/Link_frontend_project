interface UserProfilePageData extends PageData {
  userInfo: {
    avatar: string;
    nickname: string;
    contact: string;
    isBan: boolean;
  };
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
}

interface UserProfilePageInstance {
  loadUserInfo: () => void;
  onSettingTap: () => void;
  onStudentAuthTap: () => void;
  onModifyInfoTap: () => void;
  onFavoritesTap: () => void;
  onPointsTap: () => void;
}

Page<UserProfilePageData, UserProfilePageInstance>({
  data: {
    currentTab: 4,
    tabPages: [
      '/pages/home/home',
      '/pages/activity/activity',
      '/pages/publish/publish',
      '/pages/message/message',
      '/pages/userProfile/userProfile'
    ],
    userInfo: {
      avatar: '/images/default.png',
      nickname: '未登录',
      contact: '',
      isBan: false
    },
    stats: {
      posts: 0,
      followers: 0,
      following: 0
    }
  },

  onLoad() {
    this.loadUserInfo();
  },

  onShow() {
    this.loadUserInfo();
  },

  loadUserInfo() {
    const token = wx.getStorageSync('token'); // 获取存储的 token
    console.log(token)
    wx.request({
      url: 'http://localhost:10010/user/userInfo',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': `${token}` 
      },
      success: (res) => {
        if (res.statusCode === 200) {
          const responseData = res.data as { code: string; message: string; data: { userName: string; avatarUrl: string; contactInfo: string; isBan: boolean } };
          const data = responseData.data;
          this.setData({
            userInfo: {
              avatar: data.avatarUrl,
              nickname: data.userName,
              contact: data.contactInfo,
              isBan: data.isBan
            }
          });
        } else {
          console.error('获取用户信息失败', res.data);
        }
      },
      fail: (err) => {
        console.error('请求失败', err);
      }
    });
  },

  onSettingTap() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  },

  onStudentAuthTap: function() {
    wx.navigateTo({url: '/pages/studentAuth/studentAuth'});
  },

  onModifyInfoTap() {
    wx.navigateTo({
      url: '/pages/modifyInfo/modifyInfo'
    });
  },

  onFavoritesTap() {
    wx.navigateTo({
      url: '/pages/favor/favor'
    });
  },

  onPointsTap: function() {
    console.log('1111')
    wx.navigateTo({
      url: '/pages/points/points'
    });
    console.log('22222')
  }
});
