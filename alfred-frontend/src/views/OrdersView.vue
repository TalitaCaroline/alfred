<script setup>
import {ref,onMounted,computed} from 'vue'
import {usePreferences} from '../stores/preferences'
import {listOrders} from '../services/events'
import {useAuthStore} from '../stores/auth'
import {brl,dateParts} from '../utils'
const auth=useAuthStore(),pref=usePreferences(),remote=ref([]),error=ref(''),busy=ref(true)
onMounted(async()=>{if(!auth.token){busy.value=false;return}try{const r=await listOrders();remote.value=r.data}catch(e){error.value='A API está indisponível. Exibindo apenas reservas simuladas salvas neste navegador.'}finally{busy.value=false}})
const orders=computed(()=>[...pref.demoOrders,...remote.value])
</script>
<template><div class="page-top tickets-top"><div class="container"><span class="kicker light">✦ SUA AGENDA</span><h1>Minhas <em>reservas.</em></h1><p>Visualize suas simulações e volte a explorar o que acontece por aí.</p></div></div><div class="container orders-content"><div class="notice-inline">Reservas de ingresso.</div><p v-if="error" class="help-text">{{error}}</p><div v-if="busy">Carregando reservas...</div><div v-else-if="orders.length" class="orders-list"><article v-for="order in orders" :key="order.id" class="order-row"><div class="order-symbol">✳</div><div><span class="kicker">Ingresso #{{order.id}}</span><h3>{{order.event?.title}}</h3><p>{{order.event?.venue?.city}} · {{order.event?.startAt?dateParts(order.event.startAt).full:''}}</p><p>{{order.quantity}}x {{order.lot?.name}} · {{brl(order.total)}}</p></div><span class="order-demo-label">DEMO</span></article></div><div v-else class="empty-state"><h2>Ainda sem reservas.</h2><p>Escolha um evento e teste o fluxo de reserva.</p><router-link class="button button-dark" to="/">Explorar eventos ↗</router-link></div></div></template>
