import Vue from 'vue'
import Router from 'vue-router'
import { Layout, Content } from '../layout'
import { topRouterMap } from './topRouter'

Vue.use(Router)

function filterTopRouterMap (name) {
  let router = topRouterMap.find((item) => {
    return item.parentName === name
  })
  return router.data // arr
}

// 默认不需要权限的页面
export const constantRouterMap = [
  {
    path: '',
    component: Layout,
    redirect: '/index/index',
    hidden: true
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/page/register')
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
  },
  //need delete
  {
    path: '/infoModify',
    name: 'infoModify',
    component: () => import('@/page/selfInfoManage/infoModify')
  },
  {
    path: '/updatePassword',
    name: 'updatePassword',
    component: () => import('@/page/selfInfoManage/updatePassword')
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
  },
  {
    path: '/infoManage',
    name: 'infoManage',
    meta: {
      title: '个人信息管理',
      icon: 'fa-asterisk'
    },
    component: Layout,
    children: [
      {
        path: 'infoModify',
        name: 'infoModify',
        meta: {
          title: '修改信息',
          icon: 'fa-asterisk',
          routerType: 'leftmenu',
          titleList: [
            { 'path': 'infoModify1', 'title': '修改信息子菜单1' },
            { 'path': 'infoModify2', 'title': '修改信息子菜单2' },
            { 'path': 'infoModify3', 'title': '修改信息子菜单3' }
          ]
        },
        component: Content,
        children: filterTopRouterMap('infoModify')
      }
    ]
  }
]
// 注册路由
export default new Router({
  routes: constantRouterMap
})
