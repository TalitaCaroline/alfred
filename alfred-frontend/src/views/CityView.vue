<script setup>
import {ref,computed,onMounted,watch} from 'vue'
import { listEvents,listVenues } from '../services/events'
import {usePreferences} from '../stores/preferences'
import {CITIES,CATEGORIES,distanceKm,dateParts} from '../utils'
import EventCard from '../components/EventCard.vue'
const pref=usePreferences(),events=ref([]),venues=ref([]),demo=ref(false),loading=ref(true),geo=ref(null),geoError=ref(''),search=ref(''),category=ref('')
const city=computed({get:()=>pref.city,set:value=>{pref.setCity(value);geo.value=null}})
async function load(){loading.value=true;try{const [e,v]=await Promise.all([listEvents(),listVenues()]);events.value=e.data;venues.value=v.data;demo.value=e.demo||v.demo}catch(e){geoError.value=e.message}finally{loading.value=false}}
onMounted(load)
function locate(){geoError.value='';if(!navigator.geolocation){geoError.value='Seu navegador não oferece geolocalização.';return}navigator.geolocation.getCurrentPosition(pos=>{geo.value={lat:pos.coords.latitude,lng:pos.coords.longitude};pref.setCity('')},()=>{geoError.value='Permissão de localização não concedida. Escolha a cidade manualmente.'},{enableHighAccuracy:false,timeout:12000})}
const filtered=computed(()=>events.value.filter(e=>{
 const lat=Number(e.venue?.latitude),lng=Number(e.venue?.longitude)
 const close=geo.value?Number.isFinite(lat)&&Number.isFinite(lng)&&distanceKm(geo.value.lat,geo.value.lng,lat,lng)<=80:(!city.value||e.venue?.city===city.value)
 return close && (!category.value||e.category===category.value) && (!search.value||e.title.toLowerCase().includes(search.value.toLowerCase()))
}))
const shownVenues=computed(()=>venues.value.filter(v=>geo.value?distanceKm(geo.value.lat,geo.value.lng,Number(v.latitude),Number(v.longitude))<=80:!city.value||v.city===city.value).map(v=>({...v,upcoming:filtered.value.filter(e=>e.venueId===v.id).sort((a,b)=>new Date(a.startAt)-new Date(b.startAt))})))
</script>
<template>
 <div class="page-top city-top"><div class="container"><span class="kicker light">✦ SUA CIDADE, SEU PALCO</span><h1>O que acontece <em>por perto?</em></h1><p>Descubra futuros eventos, locais e experiências da sua região.</p></div></div>
 <div class="container city-layout"><div class="filter-panel"><div class="filter-heading">Busca</div><label class="field-label" for="city-choice">Cidade</label><select id="city-choice" v-model="city" class="form-control"><option value="">Todas as cidades</option><option v-for="c in CITIES" :key="c">{{c}}</option></select><button class="button button-outline button-full location-button" @click="locate">⌖ Usar minha localização</button>
 <small class="help-text">O navegador pedirá sua permissão. A busca considera até 80 km dos locais ilustrativos cadastrados.</small>
 <label class="field-label" for="event-search">Pesquisar evento</label><input id="event-search" v-model="search" class="form-control" placeholder="Nome do evento..."/>
 <label class="field-label" for="event-category">Categoria</label><select id="event-category" v-model="category" class="form-control"><option value="">Todas as categorias</option><option v-for="c in CATEGORIES" :key="c.slug" :value="c.slug">{{c.label}}</option></select>
 <p v-if="geoError" class="notice-error" role="alert">{{geoError}}</p><button class="subtle-button" @click="category='';search='';geo=null;city=''">Limpar filtros ↗</button></div>
 <div class="city-results"><div class="section-heading"><div><span class="kicker">EXPERIÊNCIAS LOCAIS</span><h2>{{geo?'Perto de você':city||'Todas as cidades'}}</h2></div><span class="result-counter">{{filtered.length}} eventos</span></div>
 <div v-if="demo" class="notice-inline">✳ Possível adicionar seu evento aqui Alfred Eventos</div>
 <div v-if="loading">Carregando agenda...</div><div v-else-if="filtered.length" class="events-grid city-events-grid"><EventCard v-for="event in filtered" :key="event.id" :event="event"/></div><div v-else class="empty-state"><h3>Nenhum evento neste recorte.</h3><p>Experimente buscar em outra cidade ou selecione todas as categorias.</p></div>
 <div class="section-heading venues-heading"><div><span class="kicker">AGENDA DOS ESPAÇOS</span><h2>Locais e suas próximas datas</h2></div></div>
 <div class="venue-list"><article v-for="venue in shownVenues" :key="venue.id" class="venue-row"><div class="venue-icon">⌂</div><div><h3>{{venue.name}}</h3><p>{{venue.address}} · {{venue.city}}/{{venue.state}}</p><p class="venue-upcoming">{{venue.upcoming.length?`Próximo evento: ${venue.upcoming[0].title}, ${dateParts(venue.upcoming[0].startAt).day}/${dateParts(venue.upcoming[0].startAt).month}`:'Sem próximos eventos cadastrados'}}</p></div><router-link v-if="venue.upcoming.length" :to="`/evento/${venue.upcoming[0].id}`" class="small-link">Ver próxima data ↗</router-link></article><p v-if="!shownVenues.length">Nenhum local de demonstração nesta região.</p></div>
 </div></div>
</template>
