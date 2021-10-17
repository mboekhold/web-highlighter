import Vue from 'vue'
import VueRouter from 'vue-router'
import ColorPicker from '../components/ColorPicker.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/color_picker',
    name: 'ColorPicker',
    component: ColorPicker
  }
]

const router = new VueRouter({
  routes
})

export default router
