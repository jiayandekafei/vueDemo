import base from './base' // 导入接口域名列表
import instance from './http' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块

const login = {
  // login
  login (params) {
    return instance.post(base.dev + '/login', JSON.stringify(params))
  },

  // register
  register (params) {
    return instance.post(base.dev + '/user/sign', qs.stringify(params))
  }

}

export default login
