import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import store from '../store'
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

let router = new Router({
  routes: [
        {
          path: '/',
          props: true,
          meta: {title: '云盘'},
          redirect: '/folder/file',
          component: () => import('@/views/layout/Layout'),
          children: [
            {
              path: '/folder/file',
              component: () => import('@/views/file/index'),
              props: true,
              meta: {title: '云盘'},
              children: [
                {
                  path: '/folder/1',
                  component: () => import('@/views/file/speed'),
                  props: true,
                  meta: {title: '进度'}
                },
                {
                  path: '/folder/2',
                  component: () => import('@/views/file/task'),
                  props: true,
                  meta: {title: '任务'},
                },
                {
                  path: '/folder/3',
                  component: () => import('@/views/file/member'),
                  props: true,
                  meta: {title: '成员'},
                },
                {
                  path: '/folder/4',
                  component: () => import('@/views/file/ganttChart'),
                  meta: {title: '甘特图'},
                },
                {
                  path: '/folder/5',
                  component: () => import('@/views/file/implement'),
                  meta: {title: '执行'},
                },
              ]
            },
            {
              path: '/folder/file/record',
              component: () => import('@/views/file/record'),
              props: true,
              meta: {title: '操作记录'},
            }
          ]
        },
        {
          path: '/login',
          component: () => import('@/views/layout/login'),
          props: true,
          meta: {title: '登录'},
        },
      {path: '*', component: () => import('@/views/404')}
  ]
})

router.beforeEach((to, _, next) => {
  /*路由发生改变修改页面的title */
  if (to.path === '/login')  next()
  let token = Vue.$cookies.get('token')
  // 增加判断条件
  if (!token && to.path !== '/login') return next('/login')
  next()
  if (to.meta.title) {
    document.title = to.meta.title
    store.commit('showLoading',true);
  }
})
router.afterEach(() =>{
  setTimeout(()=>{
    store.commit('showLoading',false)
  },600)
})
export default router