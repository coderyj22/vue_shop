import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './common/css/index.scss'
import './plugins/element-ui'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import 'nprogress/nprogress.css'


Vue.use(VueQuillEditor)
Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false

// 全局过滤器
Vue.filter('dateFormat', (originValue) => {
  const dt = new Date(originValue)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + 1 + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')
  return `${y}年 ${m}月 ${d}日 ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
