import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'

import router from './router'
import store from './store'
Vue.use(ElementUI, { locale })
Vue.config.productionTip = false
window.eventBus = new Vue()
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
import OnlyMessage from './utils/onlyMsgbox'
Vue.prototype.$message = OnlyMessage
localStorage.setItem('client_id','ucc-client');
localStorage.setItem('client_secret','ucc-secret-8888');

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
