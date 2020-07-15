<template>
  <div>
  <v-container class="setWidth">
    <div class="text-center">
    <stream-cats class='scTitle'></stream-cats>
    </div>
    <v-row>
      <v-col align='center'>

        <!-- Cat Buttons -->
        <span v-for='cat in catList' :key='cat'>
          <v-btn
            :loading='updatingCat === cat'
            v-show='!currCat'
            class="catBtn"
            @click="setCat(cat)"
            :color='catColors[cat]'
            rounded
            outlined
          ><span  class="spacer"></span>{{cat}} 
          <v-btn :color='catColors[cat]' icon class="subGenreBtn">
            <v-icon size='18' dense>mdi-plus</v-icon>
          </v-btn>
          </v-btn>
          <v-btn
            v-show='currCat===cat'
            class="catBtn"
            @click='setCat(cat)'
            :color='catColors[cat]'
            rounded
          ><span class="spacer"></span>{{currCat}}
          <v-btn icon class="subGenreBtn">
            <v-icon size='18' dense>mdi-close</v-icon>
          </v-btn>
          </v-btn>
        </span>
        <div v-if='currCat'>
          <v-icon>mdi-menu-down</v-icon>
        </div>

        <!-- Type Buttons -->
        <span v-for='type in typeList' :key='type'>
          <v-btn
            :loading='updatingType===type'
            v-show='currCat && !currType'
            class="genreBtn"
            @click="setType(type)"
            :color='catColors[currCat]'
            rounded
            outlined
            small
          ><span class="spacer"></span>
          <span>{{type}}</span>
          <v-btn :color='catColors[currCat]' icon class="subGenreBtn">
            <v-icon size='16' dense>mdi-plus</v-icon>
          </v-btn>
          </v-btn>
          <v-btn
            v-show='currType===type'
            class="genreBtn"
            @click='setType(type)'
            :color='catColors[currCat]'
            rounded
            small
          ><span class="spacer"></span>
          <span>{{currType}}</span>
          <v-btn icon class="subGenreBtn">
            <v-icon size='16' dense>mdi-close</v-icon>
          </v-btn>
          </v-btn>
        </span>
        <div v-if='currType'>
          <v-icon>mdi-menu-down</v-icon>
        </div>

        <!-- Genre Rule Buttons -->
        <div v-for="(rule,index) in ruleList" :key='`${index}-${rule.genre}`'>
          <div v-if="rule.type === 'i'">
            <v-btn
              class="genreBtn"
              @click="removeRule(index)"
              :color='getColor(rule.genre)'
              rounded
              small
            ><span class="spacer"></span>{{rule.genre}}
            <v-btn icon class="subGenreBtn">
              <v-icon size='16' dense>mdi-close</v-icon>
            </v-btn>
            </v-btn>
            <div>
              <v-icon>mdi-menu-down</v-icon>
            </div>
          </div>

          <div v-if="rule.type === 'f'">
            <v-btn
              class="genreBtn"
              @click="removeRule(index)"
              color='grey'
              rounded
              small
            ><span class="spacer"></span><span class="filterBtn">{{rule.genre}}</span>
            <v-btn icon class="subGenreBtn">
              <v-icon size='16' dense>mdi-close</v-icon>
            </v-btn>
            </v-btn>
            <div>
              <v-icon>mdi-menu-down</v-icon>
            </div>
          </div>
        </div>

        <!-- Genre Selection Buttons -->
        <span v-for='genre in genreList' :key='`g-${genre}`'>
          <v-btn
            v-show='currCat && currType'
            :loading='updatingGenre===genre'
            class="genreBtn"
            @click.self="addRule(genre, 'i')"
            :color='getColor(genre)'
            rounded
            outlined
            small
          > 
            <v-btn v-if='ruleList.length > 0' class="subGenreBtn" :color='getColor(genre)' @click="addRule(genre, 'f')" small icon>
              <v-icon size='14' dense>mdi-minus</v-icon>
            </v-btn>
            <span v-else class="spacer"></span>
            <span class="genreText" @click.self="addRule(genre, 'i')">{{genre}}</span>
            <v-btn class="subGenreBtn" :color='getColor(genre)' @click="addRule(genre, 'i')" small icon>
              <v-icon size='16' dense>mdi-plus</v-icon>
            </v-btn>

          </v-btn>
        </span>
        <div v-show='genreList.length > 0 && ruleList.length > 0'>
          <v-icon class="genreDown">mdi-menu-down</v-icon>
        </div>

        <div v-show='ruleList.length > 0 && titleList.length === 0'>
        <div>
          <sad-cat class="catHead"></sad-cat>
        </div>
          ...Nothing...
        </div>
        
        <span v-show='currCat && titleList.length > 0 && genreLoaded'>
          <Items :cat='currCat' :data='titleList'></Items>
        </span>

      </v-col>
    </v-row>

    <div class='bottomPad'></div>
    </v-container>
  </div>
</template>

<script>
import StreamCats from '@/components/StreamCats_Title.vue'
import SadCat from '@/components/CatHeadSad.vue'
import HuluColors from '@/plugins/huluGenreColors.json'
import NetflixColors from '@/plugins/netflixGenreColors.json'
import Items from '@/components/Items.vue'
import * as mp from 'msgpack-lite'
import axios from 'axios'

export default {
  name: 'Home',
  components: {
    StreamCats,
    SadCat,
    Items
  },
  data: () => ({
    genreLoaded: false,
    updatingCat: '',
    updatingType: '',
    updatingGenre: '',
    currCat: '',
    currType: '',
    currGenre: '',
    typeList: ['tv', 'movies'],
    catList: ['netflix', 'hulu'],
    ruleList: [],
    genreList: [],
    titleList: [],
    allTitles: [],
    catColors: { netflix: 'red', hulu: 'green lighten-2' },
    genreColors: { hulu: HuluColors, netflix: NetflixColors },
    compKeys: {},
    cd: {}
  }),
  created () {
    this.gk()
  },
  methods: {
    setCat (cat) {
      if (
        cat === this.currCat 
        && !this.updatingType 
        && !this.updatingGenre ) {
        this.genreLoaded = false
        this.clearV(0)
        this.clearU()
      } else {
        if (!this.updatingCat) {
          this.updatingCat = cat
          setTimeout(() => { 
            this.updatingCat = ''
            this.currCat = cat 
          }, 800)
        }
      }
      if (!this.cd[cat]) {
        this.loadedCat = false
        this.gd(cat)
        setTimeout(() => { this.loadedCat = true }, 800)
      }
    },
    setType (type) {
      if (type === this.currType 
        && !this.updatingGenre ) {
        this.genreLoaded = false
        this.clearV(1)
        this.clearU()
      } else {
        if (!this.updatingType 
          && !this.updatingGenre) {
          this.updatingType = type
          setTimeout(() => { 
            this.updatingType = ''
            this.currType = type
            this.genreList = this.getGenres(this.cd[this.currCat][type]) // !
          }, 800)
        }
      }
    },
    addRule (genre, type) {
      const newRule = { genre, type }
      if (this.ruleList.length === 0) {
        if (!this.updatingGenre) {
          this.updatingGenre = genre
          this.allTitles = this.cd[this.currCat][this.currType][genre]
          this.titleList = this.allTitles
          setTimeout(() => {
            this.ruleList.push(newRule)
            this.genreList = this.getSubGenres(this.titleList)
            this.currGenre = genre
            this.updatingGenre = ''
            this.genreLoaded = true
          }, 800 )
        }
      } else {
        if (!this.updatingGenre) {
          this.updatingGenre = genre
          setTimeout(() => {
            this.ruleList.push(newRule)
            this.titleList = this.getTitles(this.ruleList)
            this.genreList = this.getSubGenres(this.titleList)
            this.currGenre = genre
            this.updatingGenre = ''
            this.genreLoaded = true
          }, 800 )
        }
      }
    },
    removeRule (index) {
      if (index === 0) {
        if(!this.updatingGenre){
          this.clearV(2)
          this.updatingGenre = ''
          this.genreLoaded = false
          this.genreList = this.getGenres(this.cd[this.currCat][this.currType])
        }
      } else {
        if(!this.updatingGenre) {
          this.updatingGenre = ''
          this.ruleList.splice(index, 1)
          this.titleList = this.getTitles(this.ruleList)
          this.genreList = this.getSubGenres(this.titleList)
        }
      }
    },
    clearV (level) {
      switch (level) {
        case 0:
          this.currCat = ''
          /* falls through */
        case 1:
          this.currType = ''
          /* falls through */
        case 2:
          this.currGenre = ''
          /* falls through */
        case 3:
          this.genreList = []
          /* falls through */
        case 4:
          this.ruleList = []
          /* falls through */
        case 5:
          this.titleList = []
          /* falls through */
        case 6:
          this.allTitles = []
      }
    },
    clearU () {
      this.updatingCat = ''
      this.updatingType = ''
      this.updatingGenre = ''
    },
    getTitles () {
      let memTitles = this.allTitles
      this.ruleList.forEach((rule) => {
        if (rule.type === 'i') {
          memTitles = this.getFilteredTitles(memTitles, rule.genre, 'i')
        }
        if (rule.type === 'f') {
          memTitles = this.getFilteredTitles(memTitles, rule.genre, 'f')
        }
      })
      return memTitles
    },
    getFilteredTitles (arrayIn, includeIn, modeIn) {
      const filteredTitles = []
      arrayIn.forEach(title => {
        const subgenreArray = title.subgenres
        if (modeIn === 'i') {
          if (subgenreArray.includes(includeIn)) {
            filteredTitles.push(title)
          }
        }
        if (modeIn === 'f') {
          if (!subgenreArray.includes(includeIn)) {
            filteredTitles.push(title)
          }
        }
      })
      return filteredTitles
    },
    getGenres (objIn) {
      const genresInType = []
      const genreArray = Object.keys(objIn)
      genreArray.forEach(genre => {
        if (objIn[genre].length > 0) {
          genresInType.push(genre)
        }
      })
      return genresInType
    },
    getSubGenres (arrayIn) {
      const allSubs = {}
      arrayIn.forEach(title => {
        title.subgenres.forEach(genre => {
          allSubs[genre] = true
        })
      })
      this.ruleList.forEach(rule => {
        delete allSubs[rule.genre]
      })
      return Object.keys(allSubs)
    },
    getColor (genre) {
      return this.genreColors[this.currCat][genre]
    },
    getLink (catIn, typeIn, id) {
      let link = ''
      if (catIn === 'hulu') {
        if (typeIn === 'movies') { link = 'https://www.hulu.com/movie/' + id }
        if (typeIn === 'tv') { link = 'https://www.hulu.com/series/' + id }
      }
      if (catIn === 'netflix') { link = 'https://www.netflix.com/title/' + id }
      return link
    },
    async gd (cat) {
      const d = await axios.get(`${process.env.VUE_APP_BASE_URL}/api/${cat}?cats=mew`, { responseType: 'arraybuffer' })
      const uint8View = new Uint8Array(d.data)
      const decodePk = mp.decode(uint8View)
      const catKeys = this.compKeys[cat]
      const catMovies = this.dc(catKeys.movies, decodePk.movies, cat, 'movies')
      const catTv = this.dc(catKeys.tv, decodePk.tv, cat, 'tv')
      this.cd[cat] = { movies: catMovies, tv: catTv }
    },
    async gk () {
      const d = await axios.get(`${process.env.VUE_APP_BASE_URL}/api?cats=mlk`, { responseType: 'arraybuffer' })
      const uint8View = new Uint8Array(d.data)
      const decodeKeys = mp.decode(uint8View)
      this.compKeys = {
        hulu: { movies: decodeKeys.hmv, tv: decodeKeys.htv },
        netflix: { movies: decodeKeys.nmv, tv: decodeKeys.ntv }
      }
    },
    dc (valueObjIn, dataObjIn, catIn, typeIn) {
      const gKeys = Object.keys(dataObjIn)
      const gLength = gKeys.length
      const dCompObjExport = {}
      for (let g = 0; g < gLength; g++) {
        const currG = gKeys[g]
        const currArr = dataObjIn[currG]
        const tLength = currArr.length
        for (let t = 0; t < tLength; t++) {
          const title = currArr[t]
          const tKeys = Object.keys(title)
          const iLength = tKeys.length
          for (let i = 0; i < iLength; i++) {
            const iKey = tKeys[i]
            if (iKey !== 'subgenres' && iKey !== 'href') {
              const keyArr = title[iKey]
              const parsedArray = []
              let parsedStr = ''
              for (let k = 0; k < keyArr.length; k++) {
                const dValue = valueObjIn[keyArr[k]]
                parsedArray.push(dValue)
              }
              parsedStr = parsedArray.join(' ')
              title[iKey] = parsedStr
            } else {
              const subKeyArr = title.subgenres
              const parsedSgArray = []
              for (let s = 0; s < subKeyArr.length; s++) {
                const sdValue = valueObjIn[subKeyArr[s]]
                parsedSgArray.push(sdValue)
              }
              title.subgenres = parsedSgArray
            }
          }
          title.href = this.getLink(catIn, typeIn, title.id)
          currArr[t] = title
        }
        dCompObjExport[currG] = currArr
      }
      return dCompObjExport
    }
  }

}
</script>

<style scoped>
  .setWidth {
    max-width: 800px;
  }
  .scTitle {
    padding-top: 20px;
    filter: drop-shadow(0px 1px 1px var(--v-title-base));
  }
  .v-btn.subGenreBtn{
    padding:0px;
    margin:0px;
    height:28px;
    width:28px;
  }
  .v-btn.genreBtn {
    margin:2px;
    padding-left:0px;
    padding-right:0px;
  }
  .v-btn.catBtn {
    margin:2px;
    padding-left:4px;
    padding-right:4px;
  }
  .filterBtn {
    text-decoration-line: line-through;
  }
  .genreText {
    padding-top:6px;
    padding-bottom:6px;
  }
  .spacer {
    width:14px;
    height:14px;
  }
  .bottomPad {
    width:100%;
    height: 120px;
  }
  .catHead {
    filter: drop-shadow(0px 1px 2px var(--v-shadow-base));
    fill: var(--v-head-base);
    cursor: pointer;
    height:60px;
    width:60px;
  }
</style>
