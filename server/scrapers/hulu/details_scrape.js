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
      fs.writeFileSync('../data/hulu/delta/details/deltaDetails.json', JSON.stringify(newDetails))
      console.log('Saved details delta!')

      fs.writeFileSync(`../data/hulu/delta/details/archive/deltaDetails_${dateStr}.json`, JSON.stringify(newDetails))
      console.log('Archived details delta!')

      // After save, reset the running files to empty lists
      fs.writeFileSync(`../data/hulu/delta/details/deltaDetails_running.json`, JSON.stringify([]))
      console.log('Reset running details file!')

      fs.writeFileSync(`../data/hulu/delta/details/detailErrors_running.json`, JSON.stringify([]))
      console.log('Reset running errors file!')

    } catch (err) {
      // throw error to stop execution if not saved
      if (err) throw err
    }
  },
  fetchDetails: async (page, dateIn) => {
    const newTitlesRaw = fs.readFileSync('../data/hulu/delta/titles/deltaTitles.json')
    const newTitles = JSON.parse(newTitlesRaw)

    // load the data from running files in case of a crash / restart
    const currentDetailsRaw = fs.readFileSync('../data/hulu/delta/details/deltaDetails_running.json')
    let titlesWithDetails = JSON.parse(currentDetailsRaw)

    const detailErrorsRaw = fs.readFileSync('../data/hulu/delta/details/detailErrors_running.json')
    let detailErrors = JSON.parse(detailErrorsRaw)

    for (t=0;t<newTitles.length;t++) {
      console.log ('On item: ', t)
      let title = newTitles[t]
      // if not already found
      if ( !titlesWithDetails.some((t) => { return t.id === title.id }) ) {
        try { 
          let detailedTitle = {}
          let movieLink = 'https://www.hulu.com/movie/' + title.id
          let tvLink = 'https://www.hulu.com/series/' + title.id
          let realLink = ''

          // Determine if title is a movie or tv show
          if (title.type === 'movie') {
            realLink = movieLink
          } else {
            realLink = tvLink
          }

          await page.goto(realLink)

          // Wait a bit
          let pageWait = Math.floor(Math.random() * 2) + 1
          await page.waitFor(pageWait*1000)

          // Grab the details
          let newDetails = await page.evaluate(() => {
            let header = ''
            let rating = ''
            let year = ''
            let headerBool = document.querySelector(`.DetailEntityMasthead__tags`) !== null
            if (headerBool){
              header = document.querySelector(`.DetailEntityMasthead__tags`).innerText
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
            let descriptionBool = document.querySelector(".DetailEntityModal__description") !== null
            if (descriptionBool){
              description = document.querySelector(".DetailEntityModal__description").innerText
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
            "type": title.type,
            "year": newDetails.year,
            "rating": newDetails.rating,
            "description": newDetails.description,
            "starring":  "",
          }
          titlesWithDetails.push(detailedTitle)

          // Save running list
          fs.writeFileSync('../data/hulu/delta/details/deltaDetails_running.json', JSON.stringify(titlesWithDetails))

        } catch (err) {
          console.log('Error on: ', title.title)
          console.log(err)
          detailErrors.push({ "title": title.title, "href": title.href, "year": title.year, "id": title.id })
          // Save running errors
          fs.writeFile('../data/hulu/delta/details/detailErrors_running.json', JSON.stringify(detailErrors), function (err) {
            if (err) throw err
          })
        }

      } else {
        console.log(' Already have details - skipping...')
      }

    }

    try {
      // save final errors list
      fs.writeFile(`../data/hulu/delta/details/archive/detailErrors_${dateIn}.json`, JSON.stringify(detailErrors), function (err) {
        if (err) throw err;
        console.log('Saved detail errors!');
      })
    } catch (err) {
      console.log('Save Error: ', err)
    }

    return titlesWithDetails
  }

}

module.exports = detailScraper