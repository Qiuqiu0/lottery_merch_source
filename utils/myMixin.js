module.exports = {
    data: { 
        pageSize: 10,
        pageNum: 1, // 当前页码
        listItem: [], // 列表数据
        total: 0, // 数据条数
        noMore: false, // 是否显示已到底提示
        isShowNull: false // 是否显示空页面 
     },
    onReachBottom() { // 触底
        let { pageNum, listItem, total } = this.data;
        if(listItem.length != total) {
            this.setData({
                pageNum: ++pageNum
            })
            this.getDataItem();
        }
        this.isNoMore();
    },
    resetPageNum() { // 重置分页
        this.setData({
            pageNum: 1,
            listItem: []
        })
        this.getDataItem();
    },
    isNoMore() { // 是否显示到底提示
        let {total, listItem} = this.data;
        console.log(total, listItem)
        this.setData({
            noMore: (total == listItem.length && total != 0) ? true : false,
            isShowNull: listItem.length == 0 ? true : false
        })
    },
    setDatas(res) { // 数据设置
        let {listItem} = this.data;
        this.setData({
            listItem: listItem.concat(res.data),
            total: res.total 
        })
        this.isNoMore();
    }
  }