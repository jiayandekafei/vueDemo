
const group = {
  state: {
    addGroupDialog: {
      title: '',
      type: 'add'
    }
  },
  getters: {
    addGroupDialog: state => state.addGroupDialog
  },
  mutations: {
    SET_GROUP_DIALOG_TITLE: (state, type) => {
      if (type === 'add') {
        state.addGroupDialog.title = '新增项目'
        state.addGroupDialog.type = 'add'
      } else {
        state.addGroupDialog.title = '编辑项目信息'
        state.addGroupDialog.type = 'edit'
      }
    }
  },
  actions: {

  }
}

export default group
