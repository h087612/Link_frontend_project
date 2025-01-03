// components/list/list.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    listData: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goToDetail(e: any) {
      const activityId = e.currentTarget.dataset.id;
      this.triggerEvent('goToDetail', { activityId });
      console.log('id是这个',activityId)
    },

    getCategoryColor(category: string): string {
      const categoryColorMap: { [key: string]: string } = {
        "学习": "orange",
        "运动": "blue",
        "拼车": "green",
        "恋爱": "pink",
        "其他": "gray"
      };
      return categoryColorMap[category] || "gray";
    },

    getStatusColor(status: string): string {
      return status === "未开始" ? "green" : "red";
    }
  }
})