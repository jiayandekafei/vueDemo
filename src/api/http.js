import axios from 'axios'
import router from '../router'
import store from '../store/index'
import { Message, MessageBox } from 'element-ui'
import { getToken } from '@/utils/auth'
/**
  * 提示函数
  * 禁止点击蒙层、显示一秒后关闭
  */
const tip = msg => {
  Message({
    message: msg,
    duration: 3000,
    showClose: true
  })
}

/**
  * 跳转登录页
  * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
  */
const toLogin = () => {
  router.replace({
    path: '/login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

/**
  * 请求失败后的错误统一处理
  * @param {Number} status 请求失败的状态码
  */
const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 400:
      tip('parameter error: ' + other)
      break
    // 401: 未登录状态，跳转登录页
    case 401:
      tip('invalid user name or password')
      toLogin()
      break
      // 403 token过期
      // 清除token并跳转登录页
    case 403:
      MessageBox.confirm('token过期，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        toLogin().then(() => {
          location.reload()// 为了重新实例化vue-router对象 避免bug
        })
      })
      break
      // 404请求不存在
    case 404:
      tip('请求的资源不存在')
      break
    case 500:
      tip(other)
      break
    default:
      break
  }
}

// 创建axios实例
var instance = axios.create({timeout: 1000 * 1200})
// 设置超时处理
instance.defaults.retry = 4
instance.defaults.retryDelay = 1000
// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/json'
instance.defaults.headers.put['Content-Type'] = 'application/json'
/**
  * 请求拦截器
  * 每次请求前，如果存在token则在请求头中携带token
  */
instance.interceptors.request.use(
  config => {
    // 登录流程控制中，根据本地是否存在token判断用户的登录情况
    // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
    // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
    // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
    const token = getToken('Token')
    token && (config.headers.Authorization = 'Bearer ' + token)
    return config
  },
  error => Promise.error(error))

// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  res => res.status === 200 ? Promise.resolve(res) : Promise.reject(res),
  // 请求失败
  error => {
    const { response } = error
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.data)
      return Promise.reject(response)
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      store.commit('changeNetworkSuccess', false)
      tip('网络异常!')
      router.push({path: '/login'})
    }
  })

export default instance
