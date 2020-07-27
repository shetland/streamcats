<template>
  <div>
    <v-container class="setWidth">

      <div class="text-center">
        <stream-cats class='scTitle'></stream-cats>
        <div>
          <v-btn
            :color='$vuetify.theme.dark? "":"#fff"'
            rounded
            @click='bubbleUpPicks()'
            class="picksBtn"
          >
            <span class="picksBtnText">CAT PICKS</span>
            <v-icon dense size="14px">mdi-content-duplicate</v-icon>
          </v-btn>
        </div>
      </div>

      <div class="text-center ">
        <div :id='item.linkId' v-for='(item, index) in items' :key='item.imgSrc'>
          <div class='pickCard' rounded='xl'>

            <v-container class="text-left titleWrapper">
              <div class='d-flex justify-space-between align-start'>
                <span class='titleText text-left'>
                  <span >{{item.title}}</span>
                </span>
                <span class='infoText text-right'>
                  <span>
                    {{item.rating}} 
                    <span class="dividerLine">|</span>
                    {{item.imdbScore}} 
                    <span class="dividerLine">|</span>
                    {{item.year}}
                  </span>
                </span>
              </div>

              <div>
                <span class="genreTags" v-for='tag in item.subgenres' :key='tag'>
                  <v-chip x-small :color="getColor(item.cat,tag)">{{tag}}</v-chip>
                </span>
              </div>
            </v-container>

            <div class="imgWrapper">
              <img class="cardImg" :src='item.imgSrc' :alt='item.title'>
              <div class="imgCredOver">{{item.imgCred}}</div>
            </div>

            

            <v-container class='descWrapper'>
              <div @click='showMore(index)' class="d-flex justify-space-between align-center">
                <span class="subheadingText">
                  {{item.subheading}}<span>{{item.showAll ? '.' : '...'}}</span>
                </span>
                <v-btn :width="52" small text class="moreBtn">
                  <span >
                    {{item.showAll ? 'less' : 'more'}}
                  </span>           
                  <v-icon size="17">
                    {{item.showAll ? 'mdi-chevron-up' : 'mdi-chevron-down'}}
                  </v-icon>
                </v-btn>  
              </div>
              <v-expand-transition>
                <div v-if='item.showAll'>
                  <div v-html='item.review' class="descText">
                  </div>
                  <br>
                  <div class="d-flex justify-space-between postText">
                    <span>{{item.author}}</span> <span class="text-right">{{item.date}}</span>
                  </div>
                </div>
              </v-expand-transition>
            </v-container>

            <v-divider></v-divider>

            <div class="cardActions">
              <v-container class="d-flex justify-space-between">
                <div>
                  <v-btn small outlined target="_blank" rounded color='#FBC02D' :href='item.imdbHref'>
                  IMDB:<v-icon small>mdi-exit-to-app</v-icon>
                  </v-btn>
                </div>

                <v-btn @click='copyPickLink("#"+"pLink-"+index)' height='28' text rounded>
                  <v-icon  size='20' color='grey' >mdi-share-variant</v-icon>
                </v-btn>

                <div>
                  <v-btn small outlined target="_blank" rounded :color='catColors[item.cat]' :href='item.href'>
                    {{item.cat + ': '}}
                    <v-icon small>mdi-exit-to-app</v-icon>
                  </v-btn>
                </div>
              </v-container>

              <textarea 
                readonly="readonly"
                :value='baseUrl + "/cat-picks#" + item.linkId' 
                :id='"pLink-" + index' 
                class="postLink">
              </textarea>
            </div>
          </div>

          <br>
          <div class="d-flex justify-center">
            <v-expand-transition>
              <div v-if="noteCopy" class="snackNote">
                {{copyIssue? "Oops, URL not copied..." : "POST URL COPIED" }}
              </div>
            </v-expand-transition>
          </div>
        </div>
        <br>
        <br>
        <br>
        <br>
      </div>
      <bottom-links v-show='picksLoaded' :homeLink='true'>
        For StreamCats news and updates
      </bottom-links>
    </v-container>
  </div>
</template>

<script>
import StreamCats from '@/components/StreamCats_Title.vue'
import BottomLinks from '@/components/BottomLinks.vue'
import HuluColors from '@/plugins/huluGenreColors.json'
import NetflixColors from '@/plugins/netflixGenreColors.json'
import axios from 'axios'

export default {
  name: 'About',
  components: {
    StreamCats,
    BottomLinks
  },
  data: () => ({
    items: [],
    catColors: { netflix: 'red', hulu: 'green lighten-2' },
    genreColors: { hulu: HuluColors, netflix: NetflixColors },
    noteCopy: false,
    copyIssue: false,
    picksLoaded: false,
    baseUrl: process.env.VUE_APP_BASE_URL
  }),
  created () {
    this.getPicks()
  },
  methods: {
    getColor (cat, genre) {
      return this.genreColors[cat][genre]
    },
    copyPickLink(idIn) {
      let copyText = document.querySelector(idIn);
      if (copyText) {
        this.noteCopy = true
        copyText.select();
        document.execCommand("copy");
        setTimeout(()=>{
          this.noteCopy = false
        }, 800)
      } else {
        this.copyIssue = true
        this.noteCopy = true
        setTimeout(()=>{
          this.noteCopy = false
          this.copyIssue = false
        }, 800)
      }
    },
    showMore(index) {
      this.items[index].showAll = !this.items[index].showAll
    },
    scrollToLink () {
      if (this.$router.history.current.hash) {
        let el = document.querySelector(this.$router.history.current.hash)
        if (el) {
          el.scrollIntoView({behavior:"smooth"})
        }
      }
    },
    bubbleUpPicks () {
      let array = this.items
      let lastPick = array.pop() 
      array.unshift(lastPick)
      this.items = array
      this.$forceUpdate()
    },
    async getPicks () {
      try {
        const picks = await axios.get(`${process.env.VUE_APP_BASE_URL}/api/cat/picks`)
        this.items = picks.data
        this.picksLoaded = true
        setTimeout(()=>{
          this.scrollToLink()
        }, 500)
      } catch (err) {
        console.log(err)
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
    max-width: 640px;
    padding-top: 20px;
    padding-bottom: 12px;
    filter: drop-shadow(0px 1px 1px var(--v-title-base));
  }
  .picksBtn {
    margin-bottom: 44px;
  }
  .picksBtnText {
    padding-right:8px;
    padding-left:2px;
  }
  .pickCard {
    background-color: var(--v-card-base);
    border-radius: 22px;
    filter: drop-shadow(0px 1px 2px var(--v-title-base));
  }
  .cardImg {
    width: 100%;
    object-fit: cover;
    min-height: 200px;
    max-height: 500px;
  }
  .imgWrapper {
    position: relative;
  }
  .imgCredOver {
    position: absolute;
    right: 7px;
    bottom: 8px;
    color: grey;
    font-size: 13px;
  }
  .cardActions {
    padding-top:3px;
    padding-bottom:3px;
    padding-left:2px;
    padding-right:2px;
  }
  .postLink {
    width:200px;
    height:26px;
    bottom:-25px;
    left:0px;
    position: absolute;
    opacity:0;
    cursor:default;
  }
  .snackNote {
    position: fixed;
    top:24px;
    color:#fff;
    background-color:#444;
    vertical-align: middle;
    line-height: 36px;
    border-radius: 24px;
    width:200px;
    height:36px;
  }
  .titleWrapper {
    line-height: normal;
    padding-left:14px;
    padding-right:14px;
  }
  .titleText {
    padding:0;
    font-size: 18px;
    font-weight: 500;
  }
  .infoText {
    padding-bottom:1px;
    text-align: right;
    font-size: 15px;
    font-weight: 400;
    min-width: 135px;
  }
  .dividerLine {
    font-size: 17px;
  }
  .descWrapper {
    padding-top:7px;
  }
  .subheadingText {
    font-weight: 400;
    text-align: left;
    line-height: 1.4;
  }
  .descText {
    line-height: 1.4;
    /* line-height: normal; */
    padding-top:10px;
    text-align: left;
    font-weight: 300;
  }
  .postText {
    color: grey;
    font-size: 12px;
    font-weight: 300;
  }
  .genreTags {
    padding-right:1px;
  }
  .v-btn.moreBtn {
    padding-left:8px;
    padding-right:4px;
    margin-left:10px;
    color: grey;
    font-size:9px;
    text-transform: uppercase;
  }
</style>
