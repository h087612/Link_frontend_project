// pages/ActivityDetail/ActivityDetail.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityDetail: null, // 用于存储活动详情信息
    comments: [], // 用于存储评论数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {
    const activityId = options.activityId;
    this.fetchActivityDetail(activityId);
    this.fetchComments(activityId);
  },

  fetchActivityDetail(activityId: string) {
    const token = wx.getStorageSync('token');
    wx.request({
      url: `http://localhost:10010/activity/${activityId}`, // 假设后端提供此接口
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': ` ${token}`
      },
      success: (res) => {
        if (res.data && res.data.data) {
          console.log('活动详情数据:', res.data.data);
          const detail = res.data.data;
          detail.postTime = this.formatDate(detail.postTime);
          detail.startTime = this.formatDate(detail.startTime);
          this.setData({
            activityDetail: detail,
          });
        } else {
          console.error('获取活动详情失败:', res);
        }
      },
      fail: (err) => {
        console.error('接口调用失败:', err);
      },
    });
  },

  fetchComments(activityId: number) {
    const token = wx.getStorageSync('token');
    wx.request({
      url: `http://localhost:10010/activity/comments/${activityId}`,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': ` ${token}`
      },
      success: (res) => {
        if (res.data && res.data.data) {
          console.log('评论数据:', res.data.data);
          const comments = res.data.data.map((comment: any) => {
            return {
              ...comment,
              formattedTime: this.formatDate(comment.time)
            };
          });
          this.setData({
            comments: comments,
          });
        } else {
          console.error('获取评论失败:', res);
        }
      },
      fail: (err) => {
        console.error('接口调用失败:', err);
      },
    });
  },

  toggleLike() {
    const token = wx.getStorageSync('token');
    const activityId = this.data.activityDetail.activityId;
    const isLiked = this.data.activityDetail.ifLiked;
    const url = `http://localhost:10010/activity/likes${isLiked ? `/${activityId}` : ''}`;

    wx.request({
      url: url,
      method: isLiked ? 'DELETE' : 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': ` ${token}`
      },
      data: isLiked ? {} : { activityId: activityId },
      success: (res) => {
        if (res.data && res.data.code === 0) {
          console.log('点赞操作成功:', res.data);
          this.setData({
            'activityDetail.ifLiked': !isLiked,
            'activityDetail.likeCount': isLiked ? this.data.activityDetail.likeCount - 1 : this.data.activityDetail.likeCount + 1
          });
        } else {
          console.error('点赞操作失败:', res.data.message);
        }
      },
      fail: (err) => {
        console.error('接口调用失败:', err);
      },
    });
  },

  toggleFavor() {
    const token = wx.getStorageSync('token');
    const activityId = this.data.activityDetail.activityId;
    const isFavored = this.data.activityDetail.ifFavored;
    const url = `http://localhost:10010/activity/favorite${isFavored ? `/${activityId}` : ''}`;

    wx.request({
      url: url,
      method: isFavored ? 'DELETE' : 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': ` ${token}`
      },
      data: isFavored ? {} : { activityId: activityId },
      success: (res) => {
        if (res.data && res.data.code === 0) {
          console.log('收藏操作成功:', res.data);
          this.setData({
            'activityDetail.ifFavored': !isFavored
          });
        } else {
          console.error('收藏操作失败:', res.data.message);
        }
      },
      fail: (err) => {
        console.error('接口调用失败:', err);
      },
    });
  },

  handleJoin() {
    const token = wx.getStorageSync('token');
    const activityId = this.data.activityDetail.activityId;
    wx.request({
      url: `http://localhost:10010/activity/participation`,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': ` ${token}`
      },
      data: {
        activityId: activityId,
        status: 'JOIN_REQ'
      },
      success: (res) => {
        console.log('加入请求返回数据:', res.data);
        if (res.data && res.data.code === 0) {
          console.log('加入请求成功:', res.data.message);
          this.setData({
            'activityDetail.participantStatus': 'JOIN_REQ'
          });
        } else {
          console.error('加入请求失败:', res.data);
        }
      },
      fail: (err) => {
        console.error('接口调用失败:', err);
      },
    });
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

  },

  goBack() {
    wx.navigateBack({
      delta: 1,
    });
  }
})