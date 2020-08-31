import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import config from './config'

Vue.config.productionTip = false

Vue.prototype.$http = axios.create({
  baseURL: config.apiUrl,
  headers: { 'Access-Control-Allow-Origin': '*' }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
