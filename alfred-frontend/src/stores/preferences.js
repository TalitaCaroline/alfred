import { defineStore } from 'pinia'
import { ref } from 'vue'
const parse = (key,fallback) => { try{return JSON.parse(localStorage.getItem(key)) ?? fallback}catch{return fallback} }
export const usePreferences = defineStore('preferences',()=>{
  const city=ref(parse('alfred-city',''))
  const genres=ref(parse('alfred-genres',[]))
  const spotifyArtists=ref(parse('alfred-artists',[]))
  const spotifyTracks=ref(parse('alfred-tracks',[]))
  const demoOrders=ref(parse('alfred-demo-orders',[]))
  function setCity(value){city.value=value;localStorage.setItem('alfred-city',JSON.stringify(value))}
  function setGenres(value){genres.value=value;localStorage.setItem('alfred-genres',JSON.stringify(value))}
  function setSpotify(artists,tracks){spotifyArtists.value=artists;spotifyTracks.value=tracks;localStorage.setItem('alfred-artists',JSON.stringify(artists));localStorage.setItem('alfred-tracks',JSON.stringify(tracks))}
  function clearSpotify(){setSpotify([],[]);sessionStorage.removeItem('alfred_spotify_token')}
  function addDemoOrder(order){demoOrders.value=[order,...demoOrders.value];localStorage.setItem('alfred-demo-orders',JSON.stringify(demoOrders.value))}
  return {city,genres,spotifyArtists,spotifyTracks,demoOrders,setCity,setGenres,setSpotify,clearSpotify,addDemoOrder}
})
