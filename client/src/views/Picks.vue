<template>
  <div>
    <v-container class="setWidth">
      <div>
        <stream-cats class="scTitle"></stream-cats>
      </div>
      <div v-show='picksLoaded' class="text-center ">
        <div v-for='(item, index) in items' :key='"pick-" + index'>
          <v-card rounded='xl'>
            <v-img :id='item.linkId' :src='item.imgSrc'></v-img>
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

            <v-divider></v-divider>

            <v-container>
              <div @click='showMore(index)' class="d-flex justify-space-between align-center">
                <span class="subheadingText">
                  {{item.subheading}}<span>{{item.showAll ? '.' : '...'}}</span>
                </span>
                <v-btn small text class="moreBtn">
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
                    <span>Artwork: {{item.artworkCred}}</span> <span class="text-right">{{item.date}}</span>
                  </div>
                </div>
              </v-expand-transition>
            </v-container>

            <v-divider></v-divider>

            <v-card-actions>
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
              </v-card-actions>
          </v-card>
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
        Something to say?
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
    baseUrl: process.env.VUE_APP_BASE_URL,
    picksLoaded: false
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
    async getPicks () {
      try {
        const picks = await axios.get(`${process.env.VUE_APP_BASE_URL}/api/cat/picks`)
        this.items = picks.data
        this.picksLoaded = true
        setTimeout(()=>{
          this.scrollToLink()
        }, 250)
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped>
  .postLink {
    width:98%;
    height:26px;
    bottom:-25px;
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
  .setWidth {
    max-width: 800px;
  }
  .scTitle {
    padding-top: 20px;
    padding-bottom: 12px;
    filter: drop-shadow(0px 1px 1px var(--v-title-base));
  }
  .titleWrapper {
    line-height: normal;
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
  .subheadingText{
    font-weight: 400;
    max-width: 86%;
    text-align: left;
    line-height: 14pt;
    padding-bottom: 2px;
  }
  .descText {
    line-height: normal;
    padding-top:4px;
    text-align: left;
    font-weight: 300;
  }
  .postText {
    color: grey;
    font-size: 11px;
    font-weight: 300;
  }
  .genreTags {
    padding-right:1px;
  }
  .v-btn.moreBtn {
    padding-left:8px;
    padding-right:4px;
    color: grey;
    font-size:9px;
    text-transform: uppercase;
  }
</style>
