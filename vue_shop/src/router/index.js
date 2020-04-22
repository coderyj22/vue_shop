import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// import Login from 'components/Login/Login'
// import Home from 'views/Home/Home'

// import Welcome from 'components/Welcome/Welcome'
// import Users from 'views/Users/Users'
// import Rights from 'components/power/Rights'
// import Roles from 'components/power/Roles'
// import Category from 'components/Goods/Category'
// import Params from 'components/Goods/Params'
// import List from "components/Goods/List"
// import Add from 'components/Goods/Add'
// import Order from 'components/Order/Order'
// import Report from 'components/Report/Report'

const Home = () => import(/* webpackChunkName: "login_home_welcome" */'views/Home/Home')
const Login = () => import(/* webpackChunkName: "login_home_welcome" */'components/Login/Login')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */'components/Welcome/Welcome')

const Users = () => import(/* webpackChunkName: "users_rights_roles" */'views/Users/Users')
const Rights = () => import(/* webpackChunkName: "users_rights_roles" */'components/power/Rights')
const Roles = () => import(/* webpackChunkName: "users_rights_roles" */'components/power/Roles')

const Category = () => import(/* webpackChunkName: "category_params_list_add" */'components/Goods/Category')
const Params = () => import(/* webpackChunkName: "category_params_list_add" */'components/Goods/Params')
const List = () => import(/* webpackChunkName: "category_params_list_add" */'components/Goods/List')
const Add = () => import(/* webpackChunkName: "category_params_list_add" */'components/Goods/Add')

const Order = () => import(/* webpackChunkName: "order_report" */'components/Order/Order')
const Report = () => import(/* webpackChunkName: "order_report" */'components/Report/Report')

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/categories',
        component: Category
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: List,
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/orders',
        component: Order
      },
      {
        path: '/reports',
        component: Report
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表是从那个路径跳转未来
  // next 直接调用表示放行，如next()  next('/login')这样调用代表强制跳转到那个路径
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})

export default router
