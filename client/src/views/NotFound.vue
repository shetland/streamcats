<template>
  <div>
    <v-container class="setWidth">
      <div class="text-center">
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <sad-cat class="catHead">
        </sad-cat>
        <div>"CAT-OH-CAT"</div>
        <div style="font-size:13px">...There's Nothing Here...</div>
      </div>
    </v-container>
  </div>
</template>

<script>
import SadCat from '@/components/CatHeadSad.vue'

export default {
  name: 'About',
  components: {
    SadCat
  }
}
</script>
<style scoped>
  .catHead {
    filter: drop-shadow(0px 1px 2px var(--v-shadow-base));
    fill: var(--v-head-base);
    cursor: pointer;
    height:90px;
    width:90px;
  }
</style>
