import base from './base' // 导入接口域名列表
import instance from './http' // 导入http中创建的axios实例

const customer = {
  // Customer list
  getCustomerList (params) {
    return instance.get(base.dev + '/customer/list', {params})
  },

  // Customer detail
  getCustomerInfo (customerId) {
    return instance.get(base.dev + '/customer/' + customerId)
  },
  // update  Customer
  updateCustomer (reqBody) {
    return instance.put(base.dev + '/customer', JSON.stringify(reqBody))
  },
  // add  Customer
  addCustomer (reqBody) {
    return instance.post(base.dev + '/customer', JSON.stringify(reqBody))
  },

  // Customer detail
  checkCustomer (customername) {
    return instance.get(base.dev + '/customer/checkCustomer/' + customername)
  },
  // delete Customer
  deleteCustomer (CustomerId) {
    return instance.delete(base.dev + '/customer/' + CustomerId)
  },
  // delete Customer
  batchDeleteCustomer (para) {
    return instance.post(base.dev + '/customer/deleteBatch', para)
  }

}

export default customer
