import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      light: {
        primary:'#222',
        head: '#fff',
        shadow: '#888',
        title: '#bcbcbc',
        card: '#fff',
      },
      dark: {
        primary: '#fff',
        head: '#aaa',
        shadow: '#000',
        title: '#000',
        card: '#222'
      }
    },
    options: {
      customProperties: true
    }
  }
})
