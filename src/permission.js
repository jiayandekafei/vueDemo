import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权(从cookie中获取)
import {setTitle} from '@/utils/mUtils' // 设置浏览器头部标题

// permission judge function
function hasPermission (roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}
const whiteList = ['/login'] // 不重定向白名单

router.beforeEach((to, from, next) => {
  NProgress.start()
  // 设置浏览器头部标题
  const browserHeaderTitle = to.meta.title
  store.commit('SET_BROWSERHEADERTITLE', {
    browserHeaderTitle: browserHeaderTitle
  })
  // 点击登录时，拿到了token并存入了cookie,保证页面刷新时,始终可以拿到token
  if (getToken('Token')) {
    /* has token */
    if (to.path === '/login') {
      next({ path: '/' }) // 会匹配到path:'',后面的path:'*'还没有生成;
      NProgress.done()
    } else {
      // 用户登录成功之后，每次点击路由都进行了角色的判断;
      if (store.getters.roles.length === 0) {
        let token = getToken('Token')
        this.$api.user.getUserInfo({'token': token}).then().then(res => { // 根据token拉取用户信息
          let userList = res.data.userList
          store.commit('SET_ROLES', userList.roles)
          store.commit('SET_NAME', userList.name)
          store.commit('SET_AVATAR', userList.avatar)
          store.dispatch('GenerateRoutes', { 'roles': userList.roles }).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问权限路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
          })
        }).catch((err) => {
          store.dispatch('LogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermission(store.getters.roles, to.meta.roles)) {
          next()//
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true }})
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 点击退出时,会定位到这里
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
  setTimeout(() => {
    const browserHeaderTitle = store.getters.browserHeaderTitle
    setTitle(browserHeaderTitle)
  }, 0)
})
