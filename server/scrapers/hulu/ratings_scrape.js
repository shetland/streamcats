const puppeteer = require('puppeteer-core')
const fs = require('fs')

const ratingScraper = {
  run: async () => {
    console.log('Fetching ratings...')
    let dateStr = new Date().toISOString().substring(0,19).split(':').join('-')
    let newRatings = await ratingScraper.fetchRatings(dateStr)
    
    console.log('Saving...')
    try {
      fs.writeFileSync('../data/hulu/delta/ratings/deltaRatings.json', JSON.stringify(newRatings))
      console.log('Saved ratings delta!')

      fs.writeFile(`../data/hulu/delta/ratings/archive/deltaRatings_${dateStr}.json`, JSON.stringify(newRatings), function (err) {
        if (err) throw err
        console.log('Archived ratings delta!')
      })
      // After save, reset the running files to empty lists
      fs.writeFile(`../data/hulu/delta/ratings/deltaRatings_running.json`, JSON.stringify([]), function (err) {
        if (err) throw err
        console.log('Reset running ratings file!')
      })
      fs.writeFile(`../data/hulu/delta/ratings/ratingIssues_running.json`, JSON.stringify([]), function (err) {
        if (err) throw err
        console.log('Reset running issues file!')
      })
      fs.writeFile(`../data/hulu/delta/ratings/ratingErrors_running.json`, JSON.stringify([]), function (err) {
        if (err) throw err
        console.log('Reset running errors file!')
      })

    } catch (err) {
      // throw error to stop execution if not saved
      console.log(err)
      if (err) throw err
    }
  },
  fetchRatings: async (dateIn) => {
    const browser = await puppeteer.launch({ headless: false, executablePath:'/usr/bin/chromium-browser'})
    const page = await browser.newPage()
    const newTitlesRaw = fs.readFileSync('../data/hulu/delta/details/deltaDetails.json')
    const newTitles = JSON.parse(newTitlesRaw)

    // load the data from running files in case of a crash / restart
    const currentRatingsRaw = fs.readFileSync('../data/hulu/delta/ratings/deltaRatings_running.json')
    let titlesWithRatings = JSON.parse(currentRatingsRaw)

    const ratingIssuesRaw = fs.readFileSync('../data/hulu/delta/ratings/ratingIssues_running.json')
    let ratingIssues = JSON.parse(ratingIssuesRaw)

    const ratingErrorsRaw = fs.readFileSync('../data/hulu/delta/ratings/ratingErrors_running.json')
    let ratingErrors = JSON.parse(ratingErrorsRaw)

    await page.setViewport({
        width: 600,
        height: 800
    });

    for (t=0;t<newTitles.length;t++) {
      console.log ('On item: ', t)
      let title = newTitles[t]

      if ( !titlesWithRatings.some((t) => { return t.href === title.href }) ) {
        try { 
          // hulu specific check
          let titleType = ''
          let link = title.href
          if (link.includes('/series/')){
            titleType = 'series'
          }
          if (link.includes('/movie/')){
            titleType = 'movie'
          }

          let titleName = title.title
          let searchName = titleName.replace(/ *\([^)]*\) */g, "");
          let searchStr = searchName + ' (' + title.year + ') ' + titleType + ' imdb' 
          let searchNameLC = searchName.toLowerCase()
          let searchNameRegex = new RegExp(searchNameLC, 'g')

          await page.goto(`https://duckduckgo.com/`)
          await page.focus('#search_form_input_homepage')
          await page.keyboard.type(searchStr)
          await page.waitFor(1000);
          await page.keyboard.press('Enter')
          await page.waitForNavigation()
          await page.waitFor(1000)

          let imdbLink = await page.evaluate(() => {
            let link = ''
            let selector = '#r1-0 > div > h2 > a.result__a'
            let hrefBool = document.querySelector(selector) !== null
            if (hrefBool) {
              let found = document.querySelector(selector).href
              if (found) {
                link = found
              }
            }
            return link
          })

          page.goto(imdbLink, {waitUntil:'domcontentloaded'})
          await page.waitFor(3500)

          let imdbTitle = await page.evaluate(() => {
            let str = ''
            let selector = '#title-overview-widget > div.vital > div.title_block > div > div.titleBar > div.title_wrapper > h1'
            let titleBool = document.querySelector(selector) !== null
            if (titleBool) {
              let found = document.querySelector(selector).innerText
              if (found) {
                str = found
              }
            }
            return str
          })

          let imdbScore = await page.evaluate(() => {
              let score = 0
              let selector = 'span[itemprop="ratingValue"]'
              let scoreBool = document.querySelector(selector) !== null
              if (scoreBool) {
                let scoreText = document.querySelector(selector).innerText
                let scoreOnItem = parseFloat(scoreText)
                if (scoreOnItem) {
                  score = scoreOnItem
                }
              }
              return score
          })

          let checkObj = {}
          let checkTitle = imdbTitle.toLowerCase()

          if(checkTitle.match(searchNameRegex)) {
            console.log('Found: ', imdbTitle, ' Matches: ', searchName)
          } else {
            console.log(imdbTitle, ' does NOT match: ', searchName)
            checkObj.title = title.title
            checkObj.href = title.href
            checkObj.id = title.id
            checkObj.year = title.year
            checkObj.imdbTitle = imdbTitle
            checkObj.imdbHref = imdbLink
            ratingIssues.push(checkObj)
            // Save running issues list
            fs.writeFile('../data/hulu/delta/ratings/ratingIssues_running.json', JSON.stringify(ratingIssues), function (err) {
              if (err) throw err
            })
          }

          if (imdbScore) {
              console.log('       Score: ', imdbScore)
              title.imdbScore = imdbScore.toFixed(1)
          } else {
              console.log('       Score not available')
              title.imdbScore = 'N/A'
          }

          if (imdbTitle) {
            title.imdbHref = imdbLink
          } else {
            title.imdbHref = ''
          }

          titlesWithRatings.push(title)
          // Save running ratings list
          fs.writeFile('../data/hulu/delta/ratings/deltaRatings_running.json', JSON.stringify(titlesWithRatings), function (err) {
            if (err) throw err
          })

          await page.waitFor(1000)

        } catch (err) {
          console.log('Error on: ', title.title)
          console.log(err)
          ratingErrors.push({ "title": title.title, "href": title.href, "year": title.year, "id": title.id})
          // Save running errors list
          fs.writeFile('../data/hulu/delta/ratings/ratingErrors_running.json', JSON.stringify(ratingErrors), function (err) {
            if (err) throw err
          })
        }

      } else {
        console.log(' Already have rating - skipping...')
      }

    }

    try {
      // save final and archive issues list
      fs.writeFileSync('../data/hulu/delta/ratings/ratingIssues.json', JSON.stringify(ratingIssues))
      console.log('Saved rating issues!')

      fs.writeFileSync('../data/hulu/delta/ratings/ratingErrors.json', JSON.stringify(ratingErrors))
      console.log('Saved rating errors!')

      fs.writeFile(`../data/hulu/delta/ratings/archive/ratingIssues_${dateIn}.json`, JSON.stringify(ratingIssues), function (err) {
        if (err) throw err;
        console.log('Saved rating issues!')
      })
      fs.writeFile(`../data/hulu/delta/ratings/archive/ratingErrors_${dateIn}.json`, JSON.stringify(ratingErrors), function (err) {
        if (err) throw err;
        console.log('Saved rating errors!')
      })
    } catch (err) {
      console.log('Save Error: ', err)
    }

    browser.close();
    console.log('Finished fetching ratings...')

    return titlesWithRatings
  }

}

module.exports = ratingScraper
