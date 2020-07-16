const puppeteer = require('puppeteer')
const fs = require('fs')

const tvImportObj = require('../data/netflix/details/tvData.json')
const movieImportObj = require('../data/netflix/details/movieData.json')

const tvKeys = Object.keys(tvImportObj)
const movieKeys = Object.keys(movieImportObj)

let editTvObj = tvImportObj 
let editMovieObj = movieImportObj
let tvDupeTracker = {}
// let movieDupeTracker = {}
let movieIssueList = []
let tvIssueList = []

async function run() {
    const browser = await puppeteer.launch({ headless: false});
    // const context = await browser.createIncognitoBrowserContext();
    const page = await browser.newPage();

    //movieKeys.length
    for(k=0;k<movieKeys.length;k++){
        let genre = movieKeys[k]
        let genreArr = editMovieObj[genre]
        let length = genreArr.length

        console.log('On Genre: ', genre)
        //length
        for(t=0;t<length;t++){
            console.log('   On Item: ', t)
            let checkObj = {}
            let title = genreArr[t]
            try {
                let titleName = title.title
                let searchName = titleName.replace(/ *\([^)]*\) */g, "");
                let searchStr = searchName + ' ' + title.year + ' ' + 'movie ' + 'imdb.com'
                let searchNameLC = searchName.toLowerCase()
                let searchNameRegex = new RegExp(searchNameLC, 'g')

                // // If the title rating has already been found
                // if (movieDupeTracker[title.href]) {
                //     // note: should do this when pulling details too
                //     let savedTitle = movieDupeTracker[title.href]
                //     title.imdbScore = savedTitle.imdbScore

                //     //Skip over the rest of search
                //     continue
                // } else {
                //     console.log('   No score found, searching...')
                // }

                await page.goto(`https://www.google.com`)
                await page.focus('#tsf > div:nth-child(2) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input')
                await page.keyboard.type(searchStr)
                await page.waitFor(1000)
                await page.keyboard.press('Enter')
                await page.waitForNavigation()
                await page.waitFor(1000)

                let imdbLink = await page.evaluate(() => {
                    let link = 'https://www.google.com'
                    let found = document.querySelector('#rso > div:nth-child(1) > div > div.r > a').href
                    if (found) {
                        link = found
                    }
                    return link
                })
                let imdbTitle = await page.evaluate(() => {
                    let str = ''
                    let found = document.querySelector('#rso > div:nth-child(1) > div > div.r > a > h3').innerText
                    if (found) {
                        str = found
                    }
                    return str
                })

                await page.goto(imdbLink)

                let imdbScore = await page.evaluate(() => {
                    let score = 0
                    let scoreText = document.querySelector('span[itemprop="ratingValue"]').innerText
                    let scoreOnItem = parseFloat(scoreText)
                    if (scoreOnItem) {
                        score = scoreOnItem
                    }
                    return score
                })

                let imdbDesc = await page.evaluate(() => {
                    let str = ''
                    let found = document.querySelector('div.summary_text').innerText
                    if (found) {
                        str = found.trim(' ')
                    }
                    return str
                })

                let checkTitle = imdbTitle.toLowerCase()

                if(checkTitle.match(searchNameRegex)) {
                    console.log('Found: ', imdbTitle, ' Matches: ', searchName)
                } else {
                    console.log(imdbTitle, ' does NOT match: ', searchName)
                    checkObj.name = title.title
                    checkObj.href = title.href
                    checkObj.imdbTitle = imdbTitle
                    checkObj.imdbHref = imdbLink
                    movieIssueList.push(checkObj)
                }

                if (imdbScore) {
                    console.log('       Score: ', imdbScore)
                    title.imdbScore = imdbScore.toFixed(1)
                    tvDupeTracker[title.href] = title.imdbScore
                } else {
                    console.log('       Score not available')
                    title.imdbScore = 'N/A'
                    tvDupeTracker[title.href] = 'N/A'
                }

                title.imdbHref = imdbLink
                title.imdbDesc = imdbDesc
                genreArr[t] = title

                await page.waitFor(2000)
            } catch (err) {
                console.log('Error on: ', title.title, ' : ', err)
            }

        }
        editMovieObj[genre] = genreArr
    }

    // console.log ('Potential issues: ', movieIssueList)

    // save movie obj
    fs.writeFile('../data/netflix/ratings/movieData.json', JSON.stringify(editMovieObj), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

    // save issue list
    fs.writeFile('../data/netflix/ratings/movieIssueList.json', JSON.stringify(movieIssueList), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

    // Get Tv Ratings:
    for(k=0;k<tvKeys.length;k++){
        let genre = tvKeys[k]
        let genreArr = editTvObj[genre]
        let length = genreArr.length

        console.log('On Genre: ', genre)
        //length
        for(t=0;t<length;t++){
            console.log('   On Item: ', t)
            let checkObj = {}
            let title = genreArr[t]
            try {
                let titleName = title.title
                let searchName = titleName.replace(/ *\([^)]*\) */g, "");
                let searchStr = searchName + ' ' + title.year + ' ' + 'tv ' + 'imdb.com'
                let searchNameLC = searchName.toLowerCase()
                let searchNameRegex = new RegExp(searchNameLC, 'g')

                // // If the title rating has already been found
                // if (movieDupeTracker[title.href]) {
                //     // note: should do this when pulling details too
                //     let savedTitle = movieDupeTracker[title.href]
                //     title.imdbScore = savedTitle.imdbScore

                //     //Skip over the rest of search
                //     continue
                // } else {
                //     console.log('   No score found, searching...')
                // }

                await page.goto(`https://www.google.com`)
                await page.focus('#tsf > div:nth-child(2) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input')
                await page.keyboard.type(searchStr)
                await page.waitFor(1000)
                await page.keyboard.press('Enter')
                await page.waitForNavigation()
                await page.waitFor(1000)

                let imdbLink = await page.evaluate(() => {
                    let link = 'https://www.google.com'
                    let found = document.querySelector('#rso > div:nth-child(1) > div > div.r > a').href
                    if (found) {
                        link = found
                    }
                    return link
                })
                let imdbTitle = await page.evaluate(() => {
                    let str = ''
                    let found = document.querySelector('#rso > div:nth-child(1) > div > div.r > a > h3').innerText
                    if (found) {
                        str = found
                    }
                    return str
                })

                await page.goto(imdbLink)

                let imdbScore = await page.evaluate(() => {
                    let score = 0
                    let scoreText = document.querySelector('span[itemprop="ratingValue"]').innerText
                    let scoreOnItem = parseFloat(scoreText)
                    if (scoreOnItem) {
                        score = scoreOnItem
                    }
                    return score
                })

                let imdbDesc = await page.evaluate(() => {
                    let str = ''
                    let found = document.querySelector('div.summary_text').innerText
                    if (found) {
                        str = found.trim(' ')
                    }
                    return str
                })

                let checkTitle = imdbTitle.toLowerCase()

                if(checkTitle.match(searchNameRegex)) {
                    console.log('Found: ', imdbTitle, ' Matches: ', searchName)
                } else {
                    console.log(imdbTitle, ' does NOT match: ', searchName)
                    checkObj.name = title.title
                    checkObj.href = title.href
                    checkObj.imdbTitle = imdbTitle
                    checkObj.imdbHref = imdbLink
                    tvIssueList.push(checkObj)
                }

                if (imdbScore) {
                    console.log('       Score: ', imdbScore)
                    title.imdbScore = imdbScore.toFixed(1)
                    tvDupeTracker[title.href] = title.imdbScore
                } else {
                    console.log('       Score not available')
                    title.imdbScore = 'N/A'
                    tvDupeTracker[title.href] = 'N/A'
                }

                title.imdbHref = imdbLink
                title.imdbDesc = imdbDesc
                genreArr[t] = title

                await page.waitFor(2000)
            } catch (err) {
                console.log('Error on: ', title.title, ' : ', err)
            }

        }
        editTvObj[genre] = genreArr
    }

    // console.log ('Potential issues: ', tvIssueList)

    // save movie obj
    fs.writeFile('../data/netflix/ratings/tvData.json', JSON.stringify(editTvObj), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

    // save issue list
    fs.writeFile('../data/netflix/ratings/tvIssueList.json', JSON.stringify(tvIssueList), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });


    console.log('Finished!')
    browser.close();
}

run()