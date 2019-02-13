import Vue from 'vue'
import App from './App'
import router from './router'

import './assets/css/global.css'

import ElementUI from 'element-ui'
Vue.use(ElementUI)

import './assets/fonts/iconfont.css'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
