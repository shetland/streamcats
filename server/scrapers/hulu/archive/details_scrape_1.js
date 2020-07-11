const puppeteer = require('puppeteer');
const fs = require('fs');
const tvImportObj = require('../exports/raw_scrape/hulu/filteredTv.json');
const movieImportObj = require('../exports/raw_scrape/hulu/filteredMovie.json');

const tvKeys = Object.keys(tvImportObj)
const movieKeys = Object.keys(movieImportObj)

async function run() {
    const browser = await puppeteer.launch({ headless: false});
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    
    await page.setViewport({
        width: 300,
        height: 800
    });

    let exportTvObj = {}
    let exportMovieObj = {}

    for (c=0;c<tvKeys.length;c++) { 
        let currentGenre = tvKeys[c]
        let currentArray = tvImportObj[currentGenre]
        let currentLength = currentArray.length
        console.log('On Tv Genre: ', currentGenre)

        // For every item in the genre list
        for (i=0;i<currentLength;i++) {
            await page.goto(`${currentArray[i].href}`);
            console.log('   On item: ', i)
            let regex = /(?<=series\/).*/
            let id = currentArray[i].href.match(regex)[0]
            currentArray[i].id = id

            // Set random page wait time from 1-2 seconds
            let pageWait = Math.floor(Math.random() * 2) + 1;
            await page.waitFor(pageWait*1000);

            // await page.screenshot({ path: imagePath, type: 'jpeg', quality: 20, clip:{x:0,y:0,width:275,height:145}})
 
            let newObject = await page.evaluate(() => {
                let header = ''
                let rating = ''
                let genreList = ''
                let year = ''
                let headerBool = document.querySelector(`#description-modal > div.jsx-3640661505.description-modal.modal-dialog.modal > div.jsx-3640661505.modal--body > div > div`) !== null
                if (headerBool){
                    header = document.querySelector(`#description-modal > div.jsx-3640661505.description-modal.modal-dialog.modal > div.jsx-3640661505.modal--body > div > div`).innerText
                }
                if (header) {
                    header = header.replace(/\s/g, '')
                    let headerArr = header.split('•')
                    rating = headerArr[0]
                    genreList = headerArr[1].split(',')
                    year = headerArr[headerArr.length-1]
                }
                let description = ''
                let descriptionBool = document.querySelector(`#description-modal > div.jsx-3640661505.description-modal.modal-dialog.modal > div.jsx-3640661505.modal--body > div > p`) !== null
                if (descriptionBool){
                    description = document.querySelector(`#description-modal > div.jsx-3640661505.description-modal.modal-dialog.modal > div.jsx-3640661505.modal--body > div > p`).innerText
                }

                let starring = ''
                // let starringBool = document.querySelector(`div.title-data-info-item:nth-child(1) > span:nth-child(2)`) !== null
                // if (starringBool){
                //     starring = document.querySelector(`div.title-data-info-item:nth-child(1) > span:nth-child(2)`).innerText
                // }
                let duration = ''
                // let durationBool = document.querySelector(`.duration`) !== null
                // if (durationBool){
                //     duration = document.querySelector(`.duration`).innerText;
                // }

                return {
                    'year': year,
                    'rating': rating,
                    'description': description,
                    'starring': starring,
                    'duration': duration,
                    'genres': genreList
                }

            });

            currentArray[i] = Object.assign(currentArray[i], newObject)
        }
        // after the current array has been updated with the right details - save into the export object:
        exportTvObj[currentGenre] = currentArray
    }

    // Save out the tv data
    fs.writeFile('../../data/hulu/tv/tvData.json', JSON.stringify(exportTvObj), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

    // movieKeys.length - shortened for test
    for (c=0;c<movieKeys.length;c++) { 
        let currentGenre = movieKeys[c]
        let currentArray = movieImportObj[currentGenre]
        let currentLength = currentArray.length
        console.log('On Movie Genre: ', currentGenre)

        // For every item in the genre list
        for (i=0;i<currentLength;i++) {
            await page.goto(`${currentArray[i].href}`);
            console.log('   On item: ', i)
            let regex = /(?<=movie\/).*/
            let id = currentArray[i].href.match(regex)[0]
            currentArray[i].id = id

            // No images for faster loading times but may consider in future
            // let imagePath = `../../public/thumbnails/hulu/movie/${id}.jpg`
            // let imageSrc = `/thumbnails/hulu/tv/${id}.jpg`
            // currentArray[i].imageSrc = imageSrc

            let pageWait = Math.floor(Math.random() * 2) + 1;
            await page.waitFor(pageWait*1000);
            //await page.screenshot({ path: imagePath, type: 'jpeg', quality: 20, clip:{x:0,y:0,width:275,height:145}})
 
            let newObject = await page.evaluate(() => {
                let header = ''
                let rating = ''
                let genreList = ''
                let year = ''
                let headerBool = document.querySelector(`#description-modal > div.jsx-3640661505.description-modal.modal-dialog.modal > div.jsx-3640661505.modal--body > div > div`) !== null
                if (headerBool){
                    header = document.querySelector(`#description-modal > div.jsx-3640661505.description-modal.modal-dialog.modal > div.jsx-3640661505.modal--body > div > div`).innerText
                }
                if (header) {
                    header = header.replace(/\s/g, '')
                    let headerArr = header.split('•')
                    rating = headerArr[0]
                    genreList = headerArr[1].split(',')
                    year = headerArr[headerArr.length-1]
                }
                let description = ''
                let descriptionBool = document.querySelector(`#description-modal > div.jsx-3640661505.description-modal.modal-dialog.modal > div.jsx-3640661505.modal--body > div > p`) !== null
                if (descriptionBool){
                    description = document.querySelector(`#description-modal > div.jsx-3640661505.description-modal.modal-dialog.modal > div.jsx-3640661505.modal--body > div > p`).innerText
                }

                let starring = ''
                // let starringBool = document.querySelector(`div.title-data-info-item:nth-child(1) > span:nth-child(2)`) !== null
                // if (starringBool){
                //     starring = document.querySelector(`div.title-data-info-item:nth-child(1) > span:nth-child(2)`).innerText
                // }
                let duration = ''
                // let durationBool = document.querySelector(`.duration`) !== null
                // if (durationBool){
                //     duration = document.querySelector(`.duration`).innerText;
                // }

                return {
                    'year': year,
                    'rating': rating,
                    'description': description,
                    'starring': starring,
                    'duration': duration,
                    'genres': genreList
                }

            });

            currentArray[i] = Object.assign(currentArray[i], newObject)
            await page.waitFor(1*1000);
        }
        // after the current array has been updated with the right details - save into the export object:
        exportMovieObj[currentGenre] = currentArray
    }

    // Save out the movie data
    fs.writeFile('../../data/hulu/movie/movieData.json', JSON.stringify(exportMovieObj), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

    browser.close();
    console.log('finished');
}

run();