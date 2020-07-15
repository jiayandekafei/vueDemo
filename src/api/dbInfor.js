import base from './base' // 导入接口域名列表
import instance from './http' // 导入http中创建的axios实例

const dbinfor = {
    // group list
    getDbInforList(params) {
        return instance.get(base.dev + '/dbinfor/list', { params })
    }
}

export default dbinfor