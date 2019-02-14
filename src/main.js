import Vue from 'vue'
import App from './App'
import router from './router'

import './assets/css/global.css'

import ElementUI from 'element-ui'
Vue.use(ElementUI)

import './assets/fonts/iconfont.css'

import axios from 'axios'
// 给axios做配置
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
