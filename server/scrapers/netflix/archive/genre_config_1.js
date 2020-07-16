const fs = require('fs')
const importMovieObj = require('../exports/netflix/movieRatings.json')
const importTvObj = require('../exports/netflix/tvRatings.json')

// FIND AND ADD ALL SUBGENRES
function populateSubgenres (objIn) {
    // get all genres in object
    let genreKeys = Object.keys(objIn)
    let objOut = {}

    // for each genre
    genreKeys.forEach((genre) => {
        // make another key array that doesn't include the current genre
        // let checkArray = genreKeys.filter(current => current !== genre)
        let genreArray = objIn[genre]

        // for each title in the genre
        genreArray.forEach((title, index) => {
            delete title['genres'] // just quick fix here
            let titleLink = title.href
            let subgenreList = []
            
            genreKeys.forEach((check) => {
                // if the current genrecheck array contains a title with the same link
                if ( objIn[check].some(obj => obj.href === titleLink) ){
                    subgenreList.push(check)
                }
            })
            // push subgenre list into title
            title['subgenres'] = subgenreList
            // updated the title at the current index
            genreArray[index] = title
        })
        // update object in with the new array
        objOut[genre] = genreArray
    })
    return objOut
}

// GET ARRAY SUBGENRES
function getAllArraySubs (arrayIn) {
    let allSubs = {}
    arrayIn.forEach((title)=> {
        title.subgenres.forEach(genre => {
            allSubs[genre] = true
        })
    })
    return Object.keys(allSubs)
}

// FILTER BY SUBGENRE LIST FUNCTION
function filterBySubList (arrayIn, argsIn) {
    let returnedArray = []
    let arrayLength = arrayIn.length

    for(t=0;t<arrayLength;t++){
        let subgenreArray = arrayIn[t].subgenres
        let include = true

        // for each filter word passed into func
        for(f=0;f<argsIn.length;f++) {
            // check if the title's sub list contains the filter word
            if (subgenreArray.includes(argsIn[f])) {
                // if any matches - break with false flag
                include = false
                break
            }
        }
        // if the title is to be included
        if (include) {
            returnedArray.push(arrayIn[t])
        }
    }
    return returnedArray
}

let tvSubPop = populateSubgenres(importTvObj)
let movieSubPop = populateSubgenres(importMovieObj)
// let filtered = filterBySubList(tvSubPop['Action'], [])

fs.writeFile('../exports/netflix/finalTv.json', JSON.stringify(tvSubPop), function (err) {
    if (err) throw err
    console.log('Saved!')
})

fs.writeFile('../exports/netflix/finalMovie.json', JSON.stringify(movieSubPop), function (err) {
    if (err) throw err
    console.log('Saved!')
});

console.log('Finished!')
