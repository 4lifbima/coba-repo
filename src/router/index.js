import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../supabase'
import Auth from '../views/Auth.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/auth',
            name: 'Auth',
            component: Auth,
            meta: { guest: true }
        },
        {
            path: '/',
            name: 'Dashboard',
            component: () => import('../views/Dashboard.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/profile',
            name: 'Profile',
            component: () => import('../views/Profile.vue'),
            meta: { requiresAuth: true }
        }
    ]
})

router.beforeEach(async (to, from, next) => {
    const { data: { session } } = await supabase.auth.getSession()

    if (to.meta.requiresAuth && !session) {
        next('/auth')
    } else if (to.meta.guest && session) {
        next('/')
    } else {
        next()
    }
})

export default router
