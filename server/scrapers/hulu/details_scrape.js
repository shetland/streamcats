const puppeteer = require('puppeteer-core')
const fs = require('fs')

const detailScraper = {
  run: () => {
    console.log('Fetching title details...')
    let newDetails = titleScraper.fetchDetails()
    // Save in delta titles
    console.log('Saving...')
    fs.writeFileSync('../data/hulu/delta/details/deltaDetails.json', JSON.stringify(newDetails))
    console.log('Details Saved!')
  },
  fetchDetails: async () => {
    const browser = await puppeteer.launch({ headless: false, executablePath:'/usr/bin/chromium-browser'})
    const context = await browser.createIncognitoBrowserContext()
    const page = await context.newPage()
    const newTitlesRaw = fs.readFileSync('../data/hulu/delta/titles/deltaTitles.json')
    const newTitles = JSON.parse(newTitlesRaw)
    let titlesWithDetails = []

    await page.setViewport({
        width: 600,
        height: 800
    });

    for (t=0;t<newTitles.length;t++) {
      console.log ('On item: ', t)
      try { 
        let title = newTitles[t]
        let detailedTitle = {}
        let movieLink = 'https://www.hulu.com/movie/' + title.id
        let tvLink = 'https://www.hulu.com/series/' + title.id
        let realLink = ''
        let type = ''

        // Determine if title is a movie or tv show
        await page.goto(movieLink)
        let checkPage = await page.evaluate(() => {
          let boolCheck = document.querySelector(`#description-modal > div.jsx-3640661505.description-modal.modal-dialog.modal > div.jsx-3640661505.modal--body > div > div`) !== null
          return boolCheck
        })
        if (checkPage) {
          realLink = movieLink
          type = 'movie'
        } else {
          await page.goto(tvLink)
          realLink = tvLink
          type = 'tv'
        }

        // Log for testing:
        console.log('  Correct title href: ', realLink)

        // Wait a bit
        let pageWait = Math.floor(Math.random() * 2) + 1;
        await page.waitFor(pageWait*1000);

        // Grab the details
        let newDetails = await page.evaluate(() => {
          let header = ''
          let rating = ''
          let genreList = ''
          let year = ''
          let headerBool = document.querySelector(`#description-modal > div.jsx-3640661505.description-modal.modal-dialog.modal > div.jsx-3640661505.modal--body > div > div`) !== null
          if (headerBool){
            header = document.querySelector(`#description-modal > div.jsx-3640661505.description-modal.modal-dialog.modal > div.jsx-3640661505.modal--body > div > div`).innerText
          }
          if (header) {
            header = header.replace(/\s/g, '')
            let headerArr = header.split('•')
            rating = headerArr[0]
            if (
              rating === 'TV14' || 
              rating === 'TVPG' || 
              rating === 'TVMA' || 
              rating === 'TVY7' || 
              rating === 'TVY' || 
              rating === 'TVG' || 
              rating === 'PG' || 
              rating === 'R' || 
              rating === 'PG-13' || 
              rating === 'G' || 
              rating === 'NC-17'
            ) {
              rating = rating
            } else {
              rating = 'NR'
            }
            year = headerArr[headerArr.length-1]
          }
          let description = ''
          let descriptionBool = document.querySelector(`#description-modal > div.jsx-3640661505.description-modal.modal-dialog.modal > div.jsx-3640661505.modal--body > div > p`) !== null
          if (descriptionBool){
            description = document.querySelector(`#description-modal > div.jsx-3640661505.description-modal.modal-dialog.modal > div.jsx-3640661505.modal--body > div > p`).innerText
          }
          let starring = ''
          return {
            'year': year,
            'rating': rating,
            'description': description,
            'starring': starring,
          }
        })

        detailedTitle = {
          "title": title.title,
          "href": realLink,
          "id": title.id,
          "year": newDetails.year,
          "rating": newDetails.rating,
          "description": newDetails.description,
          "starring":  "",
        }
        titlesWithDetails.push(detailedTitle)

        // Save running list
        fs.writeFile('../data/hulu/delta/details/deltaDetails_running.json', JSON.stringify(titlesWithDetails), function (err) {
          if (err) throw err
        })

      } catch (err) {
        console.log('Error: ', err)
      }
    } 
    browser.close();
    console.log('Finished fetching details...')

    return titlesWithDetails
  }

}

module.exports = detailScraper