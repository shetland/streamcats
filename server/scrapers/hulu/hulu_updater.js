const fs = require('fs')
const titleScraper = require('./titles_scrape.js')
const deltaFinder = require('./delta_finder.js')
const detailScraper = require('./details_scrape.js')
const ratingScraper = require('./ratings_scrape.js')

function main() {

  console.log('Getting all Hulu titles...')
  titleScraper.run()

  console.log('Getting new titles delta...')
  deltaFinder.run()

  console.log('Fetching new title details...')
  detailScraper.run()

  console.log('Fetching new title ratings...')
  ratingScraper.run()

  // Verify data before running cat_updater
}

main()