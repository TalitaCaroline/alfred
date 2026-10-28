<script setup>
import { computed } from 'vue'
import { categoryLabel, dateParts, brl } from '../utils'
const props=defineProps({event:{type:Object,required:true},match:{type:Number,default:null}})
const dates=computed(()=>dateParts(props.event.startAt))
const startingPrice=computed(()=>Math.min(...(props.event.lots||[]).map(l=>Number(l.price)).filter(n=>Number.isFinite(n))))
</script>
<template>
 <router-link :to="`/evento/${event.id}`" class="event-card">
  <div class="event-art" :class="`art-${event.accent||'violet'}`">
    <span class="poster-orbit poster-orbit-one"/><span class="poster-orbit poster-orbit-two"/><span class="poster-flare">✳</span>
    <span class="event-pill">{{ categoryLabel(event.category) }}</span>
    <span v-if="match!==null" class="match-pill">✦ {{match}}% compatível</span>
    <span class="poster-word" aria-hidden="true">{{event.title.split(' ').slice(0,2).join(' ')}}</span>
  </div>
  <div class="event-info"><div class="event-date"><strong>{{dates.day}}</strong><span>{{dates.month}}</span></div>
   <div class="event-copy"><h3>{{event.title}}</h3><p>{{event.venue?.name}} · {{event.venue?.city}}</p>
    <div class="event-bottom"><span>{{dates.time}}</span><strong v-if="Number.isFinite(startingPrice)">a partir de {{brl(startingPrice)}}</strong></div>
   </div></div>
 </router-link>
</template>
