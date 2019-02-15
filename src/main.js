import Vue from 'vue'
import App from './App'
import router from './router'

import './assets/css/global.css'

import ElementUI from 'element-ui'
Vue.use(ElementUI)

import './assets/fonts/iconfont.css'

import Axios from 'axios'
// 给axios做配置
Axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 给axios配置拦截器
Axios.interceptors.request.use(
  function(config) {
    var token = window.sessionStorage.getItem('token')
    config.headers.Authorization = token
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)

Vue.prototype.$http = Axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
