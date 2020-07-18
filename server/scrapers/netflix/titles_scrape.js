const puppeteer = require('puppeteer-core')
const fs = require('fs')

const titleScraper = {
  run: async () => {
    console.log('Fetching titles...')
    const dateStr = new Date().toISOString().substring(0,19).split(':').join('-')
    const browser = await puppeteer.launch({ headless: false, executablePath:'/usr/bin/chromium-browser'})
    const page = await browser.newPage()
    await page.setViewport({ width: 1000, height: 800 })
    
    await titleScraper.login(page)

    try{
      const movieGenres = await titleScraper.getGenres(page, 'movie')
      const tvGenres = await titleScraper.getGenres(page, 'tv')
      
      console.log('Fetching movies titles...')
      const movieTitles = await titleScraper.fetchTitles(page, movieGenres, 'movie', dateStr)
      console.log('Saving movies...')
      fs.writeFileSync('../data/netflix/titles/movieTitles.json', JSON.stringify(movieTitles))
      console.log('Saved movie titles!')

      console.log('Fetching tv titles...')
      const tvTitles = await titleScraper.fetchTitles(page, tvGenres, 'tv', dateStr)
      console.log('Saving tv...')
      fs.writeFileSync('../data/netflix/titles/tvTitles.json', JSON.stringify(tvTitles))
      console.log('Saved tv titles!')

      // Close Browser
      browser.close()

      // Archive titles
      fs.writeFile(`../data/netflix/titles/archive/movieTitles_${dateStr}.json`, JSON.stringify(movieTitles), function (err) {
        if (err) throw err
        console.log('Archived movie titles!')
      })
      fs.writeFile(`../data/netflix/titles/archive/tvTitles_${dateStr}.json`, JSON.stringify(tvTitles), function (err) {
        if (err) throw err
        console.log('Archived tv titles!')
      })

      // After save, reset the running files to be empty
      fs.writeFile(`../data/netflix/titles/movieTitles_running.json`, JSON.stringify({}), function (err) {
        if (err) throw err
        console.log('Reset running titles file!')
      })
      fs.writeFile(`../data/netflix/titles/tvTitles_running.json`, JSON.stringify({}), function (err) {
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
  fetchTitles: async (page, genreLinksIn, typeIn, dateIn) => {
    // load the data from running files in case of a crash / restart
    const runningTitlesRaw = fs.readFileSync(`../data/netflix/titles/${typeIn}Titles_running.json`)
    let runningTitles = JSON.parse(runningTitlesRaw) // is object

    const titleErrorsRaw = fs.readFileSync(`../data/netflix/titles/titleErrors_running.json`) // is list
    let titleErrors = JSON.parse(titleErrorsRaw)
    let finalObj = {}

    for (c=0;c<genreLinksIn.length;c++) {
      let currentGenre = genreLinksIn[c].name
      let currentLink = genreLinksIn[c].href
      let titlesOnGenrePage = []
      console.log('On Genre: ', currentGenre)

      // If the genre has already been saved - skip
      if ( !runningTitles[currentGenre] ) {
        try{
          await page.goto(`${currentLink}`)
          await page.waitFor(6*1000);
          await titleScraper.autoScroll(page)
          const rowTotal = await page.evaluate(() => {
            return document.querySelectorAll('div.lolomoRow').length
          })
          console.log('\tTotal rows: ', rowTotal)
          // For each row
          for (currentRow=0;currentRow<rowTotal;currentRow++) {
            // Var for titles in row
            let titlesInRow = []
            console.log('\tScrolling row: ', currentRow, '...')
            // Get pages in current row
            const pagesInRow = await page.evaluate((currentRow) => {
              let pageRowNodesNum = document.querySelectorAll(`#row-${currentRow} > div > div > div > ul > li`).length
              return pageRowNodesNum
            }, currentRow)
            console.log(`\tPages in row ${currentRow}:`, pagesInRow)

            // Scroll through row pages and push titles into row list
            for (i=0;i<pagesInRow;i++) {
              // Get list of titles on page
              console.log('\t\tGetting titles on row page...')
              let titlesOnPage = await page.evaluate((currentRow) => {
                const regex = /watch\/(.*)\?/
                let titlesOnPage = [];
                let titleNodes = document.querySelectorAll(`#row-${currentRow} > div > div > div > div > div > div > div > div > div > a`)
                let listLength = titleNodes.length;

                // For each title on page
                for (j=0;j<listLength;j++) {
                  // Change the url to the title page
                  let originalUrl = titleNodes[j].href;
                  let titleNumber = originalUrl.match(regex)[1]
                  let titleUrl = 'https://www.netflix.com/title/' + titleNumber
                  // Create a title obj
                  let titleObject = {
                    'title': titleNodes[j].getAttribute('aria-label'),
                    'href' : titleUrl,
                    'id' : titleNumber
                  };
                  // 5-3 Push into list to return
                  titlesOnPage.push(titleObject)
                }
                // 5-4 Return list of page titles on row
                return titlesOnPage
              }, currentRow);
              // 4-2 Push page list into row list
              titlesInRow.push(...titlesOnPage)
              // 4-3 Go to next page
              await page.click(`#row-${currentRow} > div > div > div > span.handle.handleNext.active`)
              await page.waitFor(1*1000)
            }
            // 3-3 Filter array for only unique titles in the row
            const filteredRowTitles = titlesInRow.filter((item, index, self) =>
              index === self.findIndex((t) => (
                t.id === item.id
              ))
            )
            // 3-4 push row into page title list
            console.log('\t\tSaving all titles on row...')
            titlesOnGenrePage.push(...filteredRowTitles)
          }
          // 3-3-2 Get final titles on page for any links that were missed (or not in row format)
          let allTitlesOnPage = await page.evaluate(() => {
            const regex = /watch\/(.*)\?/;
            let titlesOnPage = []
            let titleNodes = document.querySelectorAll(`a[role="link"]`)
            let listLength = titleNodes.length;
            // 5. For each title on page
            for (j=0;j<listLength;j++) {
              // 5-1. Change the url to the title page
              let originalUrl = titleNodes[j].href;
              let titleNumber = originalUrl.match(regex)[1];
              let titleUrl = 'https://www.netflix.com/title/' + titleNumber;
              // 5-2 Create a title obj
              let titleObject = {
                'title': titleNodes[j].getAttribute('aria-label'),
                'href' : titleUrl,
                'id' : titleNumber
              };
              // 5-3 Push into list to return
              titlesOnPage.push(titleObject)
            }
            // 5-4 Return list of page titles on row
            return titlesOnPage
          });
          titlesOnGenrePage.push(...allTitlesOnPage)
          // 2-4 Filter list again to remove duplicates between rows
          console.log('\tRemoving dupes in genre...')
          const filteredGenreTitles = titlesOnGenrePage.filter((item, index, self) =>
            index === self.findIndex((t) => (
              t.id === item.id
            ))
          )
          // 2-5 push filtered genre titles list into a final tv obj
          console.log('\tSaving genre: ', currentGenre, '...')
          finalObj[currentGenre] = filteredGenreTitles
          // Save running list of genre
          fs.writeFile(`../data/netflix/titles/${typeIn}Titles_running.json`, JSON.stringify(finalObj), function (err) {
            if (err) throw err
            console.log(currentGenre, ' saved!')
          })
        } catch (err) {
          console.log(err)
          titleErrors.push(err)
          // Save running errors
          fs.writeFile('../data/netflix/titles/titleErrors_running.json', JSON.stringify(titleErrors), function (err) {
            console.log('Save error: ', err)
          })
        }
      } else {
        console.log(' Already have genre - skipping...')
      }
    }
    // Save archive of final errors file
    fs.writeFile(`../data/netflix/titles/archive/titleErrors_${dateIn}.json`, JSON.stringify(titleErrors), function (err) {
      console.log('Save error: ', err)
    })

    await page.waitFor(4*1000)
    console.log(`Finished fetching ${typeIn} titles...`)

    return finalObj
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
    await page.waitFor(5*1000)
  },
  getGenres: async (page, typeIn) => {
    let typeLink = ''
    if (typeIn === 'movie') {
      console.log('Getting Movie links...')
      typeLink = 'https://www.netflix.com/browse/genre/34399'
    }
    if (typeIn === 'tv') {
      console.log('Getting Tv links...')
      typeLink = 'https://www.netflix.com/browse/genre/83'
    }
    await page.waitFor(1*1000)
    await page.goto(typeLink)
    await page.waitFor(5*1000)
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
    fs.writeFile(`../data/netflix/titles/${typeIn}Genres.json`, JSON.stringify(genreLinks), function (err) {
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