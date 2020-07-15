import base from './base' // 导入接口域名列表
import instance from './http' // 导入http中创建的axios实例

const login = {
  // login
  login (params) {
    return instance.post(base.dev + '/login', JSON.stringify(params))
  },

  // register
  register (params) {
    console.log(JSON.stringify(params))
    return instance.post(base.dev + '/register', JSON.stringify(params))
  },
  // logout
  logout () {
    return instance.get(base.dev + '/signout')
  },
  // message
  getMessages (params) {
    return instance.get(base.dev + '/message', {params})
  },
  // get index statistics message
  getStatistics () {
    return instance.get(base.dev + '/statistics')
  }
}

export default login
