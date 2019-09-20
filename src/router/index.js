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
  {
    path: '/test',
    name: 'test',
    component: () => import('@/page/test')
  },
  {
    path: '/test1',
    name: 'test1',
    component: () => import('@/page/test1')
  },
  {
    path: '/test2',
    name: 'test2',
    component: () => import('@/page/test2')
  }
]

// 异步路由（需要权限的页面）
export const asyncRouterMap = [
  {
    path: '/userManage',
    name: 'userManage',
    meta: {
      title: '用户管理',
      icon: 'fa-user',
      roles: ['admin', 'PM', 'user']
    },
    component: Layout,
    children: [
      {
        path: 'userList',
        name: 'userList',
        meta: {
          title: '用户一览',
          icon: 'fa-asterisk',
          routerType: 'leftmenu',
          roles: ['admin', 'PM', 'user']
        },
        component: () => import('@/page/user/userList')
      }
    ]
  },
  {
    path: '/customerManage',
    name: 'customerManage',
    meta: {
      title: '客户管理',
      icon: 'fa-customer',
      roles: ['admin', 'PM', 'user']
    },
    component: Layout,
    children: [
      {
        path: 'customerList',
        name: 'customerList',
        meta: {
          title: '客户一览',
          icon: 'fa-customer',
          routerType: 'leftmenu',
          roles: ['admin', 'PM', 'user']
        },
        component: () => import('@/page/customer/customerList')
      }
    ]
  },
  {
    path: '/groupManage',
    name: 'groupManage',
    meta: {
      title: '项目管理',
      icon: 'fa-project',
      roles: ['admin', 'PM', 'user']
    },
    component: Layout,
    children: [
      {
        path: 'groupList',
        name: 'groupList',
        meta: {
          title: '项目一览',
          icon: 'fa-project',
          routerType: 'leftmenu',
          roles: ['admin', 'PM', 'user']
        },
        component: () => import('@/page/group/groupList')
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
            { 'path': 'infoModify1', 'title': '修改信息子菜单1' }
          ]
        },
        component: Content,
        children: filterTopRouterMap('infoModify')
      },
      {
        path: 'modifyPassword',
        name: 'modifyPassword',
        meta: {
          title: '修改密码',
          icon: 'fa-asterisk',
          routerType: 'leftmenu',
          titleList: [
            { 'path': 'modifyPassword1', 'title': '修改密码' }
          ]
        },
        component: Content,
        children: filterTopRouterMap('modifyPassword')
      }
    ]
  }
]
// 注册路由
export default new Router({
  routes: constantRouterMap
})
