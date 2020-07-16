const puppeteer = require('puppeteer-core')
const fs = require('fs')

const titleScraper = {
  run: async () => {
    console.log('Fetching titles...')
    const browser = await puppeteer.launch({ headless: false, executablePath:'/usr/bin/chromium-browser'})
    const page = await browser.newPage()
    await page.setViewport({ width: 1000, height: 800 })
    await titleScraper.login(page)

    const movieGenres = await titleScraper.getGenres(page, 'Movie')
    const tvGenres = await titleScraper.getGenres(page, 'Tv')


    let dateStr = new Date().toISOString().substring(0,19).split(':').join('-')
    let newTitles = await titleScraper.fetchTitles(dateStr)
    try{
    console.log('Saving...')
      fs.writeFileSync('../data/netflix/titles/netflixTitles.json', JSON.stringify(newTitles))
      console.log('Saved new titles!')

      fs.writeFile(`../data/netflix/titles/archive/netflixTitles_${dateStr}.json`, JSON.stringify(newTitles), function (err) {
        if (err) throw err
        console.log('Archived new titles!')
      })

      // After save, reset the running files to be empty
      fs.writeFile(`../data/netflix/titles/netflixTitles_running.json`, JSON.stringify({}), function (err) {
        if (err) throw err
        console.log('Reset running titles file!')
      })
      fs.writeFile(`../data/netflix/titles/titleErrors_running.json`, JSON.stringify([]), function (err) {
        if (err) throw err
        console.log('Reset running errors file!')
      })

    } catch (err) {
      // throw error to stop execution if not saved
      if (err) throw err
    }
  },
  fetchTitles: async (genreLinks, dateIn) => {
    // load the data from running files in case of a crash / restart
    const runningTitlesRaw = fs.readFileSync('../data/netflix/titles/netflixTitles_running.json')
    let runningTitles = JSON.parse(runningTitlesRaw) // is object

    const titleErrorsRaw = fs.readFileSync('../data/netflix/titles/netflixErrors_running.json') // is list
    let titleErrors = JSON.parse(titleErrorsRaw)


    // For each genre link
    for (c=0;c<genreLinks.length;c++) {
      let currentGenre = genreLinks[c].name
      let currentLink = genreLinks[c].href
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
                let newTitle = titlesOnPage[i].alt.split('Cover art for ')[1]
                let beforeQuest = titlesOnPage[i].src.split('?')[0]
                let cutId = beforeQuest.split('artwork/')[1]
                // Remove punctuation from title string and add to id str for real id...
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
          fs.writeFile('../data/hulu/titles/huluTitles_running.json', JSON.stringify(runningTitles), function (err) {
            if (err) throw err
            console.log(currentGenre, ' saved!')
          })

        } catch (err) {
          console.log(err)
          titleErrors.push(err)
          // Save running errors
          fs.writeFile('../data/hulu/titles/titleErrors_running.json', JSON.stringify(titleErrors), function (err) {
            console.log('Save error: ', err)
          })
        }
      } else {
        console.log(' Already have genre - skipping...')
      }
    }
    // Save archive of final errors file
    fs.writeFile(`../data/hulu/titles/archive/titleErrors_${dateIn}.json`, JSON.stringify(titleErrors), function (err) {
      console.log('Save error: ', err)
    })
  
    browser.close()
    await page.waitFor(5*1000)
    console.log('Finished fetching titles...')

    return runningTitles
  },
  login: async (page) => {
    console.log('Logging in...\n')
    await page.goto(`https://www.netflix.com/login`)
    await page.focus('#id_userLoginId')
    await page.keyboard.type('marjorie.rolleston@gmail.com')
    await page.waitFor(1*1000)
    await page.focus('#id_password')
    await page.keyboard.type('BusterCat')
    await page.waitFor(1*1000)
    await page.click('#appMountPoint > div > div.login-body > div > div > div.hybrid-login-form-main > form > button') 
    await page.waitForNavigation()
    await page.click('#appMountPoint > div > div > div:nth-child(1) > div.bd.dark-background > div.profiles-gate-container > div > div > ul > li:nth-child(2)')
    await page.waitForNavigation()
    await page.waitFor(4*1000)
  },
  getGenres: async (page, typeIn) => {
    let typeLink = ''
    if (typeIn === 'Movie') {
      console.log('Getting Movie links...')
      typeLink = 'https://www.netflix.com/browse/genre/34399'
    }
    if (typeIn === 'Tv') {
      console.log('Getting Tv links...')
      typeLink = 'https://www.netflix.com/browse/genre/83'
    }
    await page.waitFor(1*1000)
    await page.goto(typeLink)
    await page.waitFor(6*1000)
    // 2-1. Click the genre flydown to expose list
    await page.click(`#appMountPoint > div > div > div:nth-child(1) > div.bd.dark-background > div.pinning-header > div > div.sub-header > div > div > div > div.aro-genre-details > div.subgenres > div > div > div > div`);
    await page.waitFor(2*1000);
    // 2-2. Get all links:
    let genreLinks = await page.evaluate(()=>{
      let links = document.querySelectorAll('a.sub-menu-link')
      let linkList = []
      for (i=0;i<links.length;i++) {
        let genreName = links[i].text
        let genreLink = links[i].href
        linkList.push({'name': genreName, 'href': genreLink })
      }
      return linkList
    })
    // Save Genres
    fs.writeFile(`../data/netflix/titles/netflix${typeIn}Genres.json`, JSON.stringify(genreLinks), function (err) {
      if (err) throw err;
      console.log('Netflix Genres Saved!');
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