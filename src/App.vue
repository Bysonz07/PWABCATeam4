
<script setup>
import ProjectAkhir from './components/ProjectAkhir.vue';
import Snackbar from './components/Toast.vue';
import {RouterView, RouterLink} from 'vue-router'
</script>

<template>
  
  <RouterView />

</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
