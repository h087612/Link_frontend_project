// pages/MemberManage/MemberManage.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: ['人员列表', '申请加入', '申请退出'],
    tabIndex: 0,
    activityId: null,
    memberList: []
  },

  handleTab: function(e) {
    const newIndex = e.currentTarget.dataset.index;
    this.setData({
      tabIndex: newIndex,
      memberList: []
    });

    if (newIndex === 0) {
      this.fetchMemberList(this.data.activityId);
    } else if (newIndex === 1) {
      this.fetchApplications(this.data.activityId, 'JOIN_REQ');
    } else if (newIndex === 2) {
      this.fetchApplications(this.data.activityId, 'EXIT_REQ');
    }
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

  fetchApplications(activityId, participationStatus) {
    const token = wx.getStorageSync('token');
    wx.request({
      url: `http://localhost:10010/activity/management/applications`,
      method: 'GET',
      header: {
        'Authorization': `${token}`
      },
      data: {
        activityId: activityId,
        participationStatus: participationStatus
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === 0) {
          this.setData({
            memberList: res.data.data
          });
          console.log('获取到的申请列表:', this.data.memberList);
        } else {
          console.error('Failed to fetch applications:', res);
        }
      },
      fail: (err) => {
        console.error('Request failed:', err);
      }
    });
  },

  approveJoinRequest(e) {
    const applicantId = e.currentTarget.dataset.applicantId;
    console.log('这是参与者', applicantId);
    const token = wx.getStorageSync('token');
    console.log('Approving join request for:', applicantId, 'Activity ID:', this.data.activityId);
    wx.request({
      url: `http://localhost:10010/activity/management/applicationOfJoin/${this.data.activityId}`,
      method: 'PUT',
      header: {
        'Authorization': `${token}`,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        'applicantId': applicantId
      }),
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === 0) {
          console.log('加入申请已批准');
          this.fetchApplications(this.data.activityId, 'JOIN_REQ');
        } else {
          console.error('Failed to approve join request:', res);
        }
      },
      fail: (err) => {
        console.error('Request failed:', err);
      }
    });
  },

  rejectJoinRequest(e) {
    const applicantId = e.currentTarget.dataset.applicantId;
    const token = wx.getStorageSync('token');
    wx.request({
      url: `http://localhost:10010/activity/management/applicationOfJoin/${this.data.activityId}`,
      method: 'DELETE',
      header: {
        'Authorization': `${token}`,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        'applicantId': applicantId
      }),
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === 0) {
          console.log('加入申请已拒绝');
          this.fetchApplications(this.data.activityId, 'JOIN_REQ');
        } else {
          console.error('Failed to reject join request:', res);
        }
      },
      fail: (err) => {
        console.error('Request failed:', err);
      }
    });
  },

  approveExitRequest(e) {
    const applicantId = e.currentTarget.dataset.applicantId;
    const token = wx.getStorageSync('token');
    console.log('Approving exit request for:', applicantId, 'Activity ID:', this.data.activityId);
    wx.request({
      url: `http://localhost:10010/activity/management/applicationOfExit/${this.data.activityId}/${applicantId}`,
      method: 'PUT',
      header: {
        'Authorization': `${token}`
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === 0) {
          console.log('退出申请已批准');
          this.fetchApplications(this.data.activityId, 'EXIT_REQ');
        } else {
          console.error('Failed to approve exit request:', res);
        }
      },
      fail: (err) => {
        console.error('Request failed:', err);
      }
    });
  },

  rejectExitRequest(e) {
    const applicantId = e.currentTarget.dataset.applicantId;
    const token = wx.getStorageSync('token');
    wx.request({
      url: `http://localhost:10010/activity/management/applicationOfExit/${this.data.activityId}/${applicantId}`,
      method: 'DELETE',
      header: {
        'Authorization': `${token}`
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === 0) {
          console.log('退出申请已拒绝');
          this.fetchApplications(this.data.activityId, 'EXIT_REQ');
        } else {
          console.error('Failed to reject exit request:', res);
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