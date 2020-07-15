const fs = require('fs')
const titleScraper = require('./titles_scrape.js')
const deltaFinder = require('./delta_finder.js')
const detailScraper = require('./details_scrape.js')
const ratingScraper = require('./ratings_scrape.js')
// const genreConfig = require('./genre_config.js')
// const compKeys = require('../../encrypt/tools/compkeys.js')

function main() {

  console.log('Getting all Hulu titles...')
  titleScraper.run()

  console.log('Getting new titles delta...')
  deltaFinder.run()

  console.log('Fetching new title details...')
  detailScraper.run()

  console.log('Fetching new title ratings...')
  ratingScraper.run()

  // Verify data before running lib updater
}

main()




// Step 2. Configure the genre graph - and save into the titles folder - should be end



// Step 4. Fetch the new title details with a details scrape, get hrefs for hulu, and save in details delta folder

// Step 5. Fetch the new title imdb ratings with the ddg ratings scrape - save in the ratings delta folder

// Step 6. Email the delta titles and the movie and tv issue lists and errors to myself.

// Step 7. Review delta titles in person and make corrections - save lib

// Step 8. Add the new titles into the lib and save

// Step 9. Populate the full title structure from the lib - save 

// Step 10. Generate the full structure lib keys - save

// Step 11. Generate the full structure encoding - save

// Step 12. Restart server