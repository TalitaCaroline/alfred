<script setup>
import {ref,onMounted,computed} from 'vue'
import {useRoute,useRouter} from 'vue-router'
import {getEvent,createDemoOrder} from '../services/events'
import {useAuthStore} from '../stores/auth'
import {usePreferences} from '../stores/preferences'
import {brl,dateParts,categoryLabel} from '../utils'
const route=useRoute(),router=useRouter(),auth=useAuthStore(),pref=usePreferences()
const event=ref(null),isDemo=ref(false),busy=ref(false),error=ref(''),success=ref(''),selectedLot=ref(''),quantity=ref(1)
onMounted(async()=>{try{const r=await getEvent(route.params.id);event.value=r.data;isDemo.value=r.demo;selectedLot.value=event.value?.lots?.[0]?.id||''}catch(e){error.value=e.message}})
const currentLot=computed(()=>event.value?.lots?.find(l=>String(l.id)===String(selectedLot.value)))
const total=computed(()=>Number(currentLot.value?.price||0)*quantity.value)
async function reserve(){error.value='';success.value='';if(!event.value || !currentLot.value)return
 if(!auth.token && !isDemo.value){router.push({name:'login',query:{redirect:route.fullPath}});return}
 busy.value=true
 try{
  if(isDemo.value){
   if(quantity.value>currentLot.value.available)throw new Error('Quantidade indisponível neste lote.')
   pref.addDemoOrder({id:`LOCAL-${Date.now()}`,eventId:event.value.id,quantity:quantity.value,total:total.value,createdAt:new Date().toISOString(),status:'DEMO',event:event.value,lot:currentLot.value})
  }else{
   await createDemoOrder(Number(selectedLot.value),quantity.value)
  }
  success.value='Atualizar página para pagamento.'
 }catch(e){error.value=e.message||'Não foi possível reservar.'}finally{busy.value=false}
}
</script>
<template>
 <div v-if="!event" class="container detail-loading"><h2>{{error||'Carregando evento...'}}</h2><router-link to="/">← Voltar</router-link></div>
 <template v-else><div class="detail-hero" :class="`art-${event.accent||'violet'}`"><div class="container detail-hero-content"><router-link to="/" class="light-back">← Voltar à programação</router-link><div class="detail-hero-title"><span class="event-pill detail-pill">{{categoryLabel(event.category)}}</span><h1>{{event.title}}</h1><p>⌖ {{event.venue?.name}} · {{event.venue?.city}}/{{event.venue?.state}}</p></div><div class="detail-decor" aria-hidden="true">✳</div></div></div>
 <div class="container detail-layout"><div class="detail-main"><span class="kicker">SOBRE A EXPERIÊNCIA</span><h2>Para viver e lembrar.</h2><p class="detail-description">{{event.description}}</p><div class="detail-facts"><div><span>◷</span><strong>Quando</strong><p>{{dateParts(event.startAt).full}}, {{dateParts(event.startAt).time}}</p></div><div><span>⌖</span><strong>Onde</strong><p>{{event.venue?.name}}<br/>{{event.venue?.address}}, {{event.venue?.city}}/{{event.venue?.state}}</p></div><div><span>♫</span><strong>Estilo</strong><p>{{event.genres?.length ? event.genres.join(' · ') : categoryLabel(event.category)}}</p></div></div><div class="disclaimer"><strong>Eventos</strong> na sua cidade.</div></div>
 <aside class="checkout-card"><div class="checkout-top"><span>SEU LUGAR NA EXPERIÊNCIA</span><h3>Selecionar ingressos</h3></div><form @submit.prevent="reserve"><label class="field-label" for="lot">Tipo de ingresso</label><select class="form-control" id="lot" v-model="selectedLot"><option v-for="lot in event.lots" :key="lot.id" :value="lot.id" :disabled="lot.available<1">{{lot.name}} · {{brl(lot.price)}} ({{lot.available}} disponíveis)</option></select><label class="field-label" for="qty">Quantidade</label><select class="form-control" id="qty" v-model.number="quantity"><option v-for="n in Math.min(6,Number(currentLot?.available||0))" :key="n" :value="n">{{n}} ingresso{{n>1?'s':''}}</option></select><div class="checkout-total"><span>Total</span><strong>{{brl(total)}}</strong></div><button type="submit" class="button button-primary button-full" :disabled="busy||!currentLot||!Number(currentLot.available)">{{busy?'Registrando...':'Simular reserva'}} ↗</button><small class="help-text">Pagamento via PIX 5% de desconto</small><p v-if="error" class="notice-error" role="alert">{{error}}</p><p v-if="success" class="notice-success" role="status">{{success}} <router-link to="/meus-ingressos">Ver em Meus ingressos</router-link></p></form></aside>
 </div></template>
</template>
