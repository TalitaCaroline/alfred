<script setup>
import { ref,computed,onMounted } from 'vue'
import { usePreferences } from '../stores/preferences'
import { listEvents } from '../services/events'
import { GENRES, CITIES } from '../utils'
import { connectSpotify,hasSpotifyConfig } from '../services/spotify'
import EventCard from '../components/EventCard.vue'
const pref=usePreferences(), events=ref([]),demo=ref(false),message=ref(''), busy=ref(false)
const selected=computed(()=>pref.genres)
function toggle(slug){const next=selected.value.includes(slug)?selected.value.filter(g=>g!==slug):[...selected.value,slug];pref.setGenres(next)}
onMounted(async()=>{try{const r=await listEvents();events.value=r.data;demo.value=r.demo}catch(e){message.value=e.message}})
const ranked=computed(()=>events.value.filter(e=>['shows','baladas'].includes(e.category) && (!pref.city || e.venue?.city===pref.city)).map(e=>{
 const tags=Array.isArray(e.genres)?e.genres:[]
 const intersection=tags.filter(tag=>selected.value.includes(tag)).length
 // Compatibilidade por interseção de gêneros: indicador de demonstração, não perfil psicológico.
 const score=selected.value.length && intersection?Math.min(95,55+Math.round(40*intersection/Math.max(1,selected.value.length))):0
 return {event:e,score}
}).filter(e=>e.score>0).sort((a,b)=>b.score-a.score||new Date(a.event.startAt)-new Date(b.event.startAt)))
const artistNames=computed(()=>pref.spotifyArtists.slice(0,6).map(a=>a.name).join(', '))
async function spotify(){message.value='';busy.value=true;try{await connectSpotify()}catch(e){message.value=e.message;busy.value=false}}
</script>
<template>
 <div class="page-top rhythm-top"><div class="container rhythm-head"><span class="kicker light">✦ ALFRED SOUND MATCH</span><h1>Encontre eventos na <em>sua frequência.</em></h1><p>Seu próximo show favorito pode estar a poucos quilômetros. Conte o que você ouve para que a gente encontre experiências semelhantes.</p><div class="wave-decor" aria-hidden="true">♫ ♪ ♫</div></div></div>
 <div class="container rhythm-layout"><div class="rhythm-preferences"><span class="step-tag">01 / DESCUBRA SUA VIBE</span><h2>Qual é a trilha sonora da sua vida?</h2><p>Selecione os estilos que você mais curte. As recomendações são calculadas com base nos gêneros cadastrados pelos organizadores.</p><div class="genre-grid"><button v-for="genre in GENRES" :key="genre.slug" class="genre-button" :class="{selected:selected.includes(genre.slug)}" :aria-pressed="selected.includes(genre.slug)" @click="toggle(genre.slug)">{{genre.label}} <span>{{selected.includes(genre.slug)?'✓':'+'}}</span></button></div>
 <div class="connect-panel"><span class="step-tag">02 / CONECTE SUA MÚSICA (OPCIONAL)</span><h3>Deixe sua música falar por você.</h3><p>O Spotify pode autorizar a leitura dos seus artistas e faixas mais ouvidos. Você poderá desconectar a qualquer momento.</p>
 <div class="music-connect-actions"><button class="button spotify-button" @click="spotify" :disabled="busy">♫ {{busy?'Conectando...':hasSpotifyConfig?'Conectar Spotify':'Configurar Spotify'}} <span>↗</span></button><button class="button apple-button" disabled title="Integração futura: requer Apple Developer e MusicKit">♪ Apple Music <span>Em breve</span></button></div>
 <small class="help-text">Conexão Spotify exige Client ID cadastrado e permissão de acesso ao app. A Apple Music ainda não está conectada nesta versão.</small>
 <div v-if="artistNames" class="connected-summary"><strong>Artistas do Spotify:</strong> {{artistNames}}. <span>Selecione gêneros acima para refinar as recomendações.</span> <button class="subtle-button" @click="pref.clearSpotify()">Desconectar dados locais</button></div>
 <p v-if="message" role="alert" class="notice-error">{{message}}</p></div></div>
 <div class="rhythm-recommendations"><div class="section-heading"><div><span class="kicker">✦ O RESULTADO DA CONEXÃO</span><h2>Combina com seu ritmo</h2></div><div class="right-control"><label for="rhythm-city">Em</label><select id="rhythm-city" :value="pref.city" class="city-select" @change="pref.setCity($event.target.value)"><option value="">Todas as cidades</option><option v-for="city in CITIES" :key="city">{{city}}</option></select><span class="result-counter">{{ranked.length}}</span></div></div>
 <div v-if="demo" class="notice-inline">✳ Recomendações de eventos baseado em seu gosto musical.</div><div v-if="ranked.length" class="events-grid"><EventCard v-for="item in ranked" :key="item.event.id" :event="item.event" :match="item.score"/></div><div v-else class="empty-state"><div class="empty-icon">♫</div><h3>Sua playlist de eventos começa aqui.</h3><p>Escolha um ou mais gêneros musicais acima para encontrar shows e baladas com estilos parecidos.</p></div></div></div>
</template>
