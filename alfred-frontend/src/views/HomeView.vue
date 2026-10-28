<script setup>
import { computed,ref,onMounted,watch } from 'vue'
import EventCard from '../components/EventCard.vue'
import { CATEGORIES,CITIES } from '../utils'
import { listEvents } from '../services/events'
import { usePreferences } from '../stores/preferences'
const preferences=usePreferences()
const events=ref([]),loading=ref(true),demo=ref(false),error=ref(''),selectedCategory=ref('')
const city=computed({get:()=>preferences.city,set:value=>preferences.setCity(value)})
async function load(){loading.value=true;error.value='';try{const result=await listEvents({city:city.value,category:selectedCategory.value});events.value=result.data;demo.value=result.demo}catch(e){error.value=e.message}finally{loading.value=false}}
onMounted(load);watch([city,selectedCategory],load)
const featured=computed(()=>events.value.slice(0,8))
</script>
<template>
 <section class="hero-section"><div class="hero-noise"></div><div class="container hero-content">
  <div class="hero-left"><div class="eyebrow"><span class="sparkle-icon">✦</span> A SUA PRÓXIMA EXPERIÊNCIA COMEÇA AQUI</div>
   <h1>Sua próxima história <em>acontece lá fora.</em></h1>
   <p>Ingressos, descobertas e experiências que combinam com você. Do cinema à pista de dança, tem um mundo acontecendo perto.</p>
   <div class="hero-buttons"><router-link to="/cidade" class="button button-primary">Explorar minha cidade <span>↗</span></router-link><router-link to="/seu-ritmo" class="button button-ghost">Descobrir meu ritmo <span>♫</span></router-link></div>
   <div class="hero-proof"><div class="mini-dots"><span>✳</span><span>✦</span><span>♫</span></div><span>Seis universos. Um só lugar.</span></div>
  </div>
  <div class="hero-poster" aria-hidden="true"><div class="hero-poster-disc"><span class="disc-middle"></span></div><div class="hero-poster-bottom"><small>SEU PRÓXIMO FAVORITO</small><strong>Você ainda não sabe.<br/>Mas vai amar.</strong></div><div class="hero-poster-star">✳</div><div class="poster-ticket">ALFRED / ADMIT ONE <span>↗</span></div></div>
 </div></section>
 <section class="section categories-section"><div class="container"><div class="section-heading"><div><span class="kicker">QUAL A SUA VIBE?</span><h2>O que vamos viver hoje?</h2></div><p>Tem sempre algo novo para descobrir.</p></div>
  <div class="category-row"><button class="category-chip" :class="{'chip-active':selectedCategory===''}" @click="selectedCategory=''">✦ Tudo</button><button v-for="category in CATEGORIES" :key="category.slug" class="category-chip" :class="{'chip-active':selectedCategory===category.slug}" @click="selectedCategory=category.slug"><span>{{category.icon}}</span> {{category.label}}</button></div>
 </div></section>
 <section class="section events-section"><div class="container"><div class="section-heading"><div><span class="kicker">AGENDA QUENTE</span><h2>Tem coisa boa chegando <span class="heading-spark">✳</span></h2></div><div class="right-control"><label for="home-city">Em</label><select id="home-city" v-model="city" class="city-select"><option value="">Todas as cidades</option><option v-for="c in CITIES" :key="c">{{c}}</option></select></div></div>
  <p v-if="error" class="notice-error" role="alert">{{error}}</p><p v-if="loading">Buscando experiências...</p><div v-else-if="featured.length" class="events-grid"><EventCard v-for="event in featured" :key="event.id" :event="event"/></div><div v-else class="empty-state"><h3>A agenda está respirando...</h3><p>Não encontramos eventos neste filtro. Experimente outra cidade ou categoria.</p><button class="button button-dark" @click="selectedCategory='';city=''">Ver tudo</button></div>
  <div class="center-action"><router-link to="/cidade" class="text-link">Ver a agenda completa <span>↗</span></router-link></div>
 </div></section>
 <section class="container"><div class="music-banner"><div class="music-banner-content"><h2>A gente entende<br/>o seu <i>ritmo.</i></h2><p>Escolha seus estilos ou conecte o Spotify para conhecer os eventos que fazem seu coração acelerar.</p><router-link class="button button-lime" to="/seu-ritmo">Aproveite e conheça outras funcionalidades <span>↗</span></router-link></div><div class="music-decoration" aria-hidden="true"><div class="vinyl-record"><span>ALFRED<br/>SEU RITMO</span></div><span class="music-floating-note">♫</span></div></div></section>
 <section class="section process-section container"><div class="section-heading"><div><span class="kicker">SIMPLES ASSIM</span><h2>Da descoberta à experiência.</h2></div></div><div class="process-grid"><div><span>01</span><h3>Descubra</h3><p>Encontre eventos por cidade, interesse e tipo.</p></div><div><span>02</span><h3>Escolha</h3><p>Veja datas, locais, horários e valores.</p></div><div><span>03</span><h3>Viva</h3><p>Simule uma reserva no protótipo e conheça a jornada.</p></div></div></section>
</template>
