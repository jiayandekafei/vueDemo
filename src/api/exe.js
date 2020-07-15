import base from './base' // 导入接口域名列表
import instance from './http' // 导入http中创建的axios实例

const exe = {
  // exstatus
  getExeStatus (params) {
    return instance.get(base.dev + '/exe/status', {params})
  }

}
export default exe
