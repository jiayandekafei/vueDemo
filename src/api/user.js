import base from './base' // 导入接口域名列表
import instance from './http' // 导入http中创建的axios实例

const user = {
  // user list
  userList () {
    return instance.get(base.dev + '/user/list')
  },

  // user detail
  getUserInfo (userId) {
    return instance.get(base.dev + '/user/' + userId)
  }
}

export default user
