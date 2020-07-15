const puppeteer = require('puppeteer-core')
const fs = require('fs')

const detailScraper = {
  run: async () => {
    console.log('Fetching details...')
    let dateStr = new Date().toISOString().substring(0,19).split(':').join('-')
    let newDetails = await detailScraper.fetchDetails(dateStr)
    try{
    console.log('Saving...')
      fs.writeFileSync('../data/hulu/delta/ratings/deltaRatings_fix.json', JSON.stringify(newDetails))
      console.log('Saved details delta!')

      fs.writeFile(`../data/hulu/delta/details/archive/deltaRatings_${dateStr}.json`, JSON.stringify(newDetails), function (err) {
        if (err) throw err
        console.log('Archived details delta!')
      })

    } catch (err) {
      // throw error to stop execution if not saved
      if (err) throw err
    }
  },
  fetchDetails: async (datein) => {
    const browser = await puppeteer.launch({ headless: false, executablePath:'/usr/bin/chromium-browser'})
    const page = await browser.newPage()
    const newTitlesRaw = fs.readFileSync('../data/hulu/delta/ratings/deltaRatings.json')
    const newTitles = JSON.parse(newTitlesRaw)

    let titlesWithDetails = []

    await page.setViewport({
        width: 600,
        height: 800
    })

    for (t=0;t<newTitles.length;t++) {
      console.log ('On item: ', t)
      let title = newTitles[t]
        try { 
          await page.goto(title.href)
          await page.waitFor(1000)

          // Grab the description
          let newDescription = await page.evaluate(() => {
            let description = ''
            let descriptionBool = document.querySelector(".DetailEntityModal__description") !== null
            if (descriptionBool){
              description = document.querySelector(".DetailEntityModal__description").innerText
            }
            return description
          })

          detailedTitle = title
          detailedTitle.description = newDescription
          titlesWithDetails.push(detailedTitle)

        } catch (err) {
          console.log('Error on: ', title.title)
          console.log(err)
        }
    }

    browser.close();
    console.log('Finished fetching details...')

    return titlesWithDetails
  }

}

detailScraper.run()