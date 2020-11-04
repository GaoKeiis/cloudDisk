import Vue from 'vue'
import Vuex from 'vuex'
import { Loading } from 'element-ui';
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    folderId: 0,
    options:{
      lock: true,
      text: '加载中，请稍后',//加载动画的文字
      // spinner: 'el-icon-loading',//加载动画的图标
      // background: 'rgba(0, 0, 0, 0.7)'//加载动画的背景
    },
  },
  mutations: {
    changeFolderId (state, folderId) {
      state.folderId = folderId
    },
    showLoading(state,val){
      let loadingInstance = Loading.service(state.options);
      val? Loading.service(state.options) : loadingInstance.close() //这里判断调用方法时候的参数值，打开服务的时候传true，关闭服务的时候传false
    },
  }
})