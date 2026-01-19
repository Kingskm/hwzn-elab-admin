import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import VueRouter from 'vue-router'
import Cookies from 'js-cookie'
import Layout from '@/layout'
import { Message } from 'element-ui'
import { 
  api_getUserInfoByToken,
} from '@/api/user-center'
import { 
	goLoginPage 
} from '@/utils/common'
export const constantRoutes = [
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    name: 'index',
    path: '/index',
    component: Layout,
    redirect: '/index',
    children: [
      {
      path: '/index',
      name: 'index',
      component: () => import('@/views/index'),
      meta: { title: '首页', icon: 'el-icon-s-home' }
      },
    ]
  },

  {
    path: '/news-center',
    name: 'news-center',
    component: Layout,
    redirect:'/news-center/news-management',
    meta: { title: '新闻中心', icon: 'el-icon-s-comment' },
    children: [
      {
        path: '/news-center/news-management',
        name: 'news-management',
        component: () => import('@/views/news-center/news-management'),
        meta: { title: '新闻管理' },
      },
      {
        path: '/news-center/news-op',
        name: 'news-op',
        component: () => import('@/views/news-center/news-op'),
        meta: { title: '新闻操作' },
        hidden:true
      },
      {
        path: '/news-center/banner-management',
        name: 'banner-management',
        component: () => import('@/views/news-center/banner-management'),
        meta: { title: '横幅管理' },
      },
    ]
  },

  {
    path: '/experiment-center',
    name: 'experiment-center',
    component: Layout,
    redirect:'/experiment-center/experiment-type-management',
    meta: { title: '实验中心', icon: 'el-icon-s-help' },
    children: [
      {
        path: '/experiment-center/experiment-type-management',
        name: 'experiment-type-management',
        component: () => import('@/views/experiment-center/experiment-type-management'),
        meta: { title: '实验类别管理' },
      },
      {
        path: '/experiment-center/experiment-management',
        name: 'experiment-management',
        component: () => import('@/views/experiment-center/experiment-management'),
        meta: { title: '实验管理' },
      },
      {
        path: '/experiment-center/experiment-op',
        name: 'experiment-op',
        component: () => import('@/views/experiment-center/experiment-op'),
        meta: { title: '实验操作' },
        hidden:true
      },
      {
        path: '/experiment-center/experiment-pre',
        name: 'experiment-pre',
        component: () => import('@/views/experiment-center/experiment-pre/index.vue'),
        meta: { title: '前置条件' },
        hidden:true
      },
      {
        path: '/experiment-center/item-management',
        name: 'item-management',
        component: () => import('@/views/experiment-center/item-management'),
        meta: { title: '分项管理' },
      },
      {
        path: '/experiment-center/item-op',
        name: 'item-op',
        component: () => import('@/views/experiment-center/item-op'),
        meta: { title: '分项操作' },
        hidden:true
      },
      {
        path: '/experiment-center/result-list',
        name: 'result-list',
        component: () => import('@/views/experiment-center/result-list'),
        meta: { title: '成绩列表' },
      },
      {
        path: '/experiment-center/unity-library',
        name: 'unity-library',
        component: () => import('@/views/experiment-center/unity-library'),
        meta: { title: '课件资源管理'},
      },
    ]
  },

  {
    path: '/teach-center',
    name: 'teach-center',
    component: Layout,
    redirect:'/teach-center/course-type-management',
    meta: { title: '教学中心', icon: 'el-icon-office-building' },
    children: [
      {
        path: '/teach-center/course-type-management',
        name: 'course-type-management',
        component: () => import('@/views/teach-center/course-type-management'),
        meta: { title: '课程类别管理' },
      },
      {
        path: '/teach-center/course-management',
        name: 'course-management',
        component: () => import('@/views/teach-center/course-management'),
        meta: { title: '课程管理' },
      },
      {
        path: '/teach-center/course-op',
        name: 'course-op',
        component: () => import('@/views/teach-center/course-op'),
        meta: { title: '课程操作' },
        hidden:true
      },
      {
        path: '/teach-center/resource-type-management',
        name: 'resource-type-management',
        component: () => import('@/views/teach-center/resource-type-management'),
        meta: { title: '资源类别管理' },
      },
      {
        path: '/teach-center/resource-management',
        name: 'resource-management',
        component: () => import('@/views/teach-center/resource-management'),
        meta: { title: '资源管理' },
      },
      {
        path: '/teach-center/resource-op',
        name: 'resource-op',
        component: () => import('@/views/teach-center/resource-op'),
        meta: { title: '资源操作' },
        hidden:true
      },
      {
        path: '/teach-center/question-type-management',
        name: 'question-type-management',
        component: () => import('@/views/teach-center/question-type-management'),
        meta: { title: '题目类别管理' },
      },
      {
        path: '/teach-center/question-management',
        name: 'question-management',
        component: () => import('@/views/teach-center/question-management'),
        meta: { title: '题目管理' },
      },
      {
        path: '/teach-center/question-op',
        name: 'question-op',
        component: () => import('@/views/teach-center/question-op'),
        meta: { title: '题目操作' },
        hidden:true
      },
      {
        path: '/teach-center/test-paper-management',
        name: 'test-paper-management',
        component: () => import('@/views/teach-center/test-paper-management'),
        meta: { title: '试卷管理' },
      },
      {
        path: '/teach-center/test-paper-op',
        name: 'test-paper-op',
        component: () => import('@/views/teach-center/test-paper-op'),
        meta: { title: '试卷操作' },
        hidden:true
      },
      {
        path: '/teach-center/exam-management',
        name: 'exam-management',
        component: () => import('@/views/teach-center/exam-management'),
        meta: { title: '考试管理' },
      },
      {
        path: '/teach-center/exam-config',
        name: 'exam-config',
        component: () => import('@/views/teach-center/exam-config'),
        meta: { title: '考试配置' },
        hidden:true
      },
      {
        path: '/teach-center/exam-result-list',
        name: 'exam-result-list',
        component: () => import('@/views/teach-center/exam-result-list'),
        meta: { title: '考试成绩列表' },
        hidden:true
      },
      {
        path: '/teach-center/exam-result-detail',
        name: 'exam-result-detail',
        component: () => import('@/views/teach-center/exam-result-detail'),
        meta: { title: '考试成绩详情' },
        hidden:true
      },
    ]
  },

  {
    path: 'competition-center',
    name: 'competition-center',
    component: Layout,
    redirect:'/competition-center/competition-management',
    meta: { title: '竞赛中心', icon: 'el-icon-s-data' },
    children: [
      {
        path: '/competition-center/competition-management',
        name: 'competition-management',
        component: () => import('@/views/competition-center/competition-management'),
        meta: { title: '竞赛管理' },
      },
      {
        path: '/activity-center/competition-op',
        name: 'competition-op',
        component: () => import('@/views/competition-center/competition-op'),
        meta: { title: '竞赛操作' },
        hidden:true
      },
      {
        path: '/activity-center/competition-detail',
        name: 'competition-detail',
        component: () => import('@/views/competition-center/competition-detail'),
        meta: { title: '竞赛详情' },
        hidden:true
      },
    ]
  },

  {
    path: '/business-center',
    name: 'business-center',
    component: Layout,
    redirect:'/business-center/application-management',
    meta: { title: '业务中心', icon: 'el-icon-s-cooperation' },
    children: [
      {
        path: '/business-center/application-management',
        name: 'application-management',
        component: () => import('@/views/business-center/application-management'),
        meta: { title: '申请管理' },
      },
    ]
  },

  {
    path: '/user-center',
    name: 'user-center',
    component: Layout,
    redirect:'/user-center/department-management',
    meta: { title: '用户中心', icon: 'el-icon-user-solid' },
    children: [
      {
        path: '/user-center/department-management',
        name: 'department-management',
        component: () => import('@/views/user-center/department-management'),
        meta: { title: '院系管理' },
      },
      {
        path: '/user-center/class-management',
        name: 'class-management',
        component: () => import('@/views/user-center/class-management'),
        meta: { title: '班级管理' },
      },
      {
        path: '/user-center/user-management',
        name: 'user-management',
        component: () => import('@/views/user-center/user-management'),
        meta: { title: '用户管理' },
      },
    ]
  },

  {
    path: '/log-center',
    name: 'log-center',
    component: Layout,
    redirect: '/log-center/operation-log',
    meta: { title: '日志中心', icon: 'el-icon-s-order' },
    children: [
      {
        path: '/log-center/operation-log',
        name: 'operation-log',
        component: () => import('@/views/log-center/operation-log'),
        meta: { title: '操作日志'},
      },
      {
        path: '/log-center/login-log',
        name: 'login-log',
        component: () => import('@/views/log-center/login-log'),
        meta: { title: '登录日志' },
      },
      {
        path: '/log-center/account-log',
        name: 'account-log',
        component: () => import('@/views/log-center/account-log'),
        meta: { title: '账户日志'},
        hidden: true
      },
    ]
  },

  { path: '*', redirect: '/index', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const originaiPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location){
  return originaiPush.call(this,location).catch(err => err)
}

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

router.beforeEach( async (to, from, next) => {

  if(localStorage.getItem('itemOpInfo') && to.name!=='unity-library' && to.name!=='item-op'){
    localStorage.removeItem('itemOpInfo')
  }

  //从Cookie上获取token，从vuex和localStorage中取userInfo
  let token =  Cookies.get('token') || null
  let userInfo = JSON.parse(localStorage.getItem('userInfo')) || null

  //如果token不存在，直接去登录页
  if(token==null){
    goLoginPage(window.location.href)
  }else{
    if(userInfo===null){
      //如果token存在，userInfo不存在，则更新userInfo
      const res =await api_getUserInfoByToken({token})
      if(res && res.code===0){
        localStorage.setItem("userInfo",JSON.stringify(res.data))
        if(res.data.role!==1){
          Message.error("非管理员用户不可进入管理后台")
          goLoginPage(window.location.href)
        }else{
          if (to.meta.title) {
            document.title = to.meta.title;
          }
          next()
        }
      }
    }else{
      if(userInfo.role!==1){
        Message.error("非管理员用户不可进入管理后台")
        goLoginPage(window.location.href)
      }else{
        if (to.meta.title) {
          document.title = to.meta.title;
        }
        next()
      }
    }
  }
  
})

export default router
