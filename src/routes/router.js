import Vue from 'vue'
import VueRouter from 'vue-router'

// import notFoundView from '../views/notFoundView.vue' //错误页面

Vue.use(VueRouter)

const serverPath = _path => `/${_path}`

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect:serverPath('index')
    },
    {
      path: serverPath('index'),
      component : m => import('../views/index.vue').then(m => m.default),
    },
    // {path: '*', component: notFoundView}
    {path: '*', redirect:serverPath('index')}
  ]
})

export default router
