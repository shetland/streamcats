const fs = require('fs')
const netflixMovieObj = require('../data/netflix/details/finalMovie.json')
const netflixTvObj = require('../data/netflix/details/finalTv.json')
const huluMovieObj = require('../data/hulu/details/finalMovie.json')
const huluTvObj = require('../data/hulu/details/finalTv.json')

let netflixMovieLib = {}
let huluMovieLib = {}
let netflixTvLib = {}
let huluTvLib = {}

// FIND AND ADD ALL SUBGENRES
function extractTitles (objIn, objOut) {
    let genreKeys = Object.keys(objIn)

    genreKeys.forEach((genre) => {
        let genreArray = objIn[genre]
        genreArray.forEach((title, index) => {

          let titleId = title.id
          if (!objOut[titleId]) {
            objOut[titleId] = title
          }

        })
    })
    return objOut
}

netflixMovieLib = extractTitles(netflixMovieObj, {})
netflixTvLib = extractTitles(netflixTvObj, {})

huluMovieLib = extractTitles(huluMovieObj, {})
huluTvLib = extractTitles(huluTvObj, {})

let netflixLib = {
  ...netflixMovieLib,
  ...netflixTvLib
}

let huluLib = {
  ...huluMovieLib,
  ...huluTvLib
}

console.log("Found: ", Object.keys(netflixLib).length, " unique Netflix titles.")
console.log("Found: ", Object.keys(huluLib).length, " unique Hulu titles.")

// fs.writeFile('../data/netflix/lib/netflix_lib.json', JSON.stringify(netflixLib), function (err) {
//     if (err) throw err
//     console.log('Saved!')
// })

// fs.writeFile('../data/hulu/lib/hulu_lib.json', JSON.stringify(huluLib), function (err) {
//     if (err) throw err
//     console.log('Saved!')
// });

console.log('Finished!')