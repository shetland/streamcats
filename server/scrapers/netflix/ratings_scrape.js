const puppeteer = require('puppeteer');
const fs = require('fs');

const tvImportObj = require('../exports/netflix/tvDetailsObj.json');
const movieImportObj = require('../exports/netflix/movieDetailsObj.json');

const tvKeys = Object.keys(tvImportObj)
const movieKeys = Object.keys(movieImportObj)

let editTvObj = tvImportObj 
let editMovieObj = movieImportObj
let tvDupeTracker = {}
let movieDupeTracker = {}

async function run() {
    const browser = await puppeteer.launch({ headless: false});
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();

    console.log('Getting Movie Ratings')

    // for(k=0;k<movieKeys.length;k++){
    //     let genre = movieKeys[k]
    //     let genreArr = editMovieObj[genre]
    //     let length = genreArr.length

    //     console.log('On Genre: ', genre)
    
    //     for(t=0;t<length;t++){
    //         console.log('   On Item: ', t)
    //         let title = genreArr[t]

    //         // If the title rating has already been found
    //         if (movieDupeTracker[title.href]) {
    //             // note: should do this when pulling details too
    //             let savedScore = movieDupeTracker[title.href]
    //             title.imdbScore = savedScore
    //              genreArr[t] = title
    //             console.log('   Score found and saved...')
    //             //Skip over the rest of search
    //             continue
    //         } else {
    //             console.log('   No score found, searching...')
    //         }

    //         try {
    //             await page.goto(`https://www.imdb.com/search/title/`)
    //             await page.focus('#main > div:nth-child(3) > div.inputs > input')
    //             await page.keyboard.type(title.title);
    //             await page.select('#search-view', 'simple')
    //             page.click('#main > p:nth-child(28) > button') // no await here so it doesn't race with nav
    //             await page.waitForNavigation()
    //         }
    //         catch (err) {
    //             console.log('Error on item ', t, ' : ', err)
    //         }

    //         let imdbScore = await page.evaluate(() => {
    //             let score = 0
    //             let firstItemBool = document.querySelector('#main > div > div.lister.list.detail.sub-list > div > div:nth-child(1) > div.lister-item-content > div > div.col-title > span > span:nth-child(2) > a') !== null
    //             if (firstItemBool) {
    //                 let scoreItemBool = document.querySelector('#main > div > div.lister.list.detail.sub-list > div > div:nth-child(1) > div.lister-item-content > div > div.col-imdb-rating > strong') !== null
    //                 if (scoreItemBool){
    //                     let scoreOnItem = parseFloat(document.querySelector('#main > div > div.lister.list.detail.sub-list > div > div:nth-child(1) > div.lister-item-content > div > div.col-imdb-rating > strong').innerText)
    //                     if (scoreOnItem) {
    //                         score = scoreOnItem
    //                     }
    //                 }
    //             }
    //             return score
    //         })
    //         if (imdbScore) {
    //             console.log('       Score: ', imdbScore)
    //             title.imdbScore = imdbScore.toFixed(1)
                    // movieDupeTracker[title.href] = title.imdbScore // double check this
    //         } else {
    //             console.log('       Score not available')
    //             title.imdbScore = 'N/A'
                    // movieDupeTracker[title.href] = 'N/A'
    //         }

    //         genreArr[t] = title
    //     }
    //     editMovieObj[genre] = genreArr
    // }

    // // save movie obj
    // fs.writeFile('../exports/netflix/movieRatings.json', JSON.stringify(editMovieObj), function (err) {
    //     if (err) throw err;
    //     console.log('Saved!');
    // });

    console.log('Getting Tv Ratings')

    for(k=0;k<tvKeys.length;k++){
        let genre = tvKeys[k]
        let genreArr = editTvObj[genre]
        let length = genreArr.length

        console.log('On Genre: ', genre)
    
        for(t=0;t<length;t++){
            console.log('   On Item: ', t)
            let title = genreArr[t]

            // If the title rating has already been found
            if (tvDupeTracker[title.href]) {
                // note: should do this when pulling details too
                let savedScore = tvDupeTracker[title.href]
                title.imdbScore = savedScore
                genreArr[t] = title
                console.log('   Score ', savedScore, ' found and saved...')
                //Skip over the rest of search
                continue
            } else {
                console.log('   No score found, searching...')
            }

            try {
                await page.goto(`https://www.imdb.com/search/title/`)
                await page.focus('#main > div:nth-child(3) > div.inputs > input')
                await page.keyboard.type(title.title);
                await page.select('#search-view', 'simple')
                page.click('#main > p:nth-child(28) > button')
                await page.waitForNavigation();
            }
            catch (err) {
                console.log('Error on item ', t, ' : ', err)
            }

            let imdbScore = await page.evaluate(() => {
                let score = 0
                let firstItemBool = document.querySelector('#main > div > div.lister.list.detail.sub-list > div > div:nth-child(1) > div.lister-item-content > div > div.col-title > span > span:nth-child(2) > a') !== null
                if (firstItemBool) {
                    let scoreItemBool = document.querySelector('#main > div > div.lister.list.detail.sub-list > div > div:nth-child(1) > div.lister-item-content > div > div.col-imdb-rating > strong') !== null
                    if (scoreItemBool){
                        let scoreOnItem = parseFloat(document.querySelector('#main > div > div.lister.list.detail.sub-list > div > div:nth-child(1) > div.lister-item-content > div > div.col-imdb-rating > strong').innerText)
                        if (scoreOnItem) {
                            score = scoreOnItem
                        }
                    }
                }
                return score
            })
            if (imdbScore) {
                console.log('       Score: ', imdbScore)
                title.imdbScore = imdbScore.toFixed(1)
                tvDupeTracker[title.href] = title.imdbScore
            } else {
                console.log('       Score not available')
                title.imdbScore = 'N/A'
                tvDupeTracker[title.href] = 'N/A'
            }

            genreArr[t] = title
        }
        editTvObj[genre] = genreArr
    }

    fs.writeFile('../exports/netflix/tvRatings.json', JSON.stringify(editTvObj), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

    console.log('Finished!')
    browser.close();
}

run()