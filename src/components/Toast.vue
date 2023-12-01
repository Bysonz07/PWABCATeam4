<script setup>
  import { useRegisterSW } from 'virtual:pwa-register/vue'
  import { ref } from 'vue';

  const snackbar = ref(true)
  const {
    offlineReady,
    needRefresh,
    updateServiceWorker,
  } = useRegisterSW()

  const close = async () => {
    offlineReady.value = false
    needRefresh.value = false
  }

</script>

<template>
  <div class="text-center ma-2" v-if="needRefresh">
    <v-snackbar v-model="snackbar" >
      New content available, click on reload button to update.
      <template v-slot:actions>
        <v-btn color="pink" variant="text" @click="updateServiceWorker()">
          Reload
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>