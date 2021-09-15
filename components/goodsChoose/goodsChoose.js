// components/goodsChoose/goodsChoose.js
import fetch from '../../utils/serve'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: {
      type: Boolean
    },
    merchId:{
      type:String
    },
    checkArr:{
      type:String
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    listItem: [], // 数据列表
    goodsName:'',
    goodsShow:false,//商品选择
    searchName:'',
    goodsCode:'',
    pageSize: 10,
    pageNum: 1, // 当前页码
    total: 0, // 数据条数
    noMore: false, // 是否显示已到底提示
    isShowNull: false ,// 是否显示空页面 
    goodsInfo: {},
    isDisabled:true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleSearch(e) { // 搜索
      this.setData({
        searchName: e.detail.value,
        listItem:[]
      })
      
      this.getGoodsItem();
    },
    getGoodsItem() { // 获取商品列表
      let {pageNum} = this.data;
      fetch.post('/getGoodsInfoList.do', {pageNum,merchId:this.properties.merchId,goodsName:this.data.searchName}, {'content-type': 'application/json'}).then((res) => {
        this.setDatas(res)
      }).catch((res) => {
        console.log(res)
      })
    },
    onClickHide(e){
      let {type,index,value}=e.currentTarget.dataset;
      switch(type) {
        case 'close': // 关闭弹窗
          this.setData({
            isShow: false
          })
          break;
        case 'goods': // 商品选择
          this.resetPageNum();
          this.setData({
            goodsShow: true
          })
          break;
        case 'goodsshow': // 选择商品弹窗
          this.setData({
            goodsInfo: value,
            goodsShow: false,
            isDisabled:false
          })
          break;
      }
      
    },
    //确定 
    rechargeSure(){
      let chckedData=JSON.parse(this.properties.checkArr);
      let data={
        doGoodsInfo:this.data.goodsInfo,
        loLotteryUserInfoList:chckedData
      }
      fetch.post('/loUserWinningInfo/sendPrize.do',data, {'content-type': 'application/json'}).then((res) => {
        wx.showToast({
          title: '发送奖品成功',
        })
        setTimeout(()=>{
          wx.navigateTo({
            url: '/pages/index/index',
          },1000)
        },800)
  
      }).catch((res) => {
        console.log(res)
      })
    },
    handleCancel() { // 关闭选择框
      this.setData({
        goodsShow: false,
        isShow: true,
        listItem:[]
      })
    },
    handleBindscrolltolower() {
      this.onReachBottom();
      // this.handleBindscrolltolower(this.getMerchData)
    },
      onReachBottom() { // 触底
        let { pageNum, listItem, total } = this.data;
        console.log(listItem.length, total)
        
        if(listItem.length != total) {
            this.setData({
                pageNum: ++pageNum
            })
            
            this.getGoodsItem();
        }
        this.isNoMore();
    },
    resetPageNum() { // 重置分页
        this.setData({
            pageNum: 1,
            listItem: []
        })
        
        this.getGoodsItem();
    },
    isNoMore() { // 是否显示到底提示
        let {total, listItem} = this.data;
        console.log(total, listItem)
        ;
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
        console.log(res.total);
    }
  },
  tpatrolPullMenuSelect(e){
    this.setData({ goodsShow: true });
  }
})
