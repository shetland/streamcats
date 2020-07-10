<template>
    <v-bottom-navigation v-model='activeBtn' :value='activeBtn' fixed grow :color='getBtnColor()'>
      <v-btn :color='darkTheme? "purple":"orange"' min-width='40px' small icon @click='darkTheme=!darkTheme'>
        <span class="navBtn">MODE</span>
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>
      <v-btn min-width='40px' to="/cat-picks" small icon>
        <span class="navBtn">PICKS</span> 
        <v-icon>mdi-heart-circle-outline</v-icon>
      </v-btn>
      <v-btn to="/" small icon>
        <span>
          <CatHead class="catHead"></CatHead>
        </span>
      </v-btn>
      <v-btn min-width='40px' to="/about" small icon>
        <span class="navBtn">ABOUT</span>
        <v-icon>mdi-information-outline</v-icon>
      </v-btn>
      <v-btn min-width='40px' to="/help" small icon>
        <span class="navBtn">HELP</span>
        <v-icon>mdi-help-circle-outline</v-icon>
      </v-btn>
    </v-bottom-navigation>
</template>

<script>
import CatHead from '@/components/CatHead.vue'

export default {
  name: 'BottomNav',
  components: {
    CatHead
  },
  data: () => ({
    darkTheme: false,
    activeBtn: 1,
    btnColors: ['', 'red', '', 'green', 'blue' ]
  }),
  mounted () {
    if (localStorage.currentTheme === 'true') {
      this.$vuetify.theme.dark = true
      this.darkTheme = true
    }
    if (localStorage.currentTheme === 'false') {
      this.$vuetify.theme.dark = false
      this.darkTheme = false
    }
  },
  methods: {
    getBtnColor () {
      if (!this.darkTheme && this.activeBtn===0) {
        return ''
      } else {
        return this.btnColors[this.activeBtn]
      }
    }
  },
  watch: {
    darkTheme (newTheme) {
      this.$vuetify.theme.dark = newTheme
      localStorage.currentTheme = newTheme
    }
  }
}
</script>

<style scoped>
  .catHead {
    filter: drop-shadow(0px 1px 2px var(--v-shadow-base));
    fill: var(--v-head-base);
    cursor: pointer;
    height:50px;
    width:50px;
  }
  .navBtn {
    font-size: 10px;
  }
</style>
