const fs = require('fs')

// const netflixMovieRating = require('../data/netflix/ratings/movieRatings.json')
// const netflixTvRatings = require('../data/netflix/ratings/tvRatings.json')

const huluTvRatings = require('../data/hulu/ratings/tvRatings.json')
const huluMovieRatings = require('../data/hulu/ratings/movieRatings.json')
const newHuluMovieRatings = require('../data_temp/hulu/ratings/movieRatings.json')
const newHuluTvRatings = require('../data_temp/hulu/ratings/tvRatings.json')

// let newNetflixLib = {}
let newHuluLib = {}



// // Save old lib
// fs.writeFile(`../data/netflix/lib/netflix_lib_${new Date().toISOString().substring(0,19).split(':').join('-')}.json`, JSON.stringify(netflixLib), function (err) {
//     if (err) throw err
//     console.log('Saved!')
// })

// save old ratings
fs.writeFile(`../data/hulu/ratings/tvRatings${new Date().toISOString().substring(0,19).split(':').join('-')}.json`, JSON.stringify(huluTvRatings), function (err) {
    if (err) throw err
    console.log('Saved!')
})

fs.writeFile(`../data/hulu/ratings/movieRatings${new Date().toISOString().substring(0,19).split(':').join('-')}.json`, JSON.stringify(huluMovieRatings), function (err) {
  if (err) throw err
  console.log('Saved!')
})

console.log('Hulu Tv titles before merge: ', huluTvRatings.length)
console.log('Hulu Movie titles before merge: ', huluMovieRatings.length)

newHuluMovieRatings.forEach((rating) => {
  // omg - I need to fix the rating getters to have id so this step isn't needed
  let foundObj = libList.find(obj => obj.href === rating.href)
  foundObj.imdbScore = rating.imdbScore
  foundObj.imdbHref = rating.imdbHref
  objOut[foundObj.id] = foundObj
})

newHuluTvRatings.forEach((rating) => {
  // omg - I need to fix the rating getters to have id so this step isn't needed
  let foundObj = libList.find(obj => obj.href === rating.href)
  foundObj.imdbScore = rating.imdbScore
  foundObj.imdbHref = rating.imdbHref
  objOut[foundObj.id] = foundObj
})

// function getRatings (libIn, objOut) {
//   let libKeys = Object.keys(libIn)
//   let libList = []

//   libKeys.forEach((title) => {
//     let listObj = {
//       "title": libIn[title].title,
//       "href": libIn[title].href,
//       "id": libIn[title].id,
//       "year": libIn[title].year,
//       "rating": libIn[title].rating,
//       "description": libIn[title].description,
//       "starring": libIn[title].starring,
//       "imdbScore": "N/A",
//       "imdbHref": "",
//       "subgenres": libIn[title].subgenres,
//     }
//     libList.push(listObj)
//   })

//   libList.forEach((title) => {
//     objOut[title.id] = title
//   })

//   huluMovieRatings.forEach((rating) => {
//     // omg - I need to fix the rating getters to have id so this step isn't needed
//     let foundObj = libList.find(obj => obj.href === rating.href)
//     foundObj.imdbScore = rating.imdbScore
//     foundObj.imdbHref = rating.imdbHref
//     objOut[foundObj.id] = foundObj
//   })

//   huluTvRatings.forEach((rating) => {
//     // omg - I need to fix the rating getters to have id so this step isn't needed
//     let foundObj = libList.find(obj => obj.href === rating.href)
//     foundObj.imdbScore = rating.imdbScore
//     foundObj.imdbHref = rating.imdbHref
//     objOut[foundObj.id] = foundObj
//   })

//   return objOut
// }

// newHuluLib = getRatings(huluLib, {})

// console.log("New Hulu Lib Length: ", Object.keys(huluLib).length)
// console.log("New Hulu Lib Length: ", Object.keys(newHuluLib).length)


// fs.writeFile('../data/netflix/lib/netflix_lib.json', JSON.stringify(netflixLib), function (err) {
//     if (err) throw err
//     console.log('Saved!')
// })

fs.writeFile('../data/hulu/lib/hulu_lib.json', JSON.stringify(newHuluLib), function (err) {
    if (err) throw err
    console.log('Saved!')
});

console.log('Finished!')