
export const topRouterMap = [
  {
    'parentName': 'infoModify',
    'data': [
      {
        path: 'infoModify1',
        name: 'infoModify1',
        meta: {
          title: '修改信息子菜单1',
          icon: 'fa-asterisk',
          routerType: 'topmenu'
        },
        component: () => import('@/page/selfInfoManage/infoModify')
      }
    ]
  }
]
