<template>
  <div>
    <div>
      <v-btn-toggle rounded class='sortBar'>
      <v-btn min-width='30px' width="44px" height="36" class="sortBtn"  small>{{items.length}}</v-btn>
      <v-menu offset-y>
        <template v-slot:activator='{ on, attrs }'>
          <v-btn v-bind='attrs' v-on='on' class="sortBtn" small height="36" :color='onlyRated ? sortColor["rated"]:""'>
            {{onlyRated || 'RATED'}}
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item
            v-for='(rating, index) in ratingsList'
            :key='index'
            @click='handleRating(rating)'
          >
            <v-list-item-content>{{ rating }}</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn class="sortBtn" small height="36" :color='sortBy.includes("title")? sortColor["name"]:""' @click='handleSort("title")'>NAME</v-btn>
      <v-btn class="sortBtn" small height="36" :color='sortBy.includes("imdbScore")? sortColor["imdb"]:""' @click='handleSort("imdbScore")'>IMDB</v-btn>
      <v-btn class="sortBtn" small height="36" :color='sortBy.includes("year")? sortColor["year"]:""' @click='handleSort("year")'>YEAR</v-btn>
      <v-btn min-width="30" width="40" small height="36" class="sortBtn"  @click='sortDesc=!sortDesc'>
        <v-icon small>{{sortDesc? "mdi-chevron-down" : "mdi-chevron-up" }}</v-icon>
      </v-btn>
      </v-btn-toggle>
    </div>
    <div>
      <v-icon>mdi-menu-down</v-icon>
    </div>
    <div class="noSelect">
    <v-data-iterator
      v-show='items.length > 0'
      :items="items"
      :items-per-page="itemsOnPage"
      hide-default-footer
      :custom-sort='customSort'
    >
      <template v-slot:default="props">
        <v-expansion-panels focusable accordion>
          <v-expansion-panel
            v-for="item in props.items"
            :key="item.title"
          >
            <v-expansion-panel-header hide-actions>
              <v-container fluid class='titleContainer'>
                <div class='d-flex justify-space-between align-start'>
                  <span class='titleText text-left'>
                    <span >{{item.title}}</span>
                  </span>
                  <span class='infoText text-right'>
                    <span>
                        <span> {{item.rating}} </span>
                      <span class="dividerLine"> | </span> 
                        <span> {{item.imdbScore}} </span> 
                      <span class="dividerLine"> | </span> 
                        <span> {{item.year}} </span>
                    </span>
                  </span>
                </div>
                  <div>
                    <span class='genreTags' v-for='tag in item.subgenres' :key='tag'>
                      <v-chip x-small :color="getColor(tag)">{{tag}}</v-chip>
                    </span>
                  </div>
              </v-container>
            </v-expansion-panel-header>

            <v-expansion-panel-content>
              <v-row>
                <div class='descText'>{{item.description}}</div>
              </v-row>
              <br>
              <v-row justify='space-between'>
                <div>
                  <v-btn :disabled='!item.imdbHref' class="catBtn" outlined small rounded target="_blank" color='#FBC02D' :href='item.imdbHref'>
                    IMDB:<v-icon small>mdi-exit-to-app</v-icon>
                  </v-btn>
                </div>
                <div>
                  <v-btn class="catBtn" outlined small rounded target="_blank" :color='catColors[cat]' :href='item.href'>
                    {{cat + ': '}}<v-icon small>mdi-exit-to-app</v-icon>
                  </v-btn>
                </div>
              </v-row>
            </v-expansion-panel-content>

          </v-expansion-panel>
        </v-expansion-panels>
      </template>
    </v-data-iterator>
    <br>
    <v-row justify='center'>
      <v-btn v-if='items.length > itemsOnPage' rounded @click='itemsOnPage+=10'>
        <v-icon>mdi-chevron-down</v-icon>MORE<v-icon>mdi-chevron-down</v-icon>
      </v-btn>
    </v-row>
    <br>
    <div>
      <v-btn  
        rounded 
        :outlined='!hasSurprise'
        :color='!hasSurprise? "red":""'
        @click='getSurprise()'
        class="surprizeBtn"
      >
        <v-icon v-if='!hasSurprise' size="18">mdi-balloon</v-icon>
          <span class="surpriseText">{{!hasSurprise ? "SURPRISE ME" : "RESTORE LIST"}}</span>
        <v-icon v-if='!hasSurprise' size="18">mdi-balloon</v-icon>
      </v-btn>
    </div>
    <div>
      <br>
      <br>
      <br>
      <div @click='scrollToTop()' v-if='items.length <= itemsOnPage && !hasSurprise'>
        <span>
          <cat-head-color class="colorCat"></cat-head-color>
        </span>
        <div>"That's all, folks!"</div>
        <div class="subText">(tap to go to top)</div>
      </div>
    </div>  
    </div>
  </div>
</template>

<script>

import HuluColors from '@/plugins/huluGenreColors.json'
import NetflixColors from '@/plugins/netflixGenreColors.json'
import CatHeadColor from '@/components/CatHeadColor.vue'

export default {
  props: {
    cat: String,
    data: Array
  },
  components : {
    CatHeadColor
  },
  data: () => ({
    sortColor: {year: '#ff2a2a', imdb:'#ffb416', rated:'#7fff2a', name:'#2a7fff'},
    itemsOnPage: 15,
    sortDesc: true,
    sortBy: 'year',
    items: [],
    memItems: [],
    ratingsList: [],
    onlyRated: '',
    hasSurprise: false,
    genreColors: { hulu: HuluColors, netflix: NetflixColors },
    catColors: { netflix: 'red', hulu: 'green lighten-2' },
  }),
  methods: {
    getColor (genre) {
      return this.genreColors[this.cat][genre]
    },
    handleSort (sort) {
      this.sortBy = sort
    },
    handleRating (rating) {
      if (rating === 'CLEAR') {
        this.onlyRated = ''
        this.items = this.data
      } else {
        this.onlyRated = rating
        this.items = this.getRatedTitles(rating)
      }
    },
    getRatings (arrayIn) {
      let allRatings = {}
      arrayIn.forEach(title => {
        allRatings[title.rating] = true
      })
      return Object.keys(allRatings)
    },
    getRatedTitles (rating) {
      let ratedItems = []
      this.data.forEach(title => {
        if (title.rating === rating) {
          ratedItems.push(title)
        }
      })
      return ratedItems
    },
    scrollToTop () {
      this.itemsOnPage = 15
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    getSurprise () {
      if (!this.hasSurprise) {
        this.memItems = this.items
        let titleNum = this.items.length
        let randomIndex = Math.floor(Math.random() * titleNum)
        let surpriseList = [this.items[randomIndex]]

        this.items = surpriseList
        console.log(this.items)
        this.hasSurprise = true
      } else {
        this.items = this.memItems
        this.hasSurprise = false
        this.itemsOnPage = 15
      }
    },
    customSort (items) {
      items.sort((a, b) => {
        if (this.sortBy === 'year') {
          if(this.sortDesc) {
            if(a.year > b.year) { return -1 }
            if(a.year < b.year) { return 1 }
            return 0
          } else {
            if(a.year > b.year) { return 1 }
            if(a.year < b.year) { return -1 }
            return 0
          }
        }
        if (this.sortBy === 'imdbScore') {
          if(this.sortDesc) {
            if(b.imdbScore === 'N/A') { return -1 }
            if(parseFloat(a.imdbScore) < parseFloat(b.imdbScore)) { return 1 }
            if(parseFloat(a.imdbScore) > parseFloat(b.imdbScore)) { return -1 }
            return 0
          } else {
            if(a.imdbScore === 'N/A') { return -1 }
            if(parseFloat(a.imdbScore) < parseFloat(b.imdbScore)) { return -1 }
            if(parseFloat(a.imdbScore) > parseFloat(b.imdbScore)) { return 1 }
            return 0
          }
        }
        if (this.sortBy === 'title') {
          let titleA = a.title.toLowerCase()
          let titleB = b.title.toLowerCase()
          if(this.sortDesc) {
            if(titleA > titleB) { return 1 }
            if(titleA < titleB) { return -1 }
            return 0
          } else {
            if(titleA > titleB) { return -1 }
            if(titleA < titleB) { return 1 }
            return 0
          }
        }
      })
      return items
    }
  },
  watch: {
    data (newData) {
      this.onlyRated = ''
      this.items = newData
      this.ratingsList = this.getRatings(this.items)
      this.ratingsList.push('CLEAR')
      this.itemsOnPage = 15
      this.hasSurprise = false
    }
  }
}
</script>

<style scoped>
  .titleText {
    padding:0;
    line-height: normal;
    font-size: 16px;
    font-weight: 700;
  }
  .infoText {
    padding:0;
    text-align: right;
    line-height: normal;
    font-size: 14px;
    font-weight: 500;
    min-width: 130px;
  }
  .dividerLine {
    font-size: 17px;
  }
  .descText {
    padding-top:10px;
    text-align: left;
    line-height: normal;
  }
  .tagContainer {
    padding:0px;
    text-align: left;
    transform-origin: left;
    transform:scale(.85);
  }
  .genreTags {
    padding-right:1px;
  }
  .titleContainer.container {
    padding:0;
    line-height:12pt;

  }
  button.v-expansion-panel-header {
    padding:4px;
    padding-right: 10px;
    padding-left: 10px;
    min-height:30px
  }
  .sortBar {
    filter: drop-shadow(0px 1px 1px var(--v-title-base));
  }
  .sortBtn {
    font-size: 11px;
  }
  .v-text-field {
    font-size: 14px;
  }
  .v-btn.surprizeBtn {
    margin-top: 28px;
    padding-right: 9px;
    padding-left: 9px;
  }
  .surpriseText {
    padding-right: 4px;
    padding-left: 4px;
  }
  .subText {
    font-size: 11px;
  }
  .colorCat {
    filter: drop-shadow(0px 1px 1px var(--v-shadow-base));
    cursor: pointer;
    width: 60px;
    height: 60px;
  }
  .noSelect{
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none; 
    user-select: none;
  }
</style>
