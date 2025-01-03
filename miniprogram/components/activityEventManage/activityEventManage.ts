// components/ActivityEventManage/ActivityEventManage.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    activityList: {
      type: Array,
      value: [],
      observer: function(newVal) {
        console.log('活动列表更新:', newVal);
        // 格式化时间和类型并存储在新的属性中
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
    tabIndex: 0,
    tab: ['未开始', '已结束', '异常终止', '已锁定'],
    formattedActivityList: [] // 新增属性用于存储格式化后的活动列表
  },

  /**
   * 组件的生命周期
   */
  lifetimes: {
    attached: function() {
      console.log('活动发起管理的活动列表:', this.data.activityList);
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
      const statusMap = ['NORMAL', 'OVER', 'ABNORMAL', 'LOCKED'];
      this.triggerEvent('fetchActivities', { status: statusMap[index] });
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
    formatCategory(category: string): string {
      const categoryMap: { [key: string]: string } = {
        Study: '学习',
        Romance: '恋爱',
        Sports: '运动',
        Carpool: '拼车',
        Other: '其他'
      };
      return categoryMap[category] || category;
    },
    navigateToMemberManage: function(e) {
      const activityId = e.currentTarget.dataset.activityId;
      wx.navigateTo({
        url: `/pages/memberManage/memberManage?activityId=${activityId}`
      });
    },
    deleteActivity: function(e) {
      const activityId = e.currentTarget.dataset.activityId;
      const token = wx.getStorageSync('token');
      wx.request({
        url: `http://localhost:10010/activity/management/${activityId}`,
        method: 'DELETE',
        header: {
          'Authorization': `${token}`
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data.code === 0) {
            console.log('活动已删除');
            this.triggerEvent('fetchActivities', { status: 'NORMAL' }); // 刷新活动列表
          } else {
            console.error('Failed to delete activity:', res);
          }
        },
        fail: (err) => {
          console.error('Request failed:', err);
        }
      });
    }
  }
})