import Vue from 'vue'
import VueRouter from 'vue-router'
const Home = () =>
    import ('../views/Home.vue')
const api = () =>
    import ('../views/api.vue')
Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/api',
        name: 'api',
        component: api,
    },

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router