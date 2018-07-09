import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import AddQuestion from './views/Add-question.vue'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/add-question',
      name: 'add question',
      component: AddQuestion
    }
  ]
})
