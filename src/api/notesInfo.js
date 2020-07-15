import base from './base' // 导入接口域名列表
import instance from './http' // 导入http中创建的axios实例

const notesInfo = {
  // export db info
  exportDBInfo (params) {
    return instance.get(base.dev + '/notes/db/export', {params})
  },

  // analysis  db similarity
  analyzeDBSimi (params) {
    return instance.get(base.dev + '/notes/db/analyze', {params})
  },
  // analysis  db similarity
  analyzeFormSimi (params) {
    return instance.get(base.dev + '/notes/db/analyze/form', {params})
  },

  // get DB similarity data
  getDBSimiData (params) {
    return instance.get(base.dev + '/notes/db/simi/list', {params})
  },

  // get DB similarity pie data
  getDBSimiPieData (params) {
    return instance.get(base.dev + '/notes/db/simi/pie', {params})
  },

  // get DB similarity data
  getExportedDBData (params) {
    return instance.get(base.dev + '/notes/db/list', {params})
  },

  // get form similarity data
  getFormSimiData (name) {
    return instance.get(base.dev + '/notes/db/form/simi/' + name)
  },

  // get form list
  getFormList (params) {
    return instance.get(base.dev + '/form/list', {params})
  },

  // get view list
  getViewList (params) {
    return instance.get(base.dev + '/view/list', {params})
  },

  // get view list
  getAgentList (params) {
    return instance.get(base.dev + '/agent/list', {params})
  } 
}
export default notesInfo
