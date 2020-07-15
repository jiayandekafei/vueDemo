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
      icon: 'el-icon-menu'
    },
    noDropdown: true,
    children: [
      {
        path: 'index',
        meta: {
          title: '首页',
          icon: 'el-icon-menu',
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
    path: '/userManage',
    name: 'userManage',
    meta: {
      title: '用户管理',
      icon: 'el-icon-user',
      roles: [1, 2, 3]
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
          roles: [1, 2, 3]
        },
        component: () => import('@/page/user/userList')
      }, {
        path: 'userApprove',
        name: 'userApprove',
        meta: {
          title: '用户审批',
          icon: 'fa-asterisk',
          routerType: 'leftmenu',
          roles: [1, 2]
        },
        component: () => import('@/page/user/waitUserList')
      }
    ]
  },
  {
    path: '/customerManage',
    name: 'customerManage',
    meta: {
      title: '客户管理',
      icon: 'el-icon-s-custom',
      roles: [1, 2, 3]
    },
    component: Layout,
    children: [
      {
        path: 'customerList',
        name: 'customerList',
        meta: {
          title: '客户一览',
          routerType: 'leftmenu',
          roles: [1, 2, 3]
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
      icon: 'el-icon-s-marketing',
      roles: [1, 2, 3]
    },
    component: Layout,
    children: [
      {
        path: 'groupList',
        name: 'groupList',
        meta: {
          title: '项目一览',
          icon: 'el-icon-s-marketing',
          routerType: 'leftmenu',
          roles: [1, 2, 3]
        },
        component: () => import('@/page/group/groupList')
      }
    ]
  },
  {
    path: '/notesDBInfo',
    name: 'notesDBInfo',
    meta: {
      title: 'notesDB信息管理',
      icon: 'el-icon-data-analysis',
      roles: [1, 2, 3]
    },
    component: Layout,
    children: [
      {
        path: 'dbExport',
        name: 'dbExport',
        meta: {
          title: 'notes导出',
          icon: 'fa-asterisk',
          routerType: 'leftmenu',
          roles: [1, 2, 3]
        },
        component: () => import('@/page/notesInfo/dbExport')
      },
      {
        path: 'dbSimilarity',
        name: 'dbSimilarity',
        meta: {
          title: 'DB分类',
          icon: 'fa-asterisk',
          routerType: 'leftmenu',
          roles: [1, 2, 3]
        },
        component: () => import('@/page/notesInfo/dbSimilarity')
      },
      {
        path: 'dbList',
        name: 'dbList',
        meta: {
          title: 'DB一览',
          icon: 'fa-asterisk',
          routerType: 'leftmenu',
          roles: [1, 2, 3]
        },
        component: () => import('@/page/notesInfo/dbInfo/exportedDBInfoList')
      },
      {
        path: 'dbDetail/:dbName',
        name: 'dbDetail',
        meta: {
          title: 'DB详细信息',
          icon: 'fa-asterisk',
          routerType: 'topmenu',
          roles: [1, 2, 3]
        },
        component: () => import('@/page/notesInfo/dbInfo/dbDetail')
      },
      {
        path: 'dbreference',
        name: 'dbreference',
        meta: {
          title: 'DB详细信息',
          icon: 'el-icon-rank',
          routerType: 'leftmenu',
          roles: [1, 2, 3]
        },
        component: () => import('@/page/notesInfo/dbInfo/dbReference')
      },
    ]
  },
  {
    path: '/aae',
    name: 'aae',
    meta: {
      title: 'AAE',
      icon: 'el-icon-s-data',
      roles: [1, 2, 3]
    },
    component: Layout,
    children: [
      {
        path: 'aaeTransform',
        name: 'aaeTransform',
        meta: {
          title: 'AAE转换',
          icon: 'el-icon-s-marketing',
          routerType: 'leftmenu',
          roles: [1, 2, 3]
        },
        component: () => import('@/page/aae/aaeTransform')
      }
    ]
  },
  {
    path: '/infoManage',
    name: 'infoManage',
    meta: {
      title: '个人信息管理',
      icon: 'el-icon-setting'
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
