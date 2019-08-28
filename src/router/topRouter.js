
export const topRouterMap = [
  {
    'parentName': 'infoModify',
    'data': [
      {
        path: 'infoModify1',
        name: 'infoModify1',
        meta: {
          title: '修改信息子菜单',
          icon: 'fa-asterisk',
          routerType: 'topmenu'
        },
        component: () => import('@/page/selfInfoManage/infoModify')
      }
    ]
  },
  {
    'parentName': 'modifyPassword',
    'data': [
      {
        path: 'modifyPassword1',
        name: 'modifyPassword1',
        meta: {
          title: '修改密码',
          icon: 'fa-asterisk',
          routerType: 'topmenu'
        },
        component: () => import('@/page/selfInfoManage/updatePassword')
      }
    ]
  }
]
