import base from './base' // 导入接口域名列表
import instance from './http' // 导入http中创建的axios实例

const group = {
  // user list
  getGroupList () {
    return instance.get(base.dev + '/group/list')
  }
}

export default group
