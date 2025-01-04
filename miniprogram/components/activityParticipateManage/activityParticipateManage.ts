// components/ActivityParticipateManage/ActivityParticipateManage.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    activityList: {
      type: Array,
      value: [],
      observer: function(newVal) {
        console.log('参与活动列表更新:', newVal);
        const formattedList = newVal.map(item => ({
          ...item,
          formattedStartTime: this.formatDate(item.startTime),
          formattedCategory: this.formatCategory(item.category)
        }));
        this.setData({ formattedActivityList: formattedList });
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tab: ['已参与', '申请加入', '申请退出'],
    tabIndex: 0,
    formattedActivityList: []
  },
  /**
   * 组件的生命周期
   */
  lifetimes: {
    attached: function() {
      console.log('活动参与管理的活动列表:', this.data.activityList);
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleTab: function(e) {
      const index = e.currentTarget.dataset.index;
      this.setData({
        tabIndex: index,
      });
      const statusMap = ['JOINED', 'JOIN_REQ', 'EXIT_REQ'];
      this.triggerEvent('fetchActivities', { status: statusMap[index] });
    },

    applyExit: function(e) {
      const token = wx.getStorageSync('token');
      const activityId = e.currentTarget.dataset.activityId;

      wx.request({
        url: `http://localhost:10010/activity/participation/${activityId}`,
        method: 'PUT',
        header: {
          'content-type': 'application/json',
          'Authorization': ` ${token}`
        },
        success: (res) => {
          if (res.data && res.data.code === 0) {
            wx.showToast({
              title: '申请退出成功',
              icon: 'success'
            });
            // 重新获取已参与的活动列表
            this.triggerEvent('fetchActivities', { status: 'JOINED' });
          } else {
            wx.showToast({
              title: '申请退出失败',
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          console.error('申请退出接口调用失败:', err);
          wx.showToast({
            title: '申请退出失败',
            icon: 'none'
          });
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
    navigateToMemberList: function(e) {
      const activityId = e.currentTarget.dataset.activityId;
      wx.navigateTo({
        url: `/pages/memberList/memberList?activityId=${activityId}`
      });
    },
    formatCategory(category: string): string {
      const categoryMap: { [key: string]: string } = {
        Study: '学习',
        Romance: '恋爱',
        Sports: '运动',
        Carpool: '拼车',
        Other: '其他'
      };
      return categoryMap[category] || category;
    }
  }
})