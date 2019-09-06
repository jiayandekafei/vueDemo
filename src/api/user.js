import base from './base' // 导入接口域名列表
import instance from './http' // 导入http中创建的axios实例

const user = {
  // user list
  getUserList (params) {
    console.log(JSON.stringify(params))
    return instance.get(base.dev + '/user/list', {params})
  },

  // user detail
  getUserInfo (userId) {
    return instance.get(base.dev + '/user/' + userId)
  },
  // update  user
  updateUserInfo (reqBody) {
    return instance.put(base.dev + '/user', JSON.stringify(reqBody))
  },

  // user detail
  checkUser (username) {
    return instance.get(base.dev + '/user/checkUser/' + username)
  },

  // get group tree
  getGroupTree (userId) {
    return instance.get(base.dev + '/user/grouptree/' + userId)
  }

}

export default user
