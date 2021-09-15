// components/tab/tab.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabItem: {
      type: Array
    },
    defalutIndex: {
      type: String,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    active: 0
  },
  ready() {
    this.setData({
      active: this.properties.defalutIndex
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleChange (e) {
      this.setData({
        active: e.currentTarget.dataset.index
      })
      // 绑定父组件事件，实现组件间通信
      this.triggerEvent('tabChange', e.currentTarget.dataset.index)
    }
  }
})
