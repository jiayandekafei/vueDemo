import base from './base' // 导入接口域名列表
import instance from './http' // 导入http中创建的axios实例

const aae = {
  // export db info
  transform (params) {
    return instance.get(base.dev + '/aae/transform', {params})
  },
 // export db info
 downLoad () {
  return instance.get(base.dev + '/aae/download')
},
}
export default aae
