<template>
  <div>
    <div>
        <v-btn-toggle id='sortBar'>
        <v-btn min-width='30px' width="34px" class="sortBtn"  small>{{items.length}}</v-btn>
        <v-menu offset-y>
          <template v-slot:activator='{ on, attrs }'>
            <v-btn v-bind='attrs' v-on='on' class="sortBtn" small :color='onlyRated ? sortColor["rated"]:""'>
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
        <v-btn class="sortBtn" small :color='sortBy.includes("title")? sortColor["name"]:""' @click='handleSort("title"); sortDesc=!sortDesc'>NAME</v-btn>
        <v-btn class="sortBtn" small :color='sortBy.includes("imdbScore")? sortColor["imdb"]:""' @click='handleSort("imdbScore")'>IMDB</v-btn>
        <v-btn class="sortBtn" small :color='sortBy.includes("year")? sortColor["year"]:""' @click='handleSort("year")'>YEAR</v-btn>
        <v-btn min-width='30px' width='34px' class="sortBtn" small @click='sortDesc=!sortDesc'>
          <v-icon small v-if='sortDesc'>mdi-menu-down</v-icon>
          <v-icon small v-else>mdi-menu-up</v-icon>
        </v-btn>
        </v-btn-toggle>
    </div>
    <div>
        <v-icon>mdi-menu-down</v-icon>
    </div>
    <v-data-iterator
      :items="items"
      :items-per-page="itemsOnPage"
      hide-default-footer
      :sort-by="sortBy"
      :sort-desc="sortDesc"
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
                  <v-btn class="catBtn" outlined small rounded target="_blank" color='#FBC02D' :href='item.imdbHref'>
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
    <div>
      <br>
      <br>
      <br>
      <div v-if='items.length <= itemsOnPage'>
        <span @click='scrollToTop()'>
          <cat-head-color class="colorCat"></cat-head-color>
        </span>
        <div>"That's all folks!"</div>
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
    // sortBy: 'year',
    sortDesc: true,
    items: [],
    ratingsList: [],
    onlyRated: '',
    sortBy: 'year',
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
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  },
  watch: {
    data (newData) {
      this.onlyRated = ''
      this.items = newData
      this.ratingsList = this.getRatings(this.items)
      this.ratingsList.push('CLEAR')
      this.itemsOnPage = 15
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
    /* padding-top:2px; */
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
  .sortBtn {
    filter: drop-shadow(0px 1px 1px var(--v-title-base));
    font-size: 11px;
  }
  .colorCat {
    filter: drop-shadow(0px 1px 1px var(--v-shadow-base));
    cursor: pointer;
    width: 60px;
    height: 60px;
  }
</style>
