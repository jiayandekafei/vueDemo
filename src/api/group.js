import base from './base' // 导入接口域名列表
import instance from './http' // 导入http中创建的axios实例

const group = {
  // group list
  getGroupList (params) {
    return instance.get(base.dev + '/group/list', {params})
  },

  // group detail
  getGroupInfo (groupId) {
    return instance.get(base.dev + '/group/' + groupId)
  },
  // update  Group
  updateGroup (reqBody) {
    return instance.put(base.dev + '/group', JSON.stringify(reqBody))
  },
  // add  Group
  addGroup (reqBody) {
    return instance.post(base.dev + '/group', JSON.stringify(reqBody))
  },

  // Group detail
  checkGroup (groupname) {
    return instance.get(base.dev + '/group/checkGroup/' + groupname)
  },
  // delete Group
  deleteGroup (groupId) {
    return instance.delete(base.dev + '/group/' + groupId)
  },
  // delete Group
  batchDeleteGroup (para) {
    return instance.post(base.dev + '/group/deleteBatch', para)
  }
}

export default group
