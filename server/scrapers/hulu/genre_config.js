const fs = require('fs')

const genreConfig = {
  run: () => {
    let dateStr = new Date().toISOString().substring(0,19).split(':').join('-')
    // Load new titles
    const newTitlesRaw = fs.readFileSync('../data/hulu/titles/huluTitles.json') // is obj
    const newTitles = JSON.parse(newTitlesRaw)

    // populate subgenres
    const titlesWithGenres = genreConfig.populateSubgenres(newTitles)
    const titlesWithDetails = genreConfig.populateDetails(titlesWithGenres)



    console.log('Saving...')
    try {
      // fs.writeFileSync('../data/hulu/delta/titles/deltaTitles.json', JSON.stringify(delta))
      // console.log('Movies Saved!')

      // fs.writeFileSync('../data/hulu/delta/titles/deltaTitles.json', JSON.stringify(delta))
      // console.log('Tv Saved!')

      // fs.writeFile(`../data/hulu/delta/titles/archive/deltaTitles_${dateStr}.json`, JSON.stringify(delta), function (err) {
      //   if (err) throw err
      //   console.log(' delta!')
      // })

    } catch (err) {
      console.log('Save error: ', err)
      // throw error to stop execution if not saved
      if (err) throw err
      
    }
  },
  populateDetails: (objIn) => {
    // Load lib
    const titleLibRaw = fs.readFileSync('../data/hulu/lib/hulu_lib.json')
    const titleLib = JSON.parse(titleLibRaw)
    // Load delta details
    const deltaListRaw = fs.readFileSync('../data/hulu/delta/ratings/deltaRatings.json')
    const deltaList = JSON.parse(deltaDetailsRaw)

    let deltaObj = {}

    // Convert delta list to obj
    deltaList.forEach((title) => {
      deltaObj[title.id] = title
    })


    const genreKeys = Object.keys(objIn)
    let objOut = {}

    genreKeys.forEach((genre) => {
      const genreArray = objIn[genre]
      let titleList = []
      let detailedTitle = {}
      genreArray.forEach((title) => {
      
        // find tv and push
      })
    })

    return objOut

  },
  populateSubgenres: (objIn) => {
    // get all genres in object
    let genreKeys = Object.keys(objIn)
    let objOut = {}
    // for each genre
    genreKeys.forEach((genre) => {
      let genreArray = objIn[genre]
      // for each title in the genre
      genreArray.forEach((title, index) => {
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
  },
  getTvTitles: (objIn) => {
    const genreKeys = Object.keys(objIn)
    let objOut = {}

    genreKeys.forEach((genre) => {
      const genreArray = objIn[genre]
      let titleList = []
      genreArray.forEach((title) => {
        // find tv and push
      })
    })

  },
  getMoviesTitles: (objIn) => {

  },
  filterDupes: (arrayIn) => {
    console.log('Filtering delta...')
    // Filter out any duplicates by id
    const filteredArray = arrayIn.filter((item, index, self) =>
      index === self.findIndex((t) => (
        t.id === item.id
      ))
    )
    return filteredArray
  },
  // only needed temp
  repairIds: (objIn) => {
    
  }
}

module.exports = genreConfig



















//====================================================








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

fs.writeFile('../exports/hulu/finalTv.json', JSON.stringify(tvSubPop), function (err) {
    if (err) throw err
    console.log('Saved!')
})

fs.writeFile('../exports/hulu/finalMovie.json', JSON.stringify(movieSubPop), function (err) {
    if (err) throw err
    console.log('Saved!')
});

console.log('Finished!')
