import Vue from 'vue'
import Router from 'vue-router'
// import { Layout, Content } from '../layout'
// import { topRouterMap } from './topRouter'

Vue.use(Router)

// function filterTopRouterMap (name) {
//   let router = topRouterMap.find((item) => {
//     return item.parentName === name
//   })
//   return router.data // arr
// }

// 默认不需要权限的页面
export const constantRouterMap = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/page/login')
  }
]

// 注册路由
export default new Router({
  routes: constantRouterMap
})
