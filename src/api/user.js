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
  getGroupTree (params) {
    return instance.get(base.dev + '/user/grouptree', {params})
  },
  // delete user
  deleteUser (para) {
    return instance.post(base.dev + '/user/delete', JSON.stringify(para))
  },
  // delete mutil user
  batchDeleteUser (para) {
    return instance.post(base.dev + '/user/deleteBatch', JSON.stringify(para))
  },
  // check user's password
  checkPassword (params) {
    return instance.get(base.dev + '/user/password', {params})
  },

  // update password
  updatePassword (para) {
    return instance.post(base.dev + '/user/password', JSON.stringify(para))
  },

  // approve
  approve (para) {
    return instance.post(base.dev + '/user/approve', JSON.stringify(para))
  },

   // approve
   batchApprove (para) {
    return instance.post(base.dev + '/user/approveBatch', JSON.stringify(para))
  },
  // reject
  reject (para) {
    return instance.post(base.dev + '/user/reject', JSON.stringify(para))
  },
  // get user distribution data
  getUserPieData () {
    return instance.get(base.dev + '/user/pie')
  }
}

export default user
