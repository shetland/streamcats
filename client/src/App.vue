<template>
  <v-app id="app">
    <router-view></router-view>
    <bottom-nav></bottom-nav>
  </v-app>
</template>

<script>
import BottomNav from '@/components/BottomNav'

export default {
  name: 'App',
  components: {
    BottomNav
  }
}
</script>