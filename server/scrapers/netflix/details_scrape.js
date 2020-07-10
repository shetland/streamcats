const puppeteer = require('puppeteer')
const fs = require('fs')
const tvImportObj = require('../exports/netflix/tvObj_noDetails.json')
const movieImportObj = require('../exports/netflix/movieObj_noDetails.json')
const tvKeys = Object.keys(tvImportObj)
const movieKeys = Object.keys(movieImportObj)

async function run() {
    const browser = await puppeteer.launch({ headless: false });
    const context = await browser.createIncognitoBrowserContext()
    const page = await context.newPage()

    await page.setViewport({
        width: 1000,
        height: 800
    });

    console.log('Getting Tv Details...')
    let tvExportObj = await getTitleDetails(tvKeys, tvImportObj)
    console.log('Saving...')
    fs.writeFile('../exports/netflix/tvDetailsObj.json', JSON.stringify(tvExportObj), function (err) {
        if (err) throw err;
        console.log('Saved!')
    });

    console.log('Getting Movie Details...')
    let movieExportObj = await getTitleDetails(movieKeys, movieImportObj)
    console.log('Saving...')
    fs.writeFile('../exports/netflix/movieDetailsObj.json', JSON.stringify(movieExportObj), function (err) {
        if (err) throw err;
        console.log('Saved!')
    });

    // browser.close();
    console.log('\nFinished!')

    // =========================================================
    // Function Definitions
    //==========================================================

    // GetTitleDetails: Visits each titles url on the web and grabs the relevant details
    async function getTitleDetails(formatKeysIn, importObjIn) {
        let exportObj = {}

        // 1. For each genre in format...
        for (c=0;c<formatKeysIn.length;c++) { 
            let currentGenre = formatKeysIn[c]
            let currentArray = importObjIn[currentGenre]
            let currentLength = currentArray.length
            console.log('On Genre: ', currentGenre)

            // 2. For each title in genre...
            for (i=0;i<currentLength;i++) {
                // 2-1. Go to page and extract title id from the url
                await page.goto(`${currentArray[i].href}`)
                console.log('   On item: ', i)
                let regex = /(?<=title\/).*/
                let id = currentArray[i].href.match(regex)[0]
                currentArray[i].id = id

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
                console.log('Assigning item details...')
                currentArray[i] = Object.assign(currentArray[i], newObject)
            }
            // 1-2. Save the genre array with the updated details
            console.log('Saving genre: ', currentGenre)
            exportObj[currentGenre] = currentArray
        }
        return exportObj
    }
}

run()