import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import HomeView from '../views/HomeView.vue'
import CityView from '../views/CityView.vue'
import RhythmView from '../views/RhythmView.vue'
import EventView from '../views/EventView.vue'
import OrdersView from '../views/OrdersView.vue'
import AuthView from '../views/AuthView.vue'
import SpotifyCallbackView from '../views/SpotifyCallbackView.vue'
const routes=[
 {path:'/',name:'home',component:HomeView},
 {path:'/cidade',name:'city',component:CityView},
 {path:'/seu-ritmo',name:'rhythm',component:RhythmView},
 {path:'/evento/:id',name:'event',component:EventView},
 {path:'/meus-ingressos',name:'orders',component:OrdersView},
 {path:'/login',name:'login',component:AuthView},
 {path:'/cadastro',name:'register',component:AuthView},
 {path:'/spotify/callback',name:'spotify-callback',component:SpotifyCallbackView},
 {path:'/:pathMatch(.*)*',redirect:'/'}
]
const router=createRouter({history:createWebHistory(),routes,scrollBehavior:()=>({top:0})})
router.beforeEach(to=>{if(to.meta.requiresAuth && !useAuthStore().token)return {name:'login',query:{redirect:to.fullPath}}})
export default router
