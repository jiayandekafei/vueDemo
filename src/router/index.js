import Vue from 'vue'
import Router from 'vue-router'
import { Layout, Content } from '../layout'
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
    path: '',
    component: Layout,
    redirect: '/index/index',
    hidden: true
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/page/login')
  },
  {
    path: '/refresh',
    name: 'refresh',
    component: () => import('@/page/refresh')
  },
  {
    path: '/index',
    name: 'index',
    component: Layout,
    meta: {
      title: '首页',
      icon: 'fa-dashboard'
    },
    noDropdown: true,
    children: [
      {
        path: 'index',
        meta: {
          title: '首页',
          icon: 'fa-index',
          routerType: 'leftmenu'
        },
        component: () => import('@/page/index/index')
      }
    ]
  }
]

// 异步路由（需要权限的页面）
export const asyncRouterMap = [
  {
    path: '/userManager',
    name: 'userManage',
    component: Layout,
    meta: {
      title: '用户管理',
      icon: 'fa-user'
    },
    noDropdown: true,
    children: [
      {
        path: 'userList',
        meta: {
          title: '用户管理',
          icon: 'fa-user',
          routerType: 'leftmenu'
        },
        component: () => import('@/page/index/index')
      }
    ]
  }
]
// 注册路由
export default new Router({
  routes: constantRouterMap
})
