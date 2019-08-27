import Vue from 'vue'
import Vuex from 'vuex'

import permission from './modules/permission'
import menu from './modules/menu'
import user from './modules/user'
import network from './modules/network'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    permission,
    menu,
    network
  }
})
