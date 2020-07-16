const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function run() {
    const browser = await puppeteer.launch({ headless: false, executablePath:'/usr/bin/chromium-browser'});
    const page = await browser.newPage();

    await page.setViewport({
        width: 1000,
        height: 800
    });

    //1. Login
    console.log('Logging in...\n')
    await page.goto(`https://www.netflix.com/login`);
    await page.focus('#id_userLoginId')
    await page.keyboard.type('marjorie.rolleston@gmail.com');
    await page.waitFor(1*1000);
    await page.focus('#id_password')
    await page.keyboard.type('BusterCat');
    await page.waitFor(1*1000);
    await page.click('#appMountPoint > div > div.login-body > div > div > div.hybrid-login-form-main > form > button') 
    await page.waitForNavigation();
    await page.click('#appMountPoint > div > div > div:nth-child(1) > div.bd.dark-background > div.profiles-gate-container > div > div > ul > li:nth-child(2)')
    await page.waitForNavigation();

    // 2. Get Tv Genre Links:
    console.log('Getting Tv links...')
    await page.waitFor(3*1000);
    await page.goto(`https://www.netflix.com/browse/genre/83`);
    await page.waitFor(6*1000);

    // 2-1. Click the genre flydown to expose list
    await page.click(`#appMountPoint > div > div > div:nth-child(1) > div.bd.dark-background > div.pinning-header > div > div.sub-header > div > div > div > div.aro-genre-details > div.subgenres > div > div > div > div`);
    await page.waitFor(2*1000);

    // 2-2. Get all links:
    let tvGenreLinks = await page.evaluate(()=>{
        let links = document.querySelectorAll('a.sub-menu-link')
        let linkList = []
        for (i=0;i<links.length;i++) {
            let genreName = links[i].text
            let genreLink = links[i].href
            linkList.push({'name': genreName, 'href': genreLink })
        }
        return linkList
    });

    // 3. Get Movie Genre Links:
    console.log('Getting Movie links...')
    await page.waitFor(3*1000);
    await page.goto(`https://www.netflix.com/browse/genre/34399`);
    await page.waitFor(6*1000);

    // 3-1. Click the genre flydown to expose list
    await page.click(`#appMountPoint > div > div > div:nth-child(1) > div.bd.dark-background > div.pinning-header > div > div.sub-header > div > div > div > div.aro-genre-details > div.subgenres > div > div > div > div`);
    await page.waitFor(2*1000);

    // 3-2. Get all links:
    let movieGenreLinks = await page.evaluate(()=>{
        let links = document.querySelectorAll('a.sub-menu-link')
        let linkList = []
        for (i=0;i<links.length;i++) {
            let genreName = links[i].text
            let genreLink = links[i].href
            linkList.push({'name': genreName, 'href': genreLink })
        }
        return linkList
    });

    // 4. Get all Tv Titles
    await page.waitFor(4*1000);
    console.log('\nStarting the Tv scrape subroutine...\n')
    let tvObj = await getFormatTitles(tvGenreLinks, 'tv')

    // 5. Save Tv Object in exports
    fs.writeFile('../data/netflix/titles/tvObj_noDetails.json', JSON.stringify(tvObj), function (err) {
        if (err) throw err;
        console.log('Saved Tv!');
    });

    // 6. Get all Movie Titles
    await page.waitFor(4*1000);
    console.log('\nStarting the movie scrape subroutine...\n')
    let movieObj = await getFormatTitles(movieGenreLinks, 'movie')

    // 7. Save Movie Object in exports
    fs.writeFile('../data/netflix/titles/movieObj_noDetails.json', JSON.stringify(movieObj), function (err) {
        if (err) throw err;
        console.log('Saved Movies!');
    });

    // 8. Close browser and finish
    await page.waitFor(60*1000);
    browser.close();
    console.log('\n\nFinished!');

    // =============================================================================
    // Function Definitions
    // =============================================================================

    // I. GetFormatTitles: Function to get obj of all titles in a format (Tv and Movie)
    async function getFormatTitles(genreLinksListIn, mediaType) {
        // 1. Declare final obj
        let finalObj = {}
        // 2. For each genre in list
        for (g=0;g<genreLinksListIn.length;g++) {

            // 2-1. Save vars for genre names, links, and page title list, and final obj
            let currentGenre = genreLinksListIn[g].name
            let currentLink = genreLinksListIn[g].href
            let titlesOnGenrePage = []
            console.log('On Genre: ', currentGenre)

            // 2-2. Go to current genre page
            await page.goto(`${currentLink}`);
            await page.waitFor(6*1000);

            // 2-3. Scroll to the bottom of the page to get all content
            await autoScroll(page);

            // 2-4. Get number of rows on page
            const rowTotal = await page.evaluate(() => {
                return document.querySelectorAll('div.lolomoRow').length;
            });
            console.log('\tTotal rows: ', rowTotal)

            // 3. Get number of pages in row
            for (currentRow=0;currentRow<rowTotal;currentRow++) {
                // 3-1. Var for titles in row
                let titlesInRow = []
                console.log('\tScrolling row: ', currentRow, '...')

                // 3-2. Get pages in current row
                const pagesInRow = await page.evaluate((currentRow) => {
                    let pageRowNodesNum = document.querySelectorAll(`#row-${currentRow} > div > div > div > ul > li`).length;
                    return pageRowNodesNum;
                }, currentRow);
                console.log(`\tPages in row ${currentRow}:`, pagesInRow)

                // 4. Scroll through row pages and push titles into row list
                for (i=0;i<pagesInRow;i++) {

                    // 4-1. Get list of titles on page
                    console.log('\t\tGetting titles on row page...')
                    let titlesOnPage = await page.evaluate((currentRow) => {
                        const regex = /watch\/(.*)\?/;
                        let titlesOnPage = [];
                        let titleNodes = document.querySelectorAll(`#row-${currentRow} > div > div > div > div > div > div > div > div > div > a`)
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

                    }, currentRow);

                    // 4-2 Push page list into row list
                    titlesInRow.push(...titlesOnPage)

                    // 4-3 Go to next page
                    await page.click(`#row-${currentRow} > div > div > div > span.handle.handleNext.active`)
                    await page.waitFor(2*1000)
                }

                // 3-3 Filter array for only unique titles in the row
                const filteredRowTitles = titlesInRow.filter((item, index, self) =>
                    index === self.findIndex((t) => (
                        t.id === item.id
                    ))
                );    
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
            );

            // 2-5 push filtered genre titles list into a final tv obj
            console.log('\tSaving genre: ', currentGenre, '...')
            finalObj[currentGenre] = filteredGenreTitles

            // 2-6 Save running object
            fs.writeFile(`../data/netflix/titles/${mediaType}Obj_running.json`, JSON.stringify(finalObj), function (err) {
                if (err) throw err;
                console.log('Saved Running Object');
            });

            console.log('\tDone\n')
        }
        // 1-1 Return final obj
        return finalObj
    }

    // II. Autoscroll: Function to scroll to the bottom of the page to load all results
    async function autoScroll(page){
        await page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                var totalHeight = 0;
                var distance = 60;
                var timer = setInterval(() => {
                    var scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
    
                    if(totalHeight >= scrollHeight){
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });
    }

}

run();