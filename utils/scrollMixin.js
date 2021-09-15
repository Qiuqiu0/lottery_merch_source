module.exports = {
    data: { 
        pageSize: 10,
        pageNum: 1, // 当前页码
        listItem: [], // 列表数据
        total: 0, // 数据条数
        noMore: false, // 是否显示已到底提示
        isShowNull: false, // 是否显示空页面 
        saveScrollKey: null // 想要操作的数据名称
    },
    handleBindscrolltolower(fn) { // 触底
        let { pageNum, total, saveScrollKey } = this.data;
        let listItem = this.data[saveScrollKey];
        console.log(saveScrollKey, listItem.length != total, total, listItem)
        if(listItem.length != total) {
            this.setData({
                pageNum: ++pageNum
            })
            if(typeof fn == 'function') {
                fn();
            } else {
                this.getDataItem();
            }
        }
        this.isNoMore();
    },
    resetPageNum(fn) { // 重置分页
        let { saveScrollKey } = this.data;
        this.setData({
            pageNum: 1,
            [saveScrollKey]: []
        })
        if(typeof fn == 'function') {
            fn();
        } else {
            this.getDataItem();
        }
    },
    isNoMore() { // 是否显示到底提示
        let {total, saveScrollKey} = this.data;
        let listItem = this.data[saveScrollKey];
        this.setData({
            noMore: (total == listItem.length && total != 0) ? true : false,
            isShowNull: listItem.length == 0 ? true : false
        })
    },
    setDatas(res, key = 'listItem') { // 数据设置
        console.log(key, '00000000')
        this.setData({
            [key]: this.data[key].concat(res.data),
            total: res.total,
            saveScrollKey: key 
        })
        this.isNoMore();
    }
  }