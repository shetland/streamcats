<template>
  <div>
    <v-container class="setWidth">
      <div class="text-center">
        <h1 class="heading">
          <v-divider></v-divider>
          LOOKING FOR SOMETHING TO WATCH?
          <v-divider></v-divider>
        </h1>
        <div class="bodyText">
          <p>
            StreamCats is a tool for lasering in on a new show or movie as fast as possible.
            Whether you're on the prowl for a rollicking space western series, a PG rated horror movie, or a quirky rom-com musical,
            StreamCats will magically get you a short list of relevant titles you can sort, filter, and quickly review.
            There is so much great content out there; StreamCats helps you find it!
          </p>
          <p class="starDivider">*  *  *  *  *  *  *  *  *  *  *  *</p>
          <div class="d-flex justify-center">
          <p class="subWidth">
            Want recommendations straight from the cat's mouth? Check out the <router-link to='/cat-picks'>picks page</router-link>
            for reviews of our favorite titles you may have missed!
          </p>
          </div>
        </div>
      </div>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <bottom-links :homeLink='true'>
        Something to say?
      </bottom-links>
    </v-container>
  </div>
</template>

<script>
import BottomLinks from '@/components/BottomLinks.vue'

export default {
  name: 'About',
  components: {
    BottomLinks
  }
}
</script>
<style scoped>
  .setWidth {
    max-width: 800px;
  }
  .heading {
    font-family: 'Quicksand', sans-serif;
    padding-bottom: 14px;
    padding-top: 10px;
    font-weight: 400;
    font-size: 28px;
  }
  .starDivider {
    letter-spacing: 4px;
    padding-top: 14px;
    padding-bottom: 5px;
  }
  .subWidth {
    max-width: 600px;
  }
  .bodyText {
    font-weight: 300;
  }
</style>
