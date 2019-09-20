import * as mUtils from '@/utils/mUtils'
// import { logout, getUserInfo } from '@/api/user' // 导入用户信息相关接口
import { removeToken } from '@/utils/auth'
import api from '@/api'
const user = {
  state: {
    userinfo: {},
    name: '',
    userid: '',
    avatar: '',
    token: '',
    roles: [],
    browserHeaderTitle: mUtils.getStore('browserHeaderTitle') || 'pagoda',
    addUserDialog: {
      title: '',
      type: 'add'
    },
    search: {
      name: ''
    },
    searchBtnDisabled: true
  },
  getters: {
    userinfo: state => state.userinfo,
    token: state => state.token,
    roles: state => state.roles,
    avatar: state => state.avatar,
    name: state => state.name,
    userid: state => state.userid,
    browserHeaderTitle: state => state.browserHeaderTitle,
    addUserDialog: state => state.addUserDialog,
    search: state => state.search,
    searchBtnDisabled: state => state.searchBtnDisabled
  },
  mutations: {
    SET_TOKEN (state, token) {
      state.token = token
      sessionStorage.token = token
    },
    DEL_TOKEN (state) {
      state.token = ''
      sessionStorage.removeItem('token')
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_BROWSERHEADERTITLE: (state, action) => {
      state.browserHeaderTitle = action.browserHeaderTitle
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_USERID: (state, id) => {
      state.userid = id
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_USERINFO: (state, userinfo) => {
      state.userinfo = userinfo
    },
    SET_DIALOG_TITLE: (state, type) => {
      if (type === 'add') {
        state.addUserDialog.title = '新增用户'
        state.addUserDialog.type = 'add'
      } else {
        state.addUserDialog.title = '编辑用户信息'
        state.addUserDialog.type = 'edit'
      }
    },
    SET_SEARCH: (state, payload) => {
      state.search = payload
    },
    SET_SEARCHBTN_DISABLED: (state, payload) => {
      state.searchBtnDisabled = payload
    }
  },
  actions: {
    // 登出
    LogOut ({ commit, reqData }) {
      return new Promise((resolve, reject) => {
        api.login.logout().then(response => {
          commit('SET_ROLES', [])
          removeToken('Token')
          resolve()
        })
      })
    },
    // 获取用户列表
    GetUserList ({commit}, reqData) {
      return new Promise(resolve => {
        api.user.getUserList(reqData).then(response => {
          const data = response.data
          resolve(data)
        })
      })
    }

  }
}

export default user
