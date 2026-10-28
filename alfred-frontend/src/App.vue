<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
const auth=useAuthStore(),router=useRouter()
function logout(){auth.clearAuth();router.push('/')}
</script>
<template>
  <div class="app-shell">
    <header class="site-header">
      <div class="header-inner container">
        <router-link class="brand" to="/" aria-label="Alfred, início"><span class="brand-glyph">a<span>.</span></span><span class="brand-name">alfred<span>.</span></span></router-link>
        <nav class="desktop-nav" aria-label="Principal"><router-link to="/">Explorar</router-link><router-link to="/cidade">Minha cidade</router-link><router-link to="/seu-ritmo">Seu ritmo <span class="tiny-star">✦</span></router-link></nav>
        <div class="header-actions">
          <router-link v-if="auth.token" to="/meus-ingressos" class="nav-tickets">Meus ingressos</router-link>
          <router-link v-if="!auth.token" to="/login" class="button button-outline button-small">Entrar <span aria-hidden="true">↗</span></router-link>
          <button v-else class="button button-outline button-small" @click="logout">Sair</button>
        </div>
      </div>
    </header>
    <main><router-view/></main>
    <footer class="site-footer"><div class="container footer-inner"><div><span class="footer-brand">alfred.</span><p>Sempre uma ótima escolha</p></div><div class="footer-right">Adquira o Alfred e adicione seus eventos.<br/>Eventos culturais, musicais, e muito mais. <span>© 2026 Alfred</span></div></div></footer>
  </div>
</template>
