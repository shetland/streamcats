const genreConfig = require('./genre_config.js')
// const libUpdater = require('./genre_config.js')
// const compKeys = require('../../encrypt/tools/compkeys.js')

function main() {

  console.log('Configuring title genres...')
  genreConfig.run()

  // console.log('Getting new titles delta...')
  // libUpdater.run()

  // console.log('Fetching new title details...')
  // detailScraper.run()

  // console.log('Fetching new title ratings...')
  // ratingScraper.run()

  // Verify data before running lib updater
}

main()

// Step 7. Configure the scraped title genres.

// Step 8. Add the subgenres of the title obj into the  Add the new titles into the lib and save

// Step 9. Populate the full title structure from the lib - save 

// Step 10. Generate the full structure lib keys - save

// Step 11. Generate the full structure encoding - save

// Step 12. Restart server