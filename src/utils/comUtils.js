
import store from '@/store'
import { getToken } from '@/utils/auth'

/**
 * 判断是否是superuser 活PM
 */
export const isSuperUserOrPM = () => {
  const roles = store.getters.roles
  return getToken('superuser') === 'Y' || roles.some(item => item === 2)
}

/**
 * 获取具有某种权限的group
 */
export const getCurrentUserGroups = (role) => {
  var groups = []
  const groupRoles = store.getters.groupRole
  for (var prop in groupRoles) {
    if (groupRoles.hasOwnProperty(prop)) {
      groups.push(prop)
    }
  }
  return groups.join(',')
}

// get similarity compare type
export const getCompareTypes = () => {
  const types = [{
    value: 1,
    label: '主form'
  }, {
    value: 2,
    label: 'Filed数最多的form'
  }]

  return types
}
