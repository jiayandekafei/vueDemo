import base from './base' // 导入接口域名列表
import instance from './http' // 导入http中创建的axios实例

const user = {
  // user list
  getUserList (params) {
    return instance.get(base.dev + '/user/list', {params})
  },

  // user detail
  getUserInfo (userId) {
    return instance.get(base.dev + '/user/' + userId)
  },
  // update  user
  updateUser (reqBody) {
    return instance.put(base.dev + '/user', JSON.stringify(reqBody))
  },
  // add  user
  addUser (reqBody) {
    return instance.post(base.dev + '/user', JSON.stringify(reqBody))
  },
  // user detail
  checkUser (username) {
    return instance.get(base.dev + '/user/check/' + username)
  },

  // get group tree
  getGroupTree (userId) {
    return instance.get(base.dev + '/user/grouptree/' + userId)
  },
  // delete user
  deleteUser (userId) {
    return instance.delete(base.dev + '/user/' + userId)
  },
  // delete user
  batchDeleteUser (para) {
    return instance.post(base.dev + '/user/deleteBatch', para)
  },
  // check user's password
  checkPassword (para) {
    return instance.get(base.dev + '/user/password', para)
  },

  // update password
  updatePassword (para) {
    return instance.post(base.dev + 'user/password', JSON.stringify(para))
  }
}

export default user
