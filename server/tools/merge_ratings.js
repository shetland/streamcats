const fs = require('fs')
const netflixLib = require('../scrapers/data/netflix/lib/netflix_lib.json')
const huluLib = require('../scrapers/data/hulu/lib/hulu_lib.json')

const netflixMovieRatings = require('../scrapers/data/netflix/ratings/movieRatings.json')
const netflixTvRatings = require('../scrapers/data/netflix/ratings/tvRatings.json')

const huluMovieRatings = require('../scrapers/data/hulu/ratings/movieRatings.json')
const huluTvRatings = require('../scrapers/data/hulu/ratings/tvRatings.json')

let newNetflixLib = {}
let newHuluLib = {}

// Save old lib
fs.writeFile(`../scrapers/data/netflix/lib/archive/netflix_lib_${new Date().toISOString().substring(0,19).split(':').join('-')}.json`, JSON.stringify(netflixLib), function (err) {
    if (err) throw err
    console.log('Saved!')
})

fs.writeFile(`../scrapers/data/hulu/lib/archive/hulu_lib_${new Date().toISOString().substring(0,19).split(':').join('-')}.json`, JSON.stringify(huluLib), function (err) {
    if (err) throw err
    console.log('Saved!')
})

function getRatings (libIn, objOut, mediaIn) {
  let libKeys = Object.keys(libIn)
  let libList = []

  libKeys.forEach((title) => {
    let listObj = {
      "title": libIn[title].title,
      "href": libIn[title].href,
      "id": libIn[title].id,
      "year": libIn[title].year,
      "rating": libIn[title].rating,
      "description": libIn[title].description,
      "starring": libIn[title].starring,
      "imdbScore": "N/A",
      "imdbHref": "",
      "subgenres": libIn[title].subgenres,
    }
    libList.push(listObj)
  })

  libList.forEach((title) => {
    objOut[title.id] = title
  })

  if (mediaIn === 'hulu') {
    huluMovieRatings.forEach((rating) => {
      // omg - I need to fix the rating getters to have id so this step isn't needed
      let foundObj = libList.find(obj => obj.href === rating.href)
      foundObj.imdbScore = rating.imdbScore
      foundObj.imdbHref = rating.imdbHref
      objOut[foundObj.id] = foundObj
    })
  
    huluTvRatings.forEach((rating) => {
      // omg - I need to fix the rating getters to have id so this step isn't needed
      let foundObj = libList.find(obj => obj.href === rating.href)
      foundObj.imdbScore = rating.imdbScore
      foundObj.imdbHref = rating.imdbHref
      objOut[foundObj.id] = foundObj
    })
  }

  if (mediaIn === 'netflix') {
    netflixMovieRatings.forEach((rating) => {
      // omg - I need to fix the rating getters to have id so this step isn't needed
      let foundObj = libList.find(obj => obj.href === rating.href)
      foundObj.imdbScore = rating.imdbScore
      foundObj.imdbHref = rating.imdbHref
      objOut[foundObj.id] = foundObj
    })
  
    netflixTvRatings.forEach((rating) => {
      // omg - I need to fix the rating getters to have id so this step isn't needed
      let foundObj = libList.find(obj => obj.href === rating.href)
      foundObj.imdbScore = rating.imdbScore
      foundObj.imdbHref = rating.imdbHref
      objOut[foundObj.id] = foundObj
    })
  }

  return objOut
}

newHuluLib = getRatings(huluLib, {}, 'hulu')
newNetflixLib = getRatings(netflixLib, {}, 'netflix')

console.log("Old Hulu Lib Length: ", Object.keys(huluLib).length)
console.log("New Hulu Lib Length: ", Object.keys(newHuluLib).length)
console.log("Old Netflix Lib Length: ", Object.keys(netflixLib).length)
console.log("New Netflix Lib Length: ", Object.keys(newNetflixLib).length)

fs.writeFile('../scrapers/data/hulu/lib/hulu_lib.json', JSON.stringify(newHuluLib), function (err) {
  if (err) throw err
  console.log('Hulu Saved!')
});

fs.writeFile('../scrapers/data/netflix/lib/netflix_lib.json', JSON.stringify(newNetflixLib), function (err) {
    if (err) throw err
    console.log('Netflix Saved!')
})

console.log('Finished!')