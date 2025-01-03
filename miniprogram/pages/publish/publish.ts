interface PublishPageData extends PageData {
  activityName: string;
  category: string;
  categoryOptions: string[];
  categoryDisplay: string;
  activityDate: string;
  activityTime: string;
  participantLimit: number;
  imageUrls: string[];
  activityDetails: string;
  indicatorDots: boolean;
  autoplay: boolean;
  interval: number;
  duration: number;
  nav: any;
  listData: any[];
}

interface PublishPageInstance {
  onNameInput: (e: WechatMiniprogram.Input) => void;
  onCategoryChange: (e: WechatMiniprogram.Input) => void;
  onDateChange: (e: WechatMiniprogram.Input) => void;
  onTimeChange: (e: WechatMiniprogram.Input) => void;
  onDecrease: () => void;
  onIncrease: () => void;
  onUploadImage: () => void;
  onDetailsInput: (e: WechatMiniprogram.Input) => void;
  onPublish: () => void;
  onCancel: () => void;
}

Page<PublishPageData, PublishPageInstance>({
  data: {
    currentTab: 2,
    tabPages: [
      '/pages/home/home',
      '/pages/activity/activity',
      '/pages/publish/publish',
      '/pages/message/message',
      '/pages/userProfile/userProfile'
    ],
    activityName: '',
    category: '',
    categoryOptions: ['Study', 'Carpool', 'Sports', 'Romance', 'Other'],
    categoryDisplay: '',
    activityDate: '',
    activityTime: '',
    participantLimit: 1,
    imageUrls: [],
    activityDetails: '',
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    nav: {},
    listData: []
  },

  onNameInput(e) {
    this.setData({ activityName: e.detail.value });
  },

  onCategoryChange(e) {
    const index = Number(e.detail.value);
    const categoryMap = {
      'Study': '学习',
      'Carpool': '拼车',
      'Sports': '运动',
      'Romance': '恋爱',
      'Other': '其他'
    } as const;
    const selectedCategory = this.data.categoryOptions[index] as keyof typeof categoryMap;
    this.setData({
      category: selectedCategory,
      categoryDisplay: categoryMap[selectedCategory]
    });
  },

  onDateChange(e) {
    this.setData({ activityDate: e.detail.value });
  },

  onTimeChange(e) {
    this.setData({ activityTime: e.detail.value });
  },

  onDecrease() {
    if (this.data.participantLimit > 1) {
      this.setData({
        participantLimit: this.data.participantLimit - 1
      });
    }
  },

  onIncrease() {
    this.setData({
      participantLimit: this.data.participantLimit + 1
    });
  },

  onUploadImage() {
    wx.chooseMedia({
      count: 9,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFiles.map(file => file.tempFilePath);
        this.setData({
          imageUrls: this.data.imageUrls.concat(tempFilePaths)
        });
      }
    });
  },

  onDetailsInput(e) {
    this.setData({ activityDetails: e.detail.value });
  },

  onPublish() {
    const token = wx.getStorageSync('token');
    const { activityName, category, activityDate, activityTime, activityDetails, participantLimit, imageUrls } = this.data;

    if (!activityName || !category || !activityDate || !activityTime || !activityDetails || imageUrls.length === 0) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    const startTime = `${activityDate} ${activityTime}`;

    const formData = {
      activityDTO: JSON.stringify({
        activityName,
        category,
        startTime,
        description: activityDetails,
        maxNum: participantLimit.toString()
      })
    };

    imageUrls.forEach((filePath, index) => {
      wx.uploadFile({
        url: 'http://localhost:10010/activity/management',
        filePath: filePath,
        name: `activityPicture${index}`,
        formData,
        header: {
          'content-type': 'multipart/form-data',
          'Authorization': `${token}`
        },
        success: (res) => {
          if (res.statusCode === 200) {
            console.log('活动发布成功', res.data);
            wx.showToast({
              title: '发布成功',
              icon: 'success'
            });
            this.setData({
              activityName: '',
              category: '',
              categoryDisplay: '',
              activityDate: '',
              activityTime: '',
              activityDetails: '',
              participantLimit: 1,
              imageUrls: []
            });
          } else {
            console.error('活动发布失败', res.data);
            wx.showToast({
              title: '发布失败',
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          console.error('请求失败', err);
          wx.showToast({
            title: '请求失败',
            icon: 'none'
          });
        }
      });
    });
  },

  onCancel() {
    wx.navigateBack();
  }
});
