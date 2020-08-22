const puppeteer = require('puppeteer-core')
const fs = require('fs')

const titleScraper = {
  run: async () => {
    console.log('Fetching titles...')
    let dateStr = new Date().toISOString().substring(0,19).split(':').join('-')
    const browser = await puppeteer.launch({ headless: false, executablePath:'/usr/bin/chromium-browser'})
    const page = await browser.newPage()

    await page.setViewport({
      width: 1000,
      height: 800
    })
    try{
      // get the current genre links
      const tvGenresRaw = fs.readFileSync(`../data/hulu/current/tvGenres.json`)
      let tvGenres = JSON.parse(tvGenresRaw) // is list

      const movieGenresRaw = fs.readFileSync('../data/hulu/current/movieGenres.json') // is list
      let movieGenres = JSON.parse(movieGenresRaw)

      console.log(tvGenres)
      console.log(movieGenres)
    
      console.log('Fetching movies titles...')
      const movieTitles = await titleScraper.fetchTitles(page, movieGenres, 'movie', dateStr)
      console.log('Saving movies...')
      fs.writeFileSync('../data/hulu/titles/movieTitles.json', JSON.stringify(movieTitles))
      console.log('Saved movie titles!')

      console.log('Fetching tv titles...')
      const tvTitles = await titleScraper.fetchTitles(page, tvGenres, 'tv', dateStr)
      console.log('Saving tv...')
      fs.writeFileSync('../data/hulu/titles/tvTitles.json', JSON.stringify(tvTitles))
      console.log('Saved tv titles!')

      console.log('Finished fetching titles...')
      // Close Browser
      browser.close()

      // Archive titles
      fs.writeFile(`../data/hulu/titles/archive/movieTitles_${dateStr}.json`, JSON.stringify(movieTitles), function (err) {
        if (err) throw err
        console.log('Archived movie titles!')
      })
      fs.writeFile(`../data/hulu/titles/archive/tvTitles_${dateStr}.json`, JSON.stringify(tvTitles), function (err) {
        if (err) throw err
        console.log('Archived tv titles!')
      })

      // After save, reset the running files to be empty
      fs.writeFile(`../data/hulu/titles/movieTitles_running.json`, JSON.stringify({}), function (err) {
        if (err) throw err
        console.log('Reset running titles file!')
      })
      fs.writeFile(`../data/hulu/titles/tvTitles_running.json`, JSON.stringify({}), function (err) {
        if (err) throw err
        console.log('Reset running titles file!')
      })
      fs.writeFile(`../data/hulu/titles/titleErrors_running.json`, JSON.stringify([]), function (err) {
        if (err) throw err
        console.log('Reset running errors file!')
      })

    } catch (err) {
      // throw error to stop execution if not saved
      if (err) throw err
    }
  },
  fetchTitles: async (page, genreLinksIn, typeIn, dateIn) => {

    // load the data from running files in case of a crash / restart
    const runningTitlesRaw = fs.readFileSync(`../data/hulu/titles/${typeIn}Titles_running.json`)
    let runningTitles = JSON.parse(runningTitlesRaw) // is object

    const titleErrorsRaw = fs.readFileSync('../data/hulu/titles/titleErrors_running.json') // is list
    let titleErrors = JSON.parse(titleErrorsRaw)

    // Login:
    await titleScraper.login(page)

    // For each genre link
    for (c=0;c<genreLinksIn.length;c++) {
      let currentGenre = genreLinksIn[c].name
      let currentLink = genreLinksIn[c].href
      console.log('On Genre: ', currentGenre)

      // If the genre has already been saved - skip
      if ( !runningTitles[currentGenre] ) {
        try{
          await page.goto(`${currentLink}`)
          await page.waitFor(5*1000);
          await titleScraper.autoScroll(page);

          let azRowIndex = await page.evaluate(() => {
            let index = -1
            let allRows = document.querySelectorAll('.Hub__collection')
            for (i=0;i<allRows.length;i++){
              let text = allRows[i].innerText.slice(0,3)
              if (text === 'A-Z') {
                index = i
                break
              }
            }
            if (index === -1) {
              console.log('Err: No index for A-Z row on genre')
            }
            return index
          });

          let nextBtnDisabled
          let genreHuluList = []
          let pageCounter = 0

          // scroll A-Z list until the end
          for (pageIndex=0;!nextBtnDisabled;pageIndex++) {
            console.log('   On page: ', pageCounter)

            // Check for the next button disable
            nextBtnDisabled = await page.evaluate((rowIndex) => {
              let selector = `.Hub__collection:nth-child(${rowIndex + 1}) > div > div[data-testid="slider"] > button[data-testid="slider-next"]`
              let correctBtn = document.querySelector(selector)
              return correctBtn.disabled
            }, azRowIndex)

            // get all items on current page in list
            let titlesOnPageList = await page.evaluate(()=>{
              let objList = []
              let selector = 'ul[aria-label = "A-Z"] > li > div > div > figure > div > button > div > img'
              let titlesOnPage = document.querySelectorAll(selector);
                
              for (i=0;i<titlesOnPage.length;i++) {
                let currentObj = {}
                let title = ''
                let id = ''
                let periodTitle = titlesOnPage[i].alt.split('Cover art for ')[1] // could also get this (or overwrite) in detail scrape
                let newTitle = periodTitle.replace(/\.$/, '') // remove period from the end of titles
                let beforeQuest = titlesOnPage[i].src.split('?')[0]
                let cutId = beforeQuest.split('artwork/')[1]
                // Remove punctuation from title string and add to id str for real id...
                // This may be removed at some point, since I think that just the ids without names route to the correct title
                let titleStr = newTitle.replace(/[^\w\s]|_/g, "").replace(/\s+/g, "-").toLowerCase()
                let realId = titleStr + '-' + cutId

                id = realId
                title = newTitle

                currentObj.title = title
                currentObj.id = id
                objList.push(currentObj)
              }
              return objList
            })

            for (j=0;j<titlesOnPageList.length;j++){
                genreHuluList.push(titlesOnPageList[j])
            }
            // Set random page wait time from 2-3 seconds
            // let pageWait = Math.floor(Math.random() * 2) + 2;
            await page.waitFor(1000);

            // click to the next page
            let btnSelector = `.Hub__collection:nth-child(${azRowIndex + 1}) > div > div[data-testid="slider"] > button[data-testid="slider-next"]`
            await page.click(btnSelector)
            pageCounter++
          }
          console.log('Exited button clicking loop\n\n')

          // filter array for only unique titles in genre
          const filteredHuluList = genreHuluList.filter((item, index, self) =>
            index === self.findIndex((t) => (
              t.id === item.id
            ))
          )
          // save into th hulu objects
          runningTitles[currentGenre] = filteredHuluList

          // Save running list of genre
          fs.writeFile(`../data/hulu/titles/${typeIn}Titles_running.json`, JSON.stringify(runningTitles), function (err) {
            if (err) throw err
            console.log(currentGenre, ' saved!')
          })

        } catch (err) {
          console.log(err)
          titleErrors.push(err)
          // Save running errors
          fs.writeFile('../data/hulu/titles/titleErrors_running.json', JSON.stringify(titleErrors), function (err) {
            if (err) {
              console.log('Save errors error: ', err)
            }
          })
        }
      } else {
        console.log(' Already have genre - skipping...')
      }
    }
    // Save archive of final errors file
    fs.writeFile(`../data/hulu/titles/archive/titleErrors_${dateIn}.json`, JSON.stringify(titleErrors), function (err) {
      if (err) {
        console.log('Save errors error: ', err)
      }
    })

    return runningTitles
  },
  login: async (page) => {
    await page.goto(`https://auth.hulu.com/web/login`)
    await page.focus('#email_id')
    await page.keyboard.type('ellynkeith@gmail.com')
    await page.waitFor(1*1000)
    await page.focus('#password_id')
    await page.keyboard.type('3rnieM@tilda')
    await page.waitFor(2*1000)
    await page.click('#__next > div > div > div.jsx-2318525612.login-dialog > div.jsx-2318525612.login-panel > div.jsx-1761454348.hulu-login > button') 
    await page.waitFor(5*1000)
    await page.click('#__next > div > div > div.Modal__dialog.Modal__dialog--visible > div.ProfileSelectorModal__bottom.cu-profileselectormodal-bottom > div > div:nth-child(3) > button')
    await page.waitForNavigation()
    await page.waitFor(5*1000)
    await page.click('.WelcomeModal__cta') // close annoying popup
    await page.waitFor(3*1000)
  },
  getGenres: async (page) => {
    let genreLinks = await page.evaluate(()=>{
      let links = document.querySelectorAll('a.BrowseMenu__item')
      let linkList = []
      for (i=6;i<links.length;i++) {
        let genreName = links[i].text
        let genreLink = links[i].href
        linkList.push({'name': genreName, 'href': genreLink })
      }
      return linkList
    })

    console.log('Current Genre Links: ', genreLinks)
    console.log('=========================================================')
    console.log('')
    console.log('')

    // Save Genres
    fs.writeFile('../data/hulu/titles/huluGenres.json', JSON.stringify(genreLinks), function (err) {
      if (err) throw err;
      console.log('Hulu Genres Saved!');
    })
    return genreLinks
  },
  autoScroll: async (page) => {
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0
        let distance = 60
        let timer = setInterval(() => {
          let scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if(totalHeight >= scrollHeight){
            clearInterval(timer);
            resolve();
          }
        }, 100)
      })
    })
  }
}

module.exports = titleScraper