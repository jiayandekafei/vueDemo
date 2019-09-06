import base from './base' // 导入接口域名列表
import instance from './http' // 导入http中创建的axios实例

const role = {
  // role list
  getRoleList () {
    return instance.get(base.dev + '/role/list')
  }
}

export default role
