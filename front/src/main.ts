import { createApp } from 'vue'
import { Buffer } from 'buffer'
import './assets/styles/element-theme.scss'
import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/en' //
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
import store from './store'

// svg图标
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon.vue'

import App from './App.vue'
// import router from './router'
import '@/assets/styles/global.scss'
import router from './router'


if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer
}

if (import.meta.env.MODE === 'production') {
  console.log = () => {}
  console.warn = () => {}
  console.error = () => {}
}

const app = createApp(App)

app.config.globalProperties.$getImgUrl = (path: string) =>
  new URL(`/src/assets/img/${path}`, import.meta.url).href

app.use(ElementPlus, {
  locale: locale
})

app.use(store)
app.use(router)

app.component('svg-icon', SvgIcon)

app.mount('#app')
