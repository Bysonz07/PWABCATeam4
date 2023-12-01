import {createRouter, createWebHistory} from 'vue-router'
import ProjectAkhir from './../components/ProjectAkhir.vue'
import Home from './../components/Home.vue'
import About from './../components/About.vue'

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/about",
        name:"About",
        component: About
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_BASE_URL),
    routes
})

export default router