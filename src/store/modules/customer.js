
const customer = {
  state: {
    addCustomerDialog: {
      title: '',
      type: 'add'
    }
  },
  getters: {
    addCustomerDialog: state => state.addCustomerDialog
  },
  mutations: {
    SET_CUSTOMER_DIALOG_TITLE: (state, type) => {
      if (type === 'add') {
        state.addCustomerDialog.title = '新增客户'
        state.addCustomerDialog.type = 'add'
      } else {
        state.addCustomerDialog.title = '编辑客户信息'
        state.addCustomerDialog.type = 'edit'
      }
    }
  },
  actions: {

  }
}

export default customer
