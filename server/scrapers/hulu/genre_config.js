const fs = require('fs')

const libUpdate = {
  run: () => {
    let dateStr = new Date().toISOString().substring(0,19).split(':').join('-')
    // Load new titles
    const newTitlesRaw = fs.readFileSync('../data/hulu/titles/huluTitles.json') // is obj
    const newTitles = JSON.parse(newTitlesRaw)

    // populate subgenres
    const titlesWithGenres = libUpdate.populateSubgenres(newTitles)
    // update lib
    const updatedLib = libUpdate.updateLib(titlesWithGenres)
    // populate lib
    // const titlesWithDetails = libUpdate.populateDetails(titlesWithGenres, updatedLib)

// https://www.hulu.com/series/bloodc-7a62775e-f14f-4503-8268-42d9f667b393

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
        let titleId = title.id
        let subgenreList = []
        
        genreKeys.forEach((check) => {
          // if the current genrecheck array contains a title with the same link
          if ( objIn[check].some(obj => obj.id === titleId) ){
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
  updateLib: (objIn) => {
    // Load lib
    const libRaw = fs.readFileSync('../data/hulu/lib/hulu_lib.json')
    const lib = JSON.parse(libRaw) // is obj
    // Load delta details
    const deltaListRaw = fs.readFileSync('../data/hulu/delta/ratings/deltaRatings.json')
    const deltaList = JSON.parse(deltaListRaw) // is list
    const genreKeys = Object.keys(objIn)
    let libOut = {}
    let deltaObj = {}
    let deltaObjGenres = {}
    // Convert delta to obj
    deltaList.forEach((title) => {
      deltaObj[title.id] = title
    })
    // Update delta object with genres
    genreKeys.forEach((genre) => {
      const genreArray = objIn[genre]
      genreArray.forEach((title) => {
        // if the title is in the delta obj and has year detail (is still in hulu cat)...
        if (deltaObj[title.id] && deltaObj[title.id].year) {
          // save into new obj with subgenres
          deltaObjGenres[title.id] = deltaObj[title.id]
          deltaObjGenres[title.id].subgenres = title.subgenres
        }

      })
    })
    // Combine the old lib and delta
    libOut = {
      ...lib,
      ...deltaObjGenres
    }
    console.log('Old lib has:\t', Object.keys(lib).length, ' titles...')
    console.log('Delta lib has:\t', Object.keys(deltaObjGenres).length, ' titles...')
    console.log('New lib has:\t', Object.keys(libOut).length, ' titles...')
    // test write file
    fs.writeFile(`testDelta_save.json`, JSON.stringify(deltaObjGenres), function (err) {
      if (err) throw err
      console.log(' delta!')
    })

    return libOut
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

module.exports = libUpdate



















//====================================================








// // FIND AND ADD ALL SUBGENRES
// function populateSubgenres (objIn) {
//     // get all genres in object
//     let genreKeys = Object.keys(objIn)
//     let objOut = {}

//     // for each genre
//     genreKeys.forEach((genre) => {
//         // make another key array that doesn't include the current genre
//         // let checkArray = genreKeys.filter(current => current !== genre)
//         let genreArray = objIn[genre]

//         // for each title in the genre
//         genreArray.forEach((title, index) => {
//             let titleLink = title.href
//             let subgenreList = []
            
//             genreKeys.forEach((check) => {
//                 // if the current genrecheck array contains a title with the same link
//                 if ( objIn[check].some(obj => obj.href === titleLink) ){
//                     subgenreList.push(check)
//                 }
//             })
//             // push subgenre list into title
//             title['subgenres'] = subgenreList
//             // updated the title at the current index
//             genreArray[index] = title
//         })
//         // update object in with the new array
//         objOut[genre] = genreArray
//     })
//     return objOut
// }

// // GET ARRAY SUBGENRES
// function getAllArraySubs (arrayIn) {
//     let allSubs = {}
//     arrayIn.forEach((title)=> {
//         title.subgenres.forEach(genre => {
//             allSubs[genre] = true
//         })
//     })
//     return Object.keys(allSubs)
// }

// // FILTER BY SUBGENRE LIST FUNCTION
// function filterBySubList (arrayIn, argsIn) {
//     let returnedArray = []
//     let arrayLength = arrayIn.length

//     for(t=0;t<arrayLength;t++){
//         let subgenreArray = arrayIn[t].subgenres
//         let include = true

//         // for each filter word passed into func
//         for(f=0;f<argsIn.length;f++) {
//             // check if the title's sub list contains the filter word
//             if (subgenreArray.includes(argsIn[f])) {
//                 // if any matches - break with false flag
//                 include = false
//                 break
//             }
//         }
//         // if the title is to be included
//         if (include) {
//             returnedArray.push(arrayIn[t])
//         }
//     }
//     return returnedArray
// }

// let tvSubPop = populateSubgenres(importTvObj)
// let movieSubPop = populateSubgenres(importMovieObj)
// // let filtered = filterBySubList(tvSubPop['Action'], [])

// fs.writeFile('../exports/hulu/finalTv.json', JSON.stringify(tvSubPop), function (err) {
//     if (err) throw err
//     console.log('Saved!')
// })

// fs.writeFile('../exports/hulu/finalMovie.json', JSON.stringify(movieSubPop), function (err) {
//     if (err) throw err
//     console.log('Saved!')
// });

// console.log('Finished!')
