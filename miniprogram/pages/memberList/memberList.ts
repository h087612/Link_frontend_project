
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityId: null,
    memberList: []
  },



  fetchMemberList(activityId) {
    const token = wx.getStorageSync('token');
    wx.request({
      url: `http://localhost:10010/activity/management/participators`,
      method: 'GET',
      header: {
        'Authorization': `${token}`
      },
      data: {
        activityId: activityId
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === 0) {
          this.setData({
            memberList: res.data.data
          });
          console.log('获取到的人员列表:', this.data.memberList);
        } else {
          console.error('Failed to fetch member list:', res);
        }
      },
      fail: (err) => {
        console.error('Request failed:', err);
      }
    });
  },
  goBack: function() {
    wx.navigateBack();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { activityId } = options;
    this.setData({ activityId });
    this.fetchMemberList(activityId);
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