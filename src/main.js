import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import '@/icons' // icon
import '@/assets/icon/iconfont.css'
import '@/permission' // permission control

//全局引入Cookie
import Cookies from 'js-cookie'
Vue.prototype.$cookies = Cookies
import md5 from 'js-md5';
Vue.prototype.$md5 = md5;
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
Vue.prototype.$dayjs = dayjs;
dayjs.extend(duration)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
import upLoader from 'vue-simple-uploader'
Vue.use(upLoader)

import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
