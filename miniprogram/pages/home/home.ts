interface ApiResponse {
  data: {
    data: {
      activityId: number;
      activityName: string;
      category: string;
      postTime: string;
      startTime: string;
      currentNum: number;
      maxNum: number;
      likeCount: number;
      status: string;
      ifLiked: boolean;
    }[];
  };
}

interface PageData {
  currentTab: number;
  tabPages: string[];
  indicatorDots: boolean;
  autoplay: boolean;
  interval: number;
  duration: number;
  nav: { id: number; name: string; image: string }[];
  listData: {
    activityId: number;
    activityName: string;
    category: string;
    postTime: string;
    startTime: string;
    currentNum: number;
    maxNum: number;
    likeCount: number;
    status: string;
    ifLiked: boolean;
  }[];
  swiperImages: string[];
}

interface TabChangeEvent {
  detail: {
    index: number;
  };
}

Page<PageData, {
  fetchListData: (category?: string) => void;
  goToDetail: (e: any) => void;
  onTabChange: (e: TabChangeEvent) => void;
  translateCategory: (category: string) => string;
  translateStatus: (status: string) => string;
  formatDate: (dateString: string) => string;
  onNavItemTap: (e: any) => void;
  getEnglishCategory: (category: string) => string;
}>({
  data: {
    currentTab: 0,
    tabPages: [
      '/pages/home/home',
      '/pages/activity/activity',
      '/pages/publish/publish',
      '/pages/message/message',
      '/pages/userProfile/userProfile'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    nav: [
      { id: 1, name: "学习", image: "http://114.55.119.2:9000/person/nav_study.png" },
      { id: 2, name: "运动", image: "http://114.55.119.2:9000/person/nav_sport.png" },
      { id: 3, name: "拼车", image: "http://114.55.119.2:9000/person/nav_carpool.png" },
      { id: 4, name: "恋爱", image: "http://114.55.119.2:9000/person/nav_love.png" },
      { id: 5, name: "其他", image: "http://114.55.119.2:9000/person/nav_other.png" }
    ],
    listData: [], // 用于存储后端返回的数据
    swiperImages: [
      'http://114.55.119.2:9000/person/swiper1.png',
      'http://114.55.119.2:9000/person/swiper2.png',
      'http://114.55.119.2:9000/person/swiper3.png'
    ]
  },

  // 页面加载时调用
  onLoad() {
    this.fetchListData();
  },

  // 页面显示时调用
  onShow() {
    this.fetchListData(); // 实时更新活动列表
  },

  goToDetail(e: any) {
    const activityId = e.detail.activityId;
    console.log("获取的活动 ID:", activityId);
    wx.navigateTo({
      url: `/pages/activityDetail/activityDetail?activityId=${activityId}`,
      success: () => {
        console.log("跳转成功");
      },
      fail: (err) => {
        console.error("跳转失败:", err);
      },
    });
  },
  


  fetchListData(category?: string) {
    const token = wx.getStorageSync('token');
    wx.request({
      url: `http://localhost:10010/activity`,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': ` ${token}`
      },
      data: {
        category: category || "All",
      },
      success: (res) => {
        console.log(category)
        if (res.data && res.data.data) {
          console.log('接口返回的数据:', res.data.data);

          const formattedData = res.data.data.map(item => {
            return {
              ...item,
              category: this.translateCategory(item.category),
              status: this.translateStatus(item.status),
              startTime: this.formatDate(item.startTime)
            };
          });

          this.setData({
            listData: formattedData,
          });
        } else {
          console.error('接口返回的数据不正确:', res);
        }
      },
      fail: (err) => {
        console.error('接口调用失败:', err);
      },
    });
  },
  

  onNavItemTap(e: any) {
    const category = e.currentTarget.dataset.category;
    const englishCategory = this.getEnglishCategory(category);
    this.fetchListData(englishCategory);
  },

  getEnglishCategory(category: string): string {
    const categoryMap: { [key: string]: string } = {
      "学习": "Study",
      "运动": "Sports",
      "拼车": "Carpool",
      "恋爱": "Romance",
      "其他": "Other",
    };
    return categoryMap[category] || category;
  },

  translateCategory(category: string): string {
    const categoryMap: { [key: string]: string } = {
      "Study": "学习",
      "Sports": "运动",
      "Carpool": "拼车",
      "Romance": "恋爱",
      "Other": "其他",
    };
    return categoryMap[category] || category;
  },

  translateStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      "NORMAL": "未开始",
      "OVER": "已结束",
      "ABNORMAL": "异常终止",
      "LOCKED": "已锁定",
    };
    return statusMap[status] || status;
  },

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString('zh-CN', options);
  },

  // 处理 Tab 切换
  onTabChange(e: TabChangeEvent) {
    const newIndex = e.detail.index;
    if (newIndex === this.data.currentTab) {
      return;
    }
    this.setData({
      currentTab: newIndex
    });
    if (this.data.tabPages[newIndex]) {
      wx.switchTab({
        url: this.data.tabPages[newIndex]
      });
    }
  }
});
