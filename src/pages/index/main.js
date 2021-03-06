import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)

Vue.config.productionTip = false // 暂不起作用，在配置文件统一处理

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
