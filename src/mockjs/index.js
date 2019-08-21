import Mock from 'mockjs'

import userAPI from './user'

// 设置全局延时 没有延时的话有时候会检测不到数据变化 建议保留
Mock.setup({
  timeout: '300-600'
})

// user相关
Mock.mock(/\/login\/login/, 'get', userAPI.login)
Mock.mock(/\/user\/logout/, 'get', userAPI.logout)
Mock.mock(/\/user\/info\/get/, 'get', userAPI.getUserInfo)
Mock.mock(/\/user\/list\/get/, 'get', userAPI.getUserList)
