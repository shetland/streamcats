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
            We've all been there.
            It's movie night and you're hanging out with the crew. You load up your favorite streaming service and start scrolling for
            a new flick. The first suggestion is a no because So-and-so has seen it a million times. 
            The next option is out because Hem-and-haw heard it got bad reviews. 
            You find a couple things that might be okaay, but you don't want to settle.
            There are thousands of titles on here and you know there's something awesome you just haven't found yet.
            So you scroll, and scroll, aaand scroll... 
          </p>
          <p>  
            Time starts to have no meaning as your options pile up into a giant nebula of colorful thumbnails dancing in your mind.
            What did you think looked interesting eight pages back? Is Danny DeVito the Penguin in real life? 
            Was <i>2001: A Space Odyssey</i> a historical documentary and are we in a H.A.L. simulation now?
            A glance at the clock snaps you back to reality. 
            Hem-and-haw is snoring on the loveseat. The popcorn is gone. Everyone is looking at you to make
            any decision at this point. Finally, you panic and randomly put on the worst Nicholas Cage movie ever made. 
            For most of the film, you join the others in looking down at your phone in uncomfortable silence.
          </p>
          <p class="starDivider">*  *  *  *  *  *  *  *  *  *  *  *</p>
          <div>
            Sound familiar? Tired of scrolling?
          </div>
          <div>
            Welcome to StreamCats!
          </div>
        </div>
        <br>

        <h2 class="heading">
          <v-divider></v-divider>
            FIND IT FAST
          <v-divider></v-divider>
        </h2>
        <div class="bodyText">
          <p>
            There's simply too much great content out there to spend your time aimlessly scrolling for it.
            StreamCats is a tool to help you laser in on that next great show.
            Got a hankering for an <a href="https://www.hulu.com/series/firefly-044bbd6e-4ef5-4723-93fe-a384d785b45d">amazing sci-fi action western</a>?
            Need to kick off your shoes after a hard day with an <a href="https://www.netflix.com/title/80066227">upbeat rom-com musical</a>? 
            Watching something with the family and want to find titles you will enjoy but need to keep it fairly PG so things don't get awkward? 
            In a few taps, StreamCats gets you a short list of options that you can sort, filter, and quickly review.
            You'll be surprised at all the great new stuff you'll discover!
          </p>
          <p class="starDivider">*  *  *  *  *  *  *  *  *  *  *  *</p>
          <p>
            Want recommendations straight from the cat's mouth? Check out the <router-link to='/cat-picks'>picks page</router-link>
            for reviews of our favorite titles, original StreamCats illustrations, and more!
          </p>
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
  /* .bodyText {
  } */
</style>
