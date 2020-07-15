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
        title: '#bbb'
      },
      dark: {
        primary: '#fff',
        head: '#aaa',
        shadow: '#000',
        title: '#000'
      }
    },
    options: {
      customProperties: true
    }
  }
})
