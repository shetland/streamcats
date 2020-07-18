const puppeteer = require('puppeteer-core')
const fs = require('fs')

const detailScraper = {
  run: async () => {
    const dateStr = new Date().toISOString().substring(0,19).split(':').join('-')
    const browser = await puppeteer.launch({ headless: false, executablePath:'/usr/bin/chromium-browser'})
    const page = await browser.newPage()
    await page.setViewport({ width: 1000, height: 800 })

    console.log('Fetching details...')
    let newDetails = await detailScraper.fetchDetails(page, dateStr)

    browser.close()

    try{
      console.log('Saving...')
      fs.writeFileSync('../data/netflix/delta/details/deltaDetails.json', JSON.stringify(newDetails))
      console.log('Saved details delta!')

      fs.writeFileSync(`../data/netflix/delta/details/archive/deltaDetails_${dateStr}.json`, JSON.stringify(newDetails))
      console.log('Archived details delta!')

      // After save, reset the running files to empty lists
      fs.writeFileSync(`../data/netflix/delta/details/deltaDetails_running.json`, JSON.stringify([]))
      console.log('Reset running details file!')

      fs.writeFileSync(`../data/netflix/delta/details/detailErrors_running.json`, JSON.stringify([]))
      console.log('Reset running errors file!')

    } catch (err) {
      // throw error to stop execution if not saved
      if (err) throw err
    }
  },
  fetchDetails: async (page, dateIn) => {
    const newTitlesRaw = fs.readFileSync('../data/netflix/delta/titles/deltaTitles.json')
    const newTitles = JSON.parse(newTitlesRaw)
    // load the data from running files in case of a crash / restart
    const currentDetailsRaw = fs.readFileSync('../data/netflix/delta/details/deltaDetails_running.json')
    let titlesWithDetails = JSON.parse(currentDetailsRaw)

    const detailErrorsRaw = fs.readFileSync('../data/netflix/delta/details/detailErrors_running.json')
    let detailErrors = JSON.parse(detailErrorsRaw)

    for (t=0;t<newTitles.length;t++) {
      console.log ('On item: ', t)
      let title = newTitles[t]
      // if not already found
      if ( !titlesWithDetails.some((t) => { return t.id === title.id }) ) {
        try { 
          // 2-1. Go to page and extract title id from the url
          await page.goto(`${title.href}`)
          // 2-2. Set random page wait time 1-2 seconds
          let pageWait = Math.floor(Math.random() * 2) + 1
          await page.waitFor(pageWait*1000)

          // 2-3. Evaluate the page to pull details
          let newObject = await page.evaluate(() => {
            let year = ''
            let yearBool = document.querySelector(`span.title-info-metadata-item:nth-child(1)`) !== null
            if (yearBool){
              year = document.querySelector(`span.title-info-metadata-item:nth-child(1)`).innerText
            }
            let rating = ''
            let ratingBool = document.querySelector(`.maturity-number`) !== null
            if (ratingBool){
              rating = document.querySelector(`.maturity-number`).innerText
            }
            let description = ''
            let descriptionBool = document.querySelector(`.title-info-synopsis`) !== null
            if (descriptionBool){
              description = document.querySelector(`.title-info-synopsis`).innerText
            }
            let starring = ''
            let starringBool = document.querySelector(`div.title-data-info-item:nth-child(1) > span:nth-child(2)`) !== null
            if (starringBool){
              starring = document.querySelector(`div.title-data-info-item:nth-child(1) > span:nth-child(2)`).innerText
            }
            // 2-4. Return object with extracted details
            return {
              'year': year,
              'rating': rating,
              'description': description,
              'starring': starring
            }
          })
          // 2-5. Save new title with details
          console.log(' Assigning item details...')
          title = Object.assign(title, newObject)

          titlesWithDetails.push(title)

          // Save running list
          fs.writeFileSync('../data/netflix/delta/details/deltaDetails_running.json', JSON.stringify(titlesWithDetails))

        } catch (err) {
          console.log('Error on: ', title.title)
          console.log(err)
          detailErrors.push({ "title": title.title, "href": title.href, "year": title.year, "id": title.id })
          // Save running errors
          fs.writeFile('../data/netflix/delta/details/detailErrors_running.json', JSON.stringify(detailErrors), function (err) {
            if (err) throw err
          })
        }
      } else {
        console.log(' Already have details - skipping...')
      }

    }
    try {
      // save final errors list
      fs.writeFile(`../data/netflix/delta/details/archive/detailErrors_${dateIn}.json`, JSON.stringify(detailErrors), function (err) {
        if (err) throw err
        console.log('Saved detail errors!')
      })
    } catch (err) {
      console.log('Save Error: ', err)
    }

    console.log('Finished fetching details...')

    return titlesWithDetails
  }
}

module.exports = detailScraper