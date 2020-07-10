<template>
  <div class="text-center">
    <router-link v-if='homeLink' to='/'>
      <cat-head-color class="colorCat">
      </cat-head-color>
    </router-link>
    <br>
    <slot></slot>
    <div>contact us at:</div>
    <p>
      <a href="mailto:streamcatsinfo@gmail.com">streamcatsinfo@gmail.com</a>
    </p>
    <div>
    <a class="socialLinks" href="">
      <v-icon size='46'>mdi-twitter</v-icon>
    </a>
    <a class="socialLinks" href="">
      <v-icon size='46'>mdi-instagram</v-icon>
    </a>
    <a class="socialLinks" href="">
      <v-icon size='46'>mdi-reddit</v-icon>
    </a>
    </div>
    <br>
    <br>
    <p class="subText">
      Brett Hiebert © 2020
    </p>
    <div class='bottomPad'></div>
  </div>
</template>

<script>
import CatHeadColor from '@/components/CatHeadColor.vue'

export default {
  name: 'BottomLinks',
  components: {
    CatHeadColor
  },
  props: {
    homeLink: Boolean
  }
}
</script>

<style scoped>
  .socialLinks {
    margin: 14px;
    cursor: pointer;
    text-decoration: none;
  }
  .subText {
    font-size: 13px;
  }
  .bottomText {
    max-width:300px;
  }
  .colorCat {
    filter: drop-shadow(0px 1px 1px var(--v-shadow-base));
    cursor: pointer;
    width: 60px;
    height: 60px;
  }
  .bottomPad {
    width:100%;
    height: 80px;
  }
</style>
