<script setup>
import {onMounted,ref} from 'vue'
import {useRouter,useRoute} from 'vue-router'
import {finishSpotify} from '../services/spotify'
import {usePreferences} from '../stores/preferences'
const router=useRouter(),route=useRoute(),pref=usePreferences(),error=ref('')
onMounted(async()=>{
 if(route.query.error){error.value='O acesso ao Spotify não foi autorizado.';return}
 if(typeof route.query.code!=='string'||typeof route.query.state!=='string'){error.value='Resposta incompleta do Spotify.';return}
 try {
  const {artists,tracks}=await finishSpotify(route.query.code,route.query.state)
  pref.setSpotify(artists,tracks)
  // Algumas contas/apps ainda expõem gêneros dos artistas. Campos podem estar ausentes ou depreciados.
  const genresFound=artists.flatMap(a=>a.genres || []).map(g=>g.toLowerCase())
  const supported=['pop','rock','indie','eletronica','house','techno','funk','mpb','jazz','brasileira']
  const normalized=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  const autoGenres=supported.filter(g=>genresFound.some(name=>normalized(name).includes(g) || (g==='eletronica' && name.includes('electronic')) || (g==='brasileira' && name.includes('brazilian'))))
  if(autoGenres.length)pref.setGenres([...new Set([...pref.genres,...autoGenres])])
  await router.replace('/seu-ritmo')
 }
 catch(e){error.value=e.message}
})
</script>
<template><div class="container callback-page"><h1>Conectando sua música…</h1><p v-if="!error">Verificando autorização com o Spotify.</p><div v-if="error" class="notice-error" role="alert">{{error}} <router-link to="/seu-ritmo">Voltar ao Meu Ritmo</router-link></div></div></template>
