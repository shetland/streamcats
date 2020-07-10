const fs = require('fs')
const titleScraper = require('./titles_scrape.js')
const genreConfig = require('./genre_config.js')
const detailsScraper = require('./details_scrape.js')
const ratingsScraper = require('./ratings_scrape_ddgo.js')
const compKeys = require('../../encrypt/tools/compkeys.js')


// Step 1. Scrap the titles/structure from the streaming service and close the browser - done for test already

// Step 2. Configure the genre graph - and save into the titles folder

// Step 3. Populate the title structure with titles from the lib and save unknown titles into the delta folder

// Step 4. Fetch the new title details with a details scrape, get hrefs for hulu, and save in details delta folder

// Step 5. Fetch the new title imdb ratings with the ddg ratings scrape - save in the ratings delta folder

// Step 6. Email the delta titles and the movie and tv issue lists and errors to myself.

// Step 7. Review delta titles in person and make corrections - save lib

// Step 8. Add the new titles into the lib and save

// Step 9. Populate the full title structure from the lib - save 

// Step 10. Generate the full structure lib keys - save

// Step 11. Generate the full structure encoding - save

// Step 12. Restart server