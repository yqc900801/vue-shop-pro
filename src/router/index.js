import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import Users from '@/components/User'
Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users }
      ]
    }
  ]
})
// 导航守卫，检测是否登录，没有登录就调到登录页
router.beforeEach((to, from, next) => {
  // 访问login
  if (to.path === '/login') {
    return next()
  }
  // 访问非login
  if (to.path !== '/login') {
    var token = sessionStorage.getItem('token')
    if (!token) {
      alert('请先登录')
      return next('/login')
    }
    return next()
  }
})

export default router
