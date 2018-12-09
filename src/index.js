import '@babel/polyfill'
import 'whatwg-fetch'

import Vue from 'vue'
import router from './routes/router'
import appView from './views/index.vue'
//自定义组件
import vueFetch from './plugin/vueFetch'

Vue.use(vueFetch)

const app = new Vue({
  router,
  ...appView
})

app.$mount('#app')
