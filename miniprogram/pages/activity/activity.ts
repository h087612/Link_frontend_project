// pages/ActivityManage/ActivityManage.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: ['活动发起管理', '活动参与管理'],
    tabIndex: 0,
    activityList: [] as any[],
  },

  handleTab: function(e:any) {
    const newIndex = e.currentTarget.dataset.index;
    this.setData({
      tabIndex: newIndex,
      activityList: []
    });

    if (newIndex === 0) {
      this.fetchActivityData('NORMAL');
    } else {
      this.fetchParticipationData('JOINED');
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.fetchActivityData('NORMAL');
  },

  fetchActivityData(activityStatus: string) {
    const token = wx.getStorageSync('token');
    wx.request({
      url: 'http://localhost:10010/activity/management',
      method: 'GET',
      header: {
        'Authorization': `${token}`
      },
      data: {
        activityStatus: activityStatus
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === 0) {
          this.setData({
            activityList: res.data.data as any[]
          });
          console.log('获取到的活动列表:', this.data.activityList);
        } else {
          console.error('Failed to fetch activity data:', res);
        }
      },
      fail: (err) => {
        console.error('Request failed:', err);
      }
    });
  },

  fetchParticipationData(participationStatus: string) {
    const token = wx.getStorageSync('token');
    wx.request({
      url: 'http://localhost:10010/activity/participation',
      method: 'GET',
      header: {
        'Authorization': `${token}`
      },
      data: {
        participationStatus: participationStatus
      },
      success: (res) => {
        console.log(participationStatus)
        if (res.statusCode === 200 && res.data.code === 0) {
          this.setData({
            activityList: res.data.data as any[]
          });
          console.log('获取到的参与活动列表:', this.data.activityList);
        } else {
          console.error('Failed to fetch participation data:', res);
        }
      },
      fail: (err) => {
        console.error('Request failed:', err);
      }
    });
  },

  handleFetchActivities(e) {
    const { status } = e.detail;
    if (this.data.tabIndex === 0) {
      this.fetchActivityData(status);
    } else {
      this.fetchParticipationData(status);
      console.log('这是参与活动', this.data.activityList);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})