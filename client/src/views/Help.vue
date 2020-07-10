<template>
  <div>
    <v-container class="setWidth">

      <div class="text-center">     
        <div>
          <stream-cats class="scTitle"></stream-cats>
        </div>

        <div v-for='(lesson, index) in lessons' :key='"l-"+ index'>
          <div class='lessonBtn addShadow' v-if='lessonIndex >= 6 && index === 6'>
            <v-btn-toggle>
              <v-btn min-width='30px' width="34px" small>0</v-btn>
              <v-btn class="sortBtn" small>RATED</v-btn>
              <v-btn class="sortBtn" small>NAME</v-btn>
              <v-btn class="sortBtn" small>IMDB</v-btn>
              <v-btn class="sortBtn" small>YEAR</v-btn>
              <v-btn min-width='30px' width='34px' class="sortBtn" small @click='sortDesc=!sortDesc'>
                <v-icon small v-if='sortDesc'>mdi-menu-down</v-icon>
                <v-icon small v-else>mdi-menu-up</v-icon>
              </v-btn>
            </v-btn-toggle>
            <div v-if='lessonIndex > 5'>
              <v-icon>mdi-menu-down</v-icon>
            </div>
          </div>

          <div v-if='lessonIndex >= 8 && index === 8'>
            <v-expansion-panels class='scWrapper' :value='open' focusable accordion>
              <v-expansion-panel>
                <v-expansion-panel-header hide-actions>
                  <v-container fluid class='titleContainer'>
                    <v-row justify='space-between'>
                      <v-col class='titleText'>
                        <span >Galaxy Wars</span>
                      </v-col>
                      <v-col class='infoText'>
                        <span>PG-13 | 9.9 | 2293</span>
                      </v-col>
                    </v-row>
                    <v-row justify='space-between'>
                      <span>
                        <span>
                          <v-chip class='genreTags' x-small color='red'>ACTION</v-chip>
                          <v-chip class='genreTags' x-small color='blue'>SCIFI</v-chip>
                          <v-chip class='genreTags' x-small color='purple'>HORROR</v-chip>
                        </span>
                      </span>
                    </v-row>
                  </v-container>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row>
                    <div class='descText'>
                      Did you ever hear the tragedy of Darth Plagueis The Wise? 
                      I thought not. It's not a story the Jedi would tell you. 
                      It's a Sith legend.
                    </div>
                  </v-row>
                  <br>
                  <v-row justify='space-between'>
                    <div>
                      <v-btn outlined small target="_blank" rounded color='#FBC02D' href='https://imdb.com'>
                        IMDB:<v-icon small>mdi-exit-to-app</v-icon>
                      </v-btn>
                    </div>
                    <div>
                      <v-btn outlined small target="_blank" rounded color='red' href='https://netflix.com'>
                        NETFLIX:<v-icon small>mdi-exit-to-app</v-icon>
                      </v-btn>
                    </div>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
              </v-expansion-panels>
            <div v-if='lessonIndex > 7'>
              <v-icon>mdi-menu-down</v-icon>
            </div>
          </div>

          <v-btn
            v-if='index <= lessonIndex'
            :outlined='index === lessonIndex'
            class='lessonBtn'
            @click='updateLesson(index)'
            :color='index !== lessonIndex && index === 0? "#fff" : lesson.color'
            rounded

          >
          <v-btn v-if='index === 5' small icon>
            <v-icon :color='index < lessonIndex? "#222": lesson.color' size='14' dense>mdi-minus</v-icon>
          </v-btn>
          <span v-else class="spacer"></span>
            <span :class='index < lessonIndex ? "darkText" : "colorText"'>
              {{index === 0 && lessonIndex > 0 ? 'Tap to close' : lesson.text}}
            </span>
              <v-btn icon :class='index < lessonIndex ? "darkText subGenreBtn" : "subGenreBtn"'>
                <v-icon 
                  :color='index < lessonIndex? "#222": lesson.color' 
                  v-if='index < lessonIndex' 
                  size='18' 
                  dense
                >mdi-close
                </v-icon>
                <v-icon 
                  v-else
                  :color='getPlusColor(index)' 
                  size='18' 
                  dense
                >mdi-plus
                </v-icon>
              </v-btn>
          </v-btn>
          <div>
            <v-icon v-if='index < lessonIndex && index !==10'>mdi-menu-down</v-icon>
          </div>
        </div>
        
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      
      </div>
      <div class="bottomPad" v-show="lessonIndex >= 1"></div>
      <bottom-links :homeLink='true' v-if='lessonIndex >= 1'>
        <div>Issues?</div>
      </bottom-links>
    </v-container>
  </div>
    
</template>

<script>
import StreamCats from '@/components/StreamCats_Title.vue'
import BottomLinks from '@/components/BottomLinks.vue'

export default {
  name: 'Help',
  components: {
    StreamCats,
    BottomLinks
  },
  data: () => ({
    sortDesc: true,
    open: null,
    lessonIndex: 0,
    lessons: [
      { text: 'Tap for tutorial', color: '' },
      { text: 'On the homepage, tap a streaming service', color: '#ff2a2a' },
      { text: 'Tap MOVIES or TV', color: '#FFAA22' },
      { text: 'Tap any GENRE', color: '#FFDD22' },
      { text: 'Tap any additional SUBGENRES that should be included', color: '#7fff2a' },
      { text: 'Tap the MINUS sign on SUBGENRES that should be filtered', color: '#00fff4' },
      { text: 'Sort the RESULTS by NAME, RATING, IMDB score, or YEAR', color: '#0cf' },
      { text: 'Scroll down to see the search RESULTS', color: '#2a7fff' },
      { text: 'Tap a title listing to see a summary and its links', color: '#d5f' },
      { text: 'Use the links to learn more or to add the title to your watchlist', color: '#f5d' },
      { text: "That's it! Want more? Check out the cat picks page!", color: '#ff2a7f' }
    ]
  }),
  methods: {
    updateLesson(index) {
      if (index < this.lessonIndex) {
        this.lessonIndex = index
      } else {
        this.lessonIndex = index + 1
      }
      if (index === 8) {
        this.open = 0
      }
      if (index < 8) {
        this.open = null
      }
      if (index === 10) {
        this.$router.push({path: '/cat-picks'})
      }
    },
    toPicks() {
      console.log('clicked picks')
      
    },
    getPlusColor(index) {
      if (this.lessonIndex === 0 && !this.$vuetify.theme.dark){
        return "#222"
      }
      if (index < this.lessonIndex) {
        return "#222"
      } else {
        return this.lessons[index].color
      }
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
    padding-bottom: 12px;
    filter: drop-shadow(0px 1px 1px var(--v-title-base));
  }
  .addShadow {
    filter: drop-shadow(0px 1px 1px var(--v-title-base));
  }
  .darkText {
    color:#222;
    line-height: 11pt;
  }
  .colorText {
    line-height: 11pt;
  }
  .sortBtn {
    font-size: 11px;
  }
  .titleText.col {
    padding:0;
    line-height: normal;
    font-size: 16px;
    font-weight: 800;
  }
  .infoText.col {
      padding:0;
      padding-top:2px;
      text-align: right;
      line-height: normal;
      font-size: 14px;
      font-weight: 600;
  }
  .descText {
      font-weight:400;
      padding-top:10px;
      font-size: 14px;
      text-align: left;
  }
  .tagContainer.col {
      padding:0px;
      text-align: left;
      transform-origin: left;
      transform:scale(.85);
  }
  .genreTags {
      margin-right:1px;
  }
  .titleContainer.container {
      padding-top:0;
      padding-bottom:0;
  }
  button.v-expansion-panel-header {
    padding:4px;
    padding-right: 10px;
    padding-left: 10px;
    min-height:30px
  }
  .v-btn:not(.v-btn--round).lessonBtn {
    height:auto;
  }
  .v-btn.subGenreBtn{
    padding:0px;
    margin:0px;
    height:28px;
    width:28px;
  }
  .v-btn.lessonBtn {
    padding: 4px;
    display: inline-block;
    white-space: normal;
    margin:2px;
    margin-left:36px;
    margin-right: 36px;
  }
  .spacer {
    width:12px;
    height:28px;
  }
  .bottomPad {
    height: 200px;
    width: 100%;
  }
</style>
