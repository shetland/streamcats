const puppeteer = require('puppeteer-core')
const fs = require('fs')

const tvImportObj = require('../data/netflix/details/tvData.json')
const movieImportObj = require('../data/netflix/details/movieData.json')
const currentTvList = require('../data/netflix/ratings/tvRatings.json')
const currentMovieList = require('../data/netflix/ratings/movieRatings.json')

// save old ratings
fs.writeFile('../data/netflix/ratings/tvRatings_old.json', JSON.stringify(currentTvList), function (err) {
    if (err) throw err;
    console.log('Saved Old Ratings!');
});

// save old ratings
fs.writeFile('../data/netflix/ratings/movieRatings_old.json', JSON.stringify(currentMovieList), function (err) {
    if (err) throw err;
    console.log('Saved Old Ratings!');
});

const tvKeys = Object.keys(tvImportObj)
const movieKeys = Object.keys(movieImportObj)

let editTvObj = tvImportObj 
let editMovieObj = movieImportObj
// let tvDupeTracker = {}
// let movieDupeTracker = {}
let movieIssueList = []
let tvIssueList = []

let movieErrors = []
let tvErrors = []

async function run() {
    const browser = await puppeteer.launch({ headless: false, executablePath:'/usr/bin/chromium-browser'})
    // args:['--start-maximized']
    const page = await browser.newPage()

    await page.setViewport({
        width: 800,
        height: 800
    })

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

            if ( !currentMovieList.some((ct) => { return ct.href === title.href }) ) {

                try {
                    let titleName = title.title
                    let searchName = titleName.replace(/ *\([^)]*\) */g, "");
                    let searchStr = searchName + ' (' + title.year + ') ' + 'movie' + ' imdb' 
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
                        let link = 'https://duckduckgo.com/'
                        let found = document.querySelector('#r1-0 > div > h2 > a.result__a').href
                        if (found) {
                            link = found
                        }
                        return link
                    })

                    page.goto(imdbLink, {waitUntil:'domcontentloaded'})
                    await page.waitFor(3000)

                    let imdbTitle = await page.evaluate(() => {
                        let str = ''
                        let found = document.querySelector('#title-overview-widget > div.vital > div.title_block > div > div.titleBar > div.title_wrapper > h1').innerText
                        if (found) {
                            str = found
                        }
                        return str
                    })

                    let imdbScore = await page.evaluate(() => {
                        let score = 0
                        let scoreText = document.querySelector('span[itemprop="ratingValue"]').innerText
                        let scoreOnItem = parseFloat(scoreText)
                        if (scoreOnItem) {
                            score = scoreOnItem
                        }
                        return score
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
                        // tvDupeTracker[title.href] = title.imdbScore
                    } else {
                        console.log('       Score not available')
                        title.imdbScore = 'N/A'
                        // tvDupeTracker[title.href] = 'N/A'
                    }

                    title.imdbHref = imdbLink
                    // title.imdbDesc = imdbDesc
                    genreArr[t] = title

                    let newRating = {"title": title.title, "href": title.href, "imdbHref": title.imdbHref, "imdbScore": title.imdbScore}

                    currentMovieList.push(newRating)
                    fs.writeFile('../data/netflix/ratings/movieRatings.json', JSON.stringify(currentMovieList), function (err) {
                        if (err) throw err;
                        console.log('Saved Rating!');
                    });


                    await page.waitFor(1000)
                } catch (err) {
                    movieErrors.push({ "title": title.title, "href": title.href, "year": title.year })
                    console.log('Error on: ', title.title)
                    fs.writeFile('../data/netflix/ratings/movieErrors.json', JSON.stringify(movieErrors), function (err) {
                        if (err) throw err;
                        console.log('Saved Error!');
                    });
                }
            } else {
                console.log('already have rating... skipping')
                // could plug the existing rating into the movie obj here
            }

        }

   // save issue list
    fs.writeFile('../data/netflix/ratings/movieIssueList.json', JSON.stringify(movieIssueList), function (err) {
        if (err) throw err;
        console.log('Saved Potential Issues!');
    });

        // editMovieObj[genre] = genreArr
        // // save running movie obj
        // fs.writeFile('../data/netflix/ratings/movieData_running.json', JSON.stringify(editMovieObj), function (err) {
        //     if (err) throw err;
        //     console.log('Saved!');
        // });
    }

 

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

            if ( !currentTvList.some((ct) => { return ct.href === title.href }) ) {

                try {
                    let titleName = title.title
                    let searchName = titleName.replace(/ *\([^)]*\) */g, "");
                    let searchStr = searchName + ' (' + title.year + ') ' + 'tv' + ' imdb' 
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
                        let link = 'https://duckduckgo.com/'
                        let found = document.querySelector('#r1-0 > div > h2 > a.result__a').href
                        if (found) {
                            link = found
                        }
                        return link
                    })

                    page.goto(imdbLink, {waitUntil:'domcontentloaded'})
                    await page.waitFor(3000)

                    let imdbTitle = await page.evaluate(() => {
                        let str = ''
                        let found = document.querySelector('#title-overview-widget > div.vital > div.title_block > div > div.titleBar > div.title_wrapper > h1').innerText
                        if (found) {
                            str = found
                        }
                        return str
                    })

                    let imdbScore = await page.evaluate(() => {
                        let score = 0
                        let scoreText = document.querySelector('span[itemprop="ratingValue"]').innerText
                        let scoreOnItem = parseFloat(scoreText)
                        if (scoreOnItem) {
                            score = scoreOnItem
                        }
                        return score
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
                        // tvDupeTracker[title.href] = title.imdbScore
                    } else {
                        console.log('       Score not available')
                        title.imdbScore = 'N/A'
                        // tvDupeTracker[title.href] = 'N/A'
                    }

                    title.imdbHref = imdbLink
                    // title.imdbDesc = imdbDesc
                    genreArr[t] = title
                    let newRating = {"title": title.title, "href": title.href, "imdbHref": title.imdbHref, "imdbScore": title.imdbScore}

                    currentTvList.push(newRating)
                    fs.writeFile('../data/netflix/ratings/tvRatings.json', JSON.stringify(currentTvList), function (err) {
                        if (err) throw err;
                        console.log('Saved Rating!');
                    });

                    await page.waitFor(1000)
                } catch (err) {
                    tvErrors.push({ "title": title.title, "href": title.href, "year": title.year })
                    console.log('Error on: ', title.title)
                    fs.writeFile('../data/netflix/ratings/tvErrors.json', JSON.stringify(tvErrors), function (err) {
                        if (err) throw err;
                        console.log('Saved!');
                    });
                }
            } else {
                console.log('already have rating... skipping')
                // could plug the existing rating into the movie obj here
            }
        }

        // save issue list
        fs.writeFile('../data/netflix/ratings/tvIssueList.json', JSON.stringify(tvIssueList), function (err) {
            if (err) throw err;
            console.log('Saved Potential Tv Issues!');
        });

        // editTvObj[genre] = genreArr
        // // save running tv obj
        // fs.writeFile('../data/netflix/ratings/tvData_running.json', JSON.stringify(editTvObj), function (err) {
        //     if (err) throw err;
        //     console.log('Saved!');
        // });
    }

    // // save movie obj
    // fs.writeFile('../data/netflix/ratings/tvData.json', JSON.stringify(editTvObj), function (err) {
    //     if (err) throw err;
    //     console.log('Saved!');
    // });

    console.log('Finished!')
    browser.close();
}

run()
