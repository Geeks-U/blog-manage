import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/articlemanage'
  },
  {
    path: '/settings',
    component: () => import('@/views/settings/index.vue')
  },
  {
    path: '/articlemanage',
    component: () => import('@/views/articlemanage/index.vue'),
    redirect: '/articlemanage/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/articlemanage/home/index.vue')
      },
      {
        path: 'articlelist',
        name: 'ArticleList',
        component: () => import('@/views/articlemanage/articlelist/index.vue')
      },
      {
        path: 'topics',
        name: 'Topics',
        component: () => import('@/views/articlemanage/topics/index.vue')
      }
    ]
  },
  {
    path: '/articlecreate',
    name: 'ArticleCreate',
    component: () => import('@/views/articlecreate/index.vue')
  },
  {
    path: '/articleedit/:id',
    name: 'ArticleEdit',
    component: () => import('@/views/articleedit/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 前置守卫检查 sessionStorage 中是否已配置
router.beforeEach((to, _, next) => {
  if (import.meta.env.PROD) {
    const url = sessionStorage.getItem('SUPABASE_URL')
    const key = sessionStorage.getItem('SUPABASE_ANON_KEY')
    const isConfigured = !!(url && key)

    if (!isConfigured && to.path !== '/settings') {
      next('/settings')
      return
    }
    if (isConfigured && to.path === '/settings') {
      next('/')
      return
    }
  }
  next()
})

export default router
