const fs = require('fs')
const titleScraper = require('./titles_scrape.js')
const deltaFinder = require('./delta_finder.js')
const detailScraper = require('./details_scrape.js')
const ratingScraper = require('./ratings_scrape.js')

async function main() {

  console.log('Getting all Hulu titles...')
  await titleScraper.run()

  console.log('Getting new titles delta...')
  await deltaFinder.run()

  console.log('Fetching new title details...')
  await detailScraper.run()

  console.log('Fetching new title ratings...')
  await ratingScraper.run()

  // Verify data before running cat_updater
}

main()