import Vue from 'vue'
import Vuex from 'vuex'

import permission from './modules/permission'
import menu from './modules/menu'
import user from './modules/user'
import customer from './modules/customer'
import group from './modules/group'
import network from './modules/network'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    customer,
    group,
    permission,
    menu,
    network
  }
})
