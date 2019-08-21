// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import api from './api'
import xss from 'xss'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './mockjs'

// i18n国际化
import i18n from '@/lang'
// iconSvg
import './components/iconSvg'

Vue.prototype.$api = api
Vue.prototype.$xss = xss
Vue.config.productionTip = false
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store: store,
  components: { App },
  template: '<App/>'
})
