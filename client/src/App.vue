<template>
  <v-app id="inspire">
    <app-navbar></app-navbar>
    <v-content>
      <v-snackbar
        :value="error"        
        :timeout="0"
        color="error"
      >
        {{ error }}
      </v-snackbar>

      <router-view :key="$route.fullPath" />
    </v-content>
  </v-app>
</template>

<script>
import AppNavbar from '@/components/AppNavbar.vue'

export default {
  data() {
    return {

    };
  },
  components: {
    AppNavbar
  },
  computed: {
    error() {
      return this.$store.getters.getError;
    }
  }
}
</script>

<style>
html {
  overflow-y: auto !important;
}
</style>
