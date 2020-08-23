const fs = require('fs')
const { title } = require('process')

const libUpdate = {
  run: () => {
    const dateStr = new Date().toISOString().substring(0,19).split(':').join('-')
    // Load new titles
    const movieObjRaw = fs.readFileSync('../data/hulu/titles/movieTitles.json') // is obj
    const movieObj = JSON.parse(movieObjRaw)

    const tvObjRaw = fs.readFileSync('../data/hulu/titles/tvTitles.json') // is obj
    const tvObj = JSON.parse(tvObjRaw)

    // Populate subgenres
    const moviesWithGenres = libUpdate.populateSubgenres(movieObj)
    const tvWithGenres = libUpdate.populateSubgenres(tvObj)

    // Update lib
    const updatedLib = libUpdate.updateLib(moviesWithGenres, tvWithGenres, dateStr)

    // Populate details
    const movieTitles = libUpdate.populateDetails(moviesWithGenres, updatedLib, 'movie')
    const tvTitles = libUpdate.populateDetails(tvWithGenres, updatedLib, 'tv')

    console.log('Saving...')
    try {
      fs.writeFileSync('../data/hulu/current/movieData.json', JSON.stringify(movieTitles))
      console.log('Movie data saved!')

      fs.writeFileSync('../data/hulu/current/tvData.json', JSON.stringify(tvTitles))
      console.log('Tv data saved!')

      fs.writeFileSync('../data/hulu/lib/hulu_lib.json', JSON.stringify(updatedLib))
      console.log('Library updated!')

      // Archive tv and movie data
      fs.writeFile(`../data/hulu/current/archive/movieData_${dateStr}.json`, JSON.stringify(movieTitles), function (err) {
        if (err) throw err
        console.log('Archived movie data!')
      })

      fs.writeFile(`../data/hulu/current/archive/tvData_${dateStr}.json`, JSON.stringify(tvTitles), function (err) {
        if (err) throw err
        console.log('Archived tv data!')
      })

    } catch (err) {
      console.log('Save error: ', err)
      // throw error to stop execution if not saved
      if (err) throw err
    }
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
  updateLib: (movieObj, tvObj, dateIn) => {
    // Load lib
    const libRaw = fs.readFileSync('../data/hulu/lib/hulu_lib.json')
    const lib = JSON.parse(libRaw) // is obj
    // Load delta details
    const deltaListRaw = fs.readFileSync('../data/hulu/delta/ratings/deltaRatings.json')
    const deltaList = JSON.parse(deltaListRaw) // is list
    console.log('current title delta is: ', deltaList.length)

    const movieKeys = Object.keys(movieObj)
    const tvKeys = Object.keys(tvObj)
    let libOut = {}
    let deltaObj = {}
    let newDelta = []

    //movie and tv obj already have genres and we know that all of the delta titles need to be in the lib
    //for each delta title
    //if the title.type is movie
    //Look through the movie obj until the title is found
    //when the ids match, update the subgenres for the title
    //if the title.type is tv
    //Look through the tv obj until the title is found
    //when the ids match, update the subgenres for the title
    //convert the delta list to an object
    //combine delta with the lib and return

    for(d=0; d<deltaList.length; d++) {
      let dTitle = deltaList[d]
      if(title.type === 'movie') {
        for(let g=0; g<movieKeys.length; g++) {
          let gArray = movieObj[movieKeys[g]]
          for(let m=0; m<gArray.length; m++) {
            let mTitle = gArray[m]
            if(dTitle.id === mTitle.id) {
              dTitle.subgenres = mTitle.subgenres
              newDelta.push(dTitle)
            }
          }
        }
      }
      if(title.type === 'tv') {
        for(let g=0; g<tvKeys.length; g++) {
          let gArray = tvObj[tvKeys[g]]
          for(let t=0; t<gArray.length; t++) {
            let tvTitle = gArray[t]
            if(dTitle.id === tvTitle.id) {
              dTitle.subgenres = tvTitle.subgenres
              newDelta.push(dTitle)
            }
          }
        }
      }
    }

    console.log('Delta titles with subgenres is: ', newDelta.length)

    for(let i=0; i<newDelta.length; i++){
      let deltaTitle = newDelta[i]
      deltaObj[deltaTitle.id] = deltaTitle
    }

    //add Delta to lib
    libOut = {
      ...lib,
      ...deltaObj
    }
    console.log('Old lib has:\t', Object.keys(lib).length, ' titles...')
    console.log('Delta lib has:\t ', Object.keys(deltaObj).length, ' titles...')
    console.log('New lib has:\t', Object.keys(libOut).length, ' titles...')

    // Archive old lib
    fs.writeFile(`../data/hulu/lib/archive/hulu_lib_${dateIn}.json`, JSON.stringify(lib), function (err) {
      if (err) throw err
      console.log('Archived old lib!')
    })
    
    return libOut
  },
  populateDetails: (objIn, libIn) => {
    const genreKeys = Object.keys(objIn)
    let objOut = {}
    // Update delta object with genres
    genreKeys.forEach((genre) => {
      const genreArray = objIn[genre]
      let titleList = []
      genreArray.forEach((title) => {
        // if the title is in the updated lib (if we actually have correct details)
        if (libIn[title.id]) {
          // get details and push with updated genres
          let titleDetails = libIn[title.id]
          titleDetails.subgenres = title.subgenres
          titleList.push(titleDetails)
        }
      })
      objOut[genre] = titleList
    })
    return objOut
  }
}

module.exports = libUpdate
