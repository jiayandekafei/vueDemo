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
import VueI18n from 'vue-i18n'

Vue.prototype.$api = api
Vue.prototype.$xss = xss
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zh-CN', // 语言标识, 通过切换locale的值来实现语言切换,this.$i18n.locale
  messages: {
    'zh-CN': require('./lang/zh'), // 中文语言包
    'en-US': require('./lang/en') // 英文语言包
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store: store,
  components: { App },
  template: '<App/>'
})
