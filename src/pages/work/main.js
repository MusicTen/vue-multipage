import Vue from 'vue'
import App from './App.vue'
import '@/utils/responsive.js'
Vue.config.productionTip = false

// if (process.env.VUE_APP_ISPRODUCTION !== 'true') {
//   const Vconsole = require('vconsole')
//   new Vconsole()
// }
new Vue({
  render: h => h(App)
}).$mount('#app');