import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import useUserStore from '@/store/user'
import useCommonStore from '@/store/common'

const mode = import.meta.env.MODE
console.log(
  '%c [ mode ]-6',
  'font-size:13px; background:pink; color:#bf2c9f;',
  mode
)

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/search/:name?',
    name: 'search',
    component: () => import('../views/Search.vue'),
  },
  {
    path: '/register/:name',
    name: 'register',
    component: () => import('../views/Register.vue'),
    meta: { auth: true }
  },
  {
    path: '/mine',
    name: 'mine',
    component: () => import('../views/Mine.vue'),
    meta: { auth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'home' }
  }
]

const router = createRouter({
  history: createWebHistory('/soul/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    if (to.name === 'home') return

    return { left: 0, top: 0 }

    // if (savedPosition) {
    //   return savedPosition
    // } else {
    //   return { left: 0, top: 0 }
    // }
  }
})

router.beforeEach((to, from, next) => {
  if (to.meta.auth && !useUserStore().address) {
    next('/')
    useUserStore().login()
    return
  }
  next()
})

export default router
