const fs = require('fs')

const libUpdate = {
  run: async () => {
    const dateStr = new Date().toISOString().substring(0,19).split(':').join('-')
    // Load new titles
    const movieObjRaw = fs.readFileSync('../data/netflix/titles/movieTitles.json') // is obj
    const movieObj = JSON.parse(movieObjRaw)

    const tvObjRaw = fs.readFileSync('../data/netflix/titles/tvTitles.json') // is obj
    const tvObj = JSON.parse(tvObjRaw)

    // Populate subgenres
    const moviesWithGenres = libUpdate.populateSubgenres(movieObj, tvObj)
    const tvWithGenres = libUpdate.populateSubgenres(tvObj, movieObj)

    // Update lib
    const updatedLib = libUpdate.updateLib(moviesWithGenres, tvWithGenres, dateStr)

    // Populate details
    const movieTitles = libUpdate.populateDetails(moviesWithGenres, updatedLib, 'movie')
    const tvTitles = libUpdate.populateDetails(tvWithGenres, updatedLib, 'tv')

    // Separate movie and tv types for Black Stories until Netflix fixes this 
    const movieTitlesFix = libUpdate.separateTypes(movieTitles , 'movie')
    const tvTitlesFix = libUpdate.separateTypes(tvTitles, 'tv')

    console.log('Saving...')
    try {
      fs.writeFileSync('../data/netflix/current/movieData.json', JSON.stringify(movieTitlesFix))
      console.log('Movie data saved!')

      fs.writeFileSync('../data/netflix/current/tvData.json', JSON.stringify(tvTitlesFix))
      console.log('Tv data saved!')

      fs.writeFileSync('../data/netflix/lib/netflix_lib.json', JSON.stringify(updatedLib))
      console.log('Library updated!')

      // Archive tv and movie data
      fs.writeFile(`../data/netflix/current/archive/movieData_${dateStr}.json`, JSON.stringify(movieTitlesFix), function (err) {
        if (err) throw err
        console.log('Archived movie data!')
      })

      fs.writeFile(`../data/netflix/current/archive/tvData_${dateStr}.json`, JSON.stringify(tvTitlesFix), function (err) {
        if (err) throw err
        console.log('Archived tv data!')
      })

    } catch (err) {
      console.log('Save error: ', err)
      // throw error to stop execution if not saved
      if (err) throw err
    }
  },
  populateSubgenres: (objIn, objIn2) => {
    // get all genres in object
    let genreKeys = Object.keys(objIn)
    let genreKeys2 = Object.keys(objIn2)
    let objOut = {}

    // for each genre
    genreKeys.forEach((genre) => {
      let genreArray = objIn[genre]
      // for each title in the genre
      genreArray.forEach((title, index) => {
        let titleId = title.id
        let subgenreList = []
        
        genreKeys.forEach((check) => {
          // if the current genrecheck array contains a title with the same id
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

    // Now cycle through titles again an pull any subgenres
    // from the other media obj
    genreKeys.forEach((genre) => {
      let genreArray = objOut[genre]
      // for each title in the genre
      genreArray.forEach((title, index) => {
        let titleId = title.id
        let subgenreList = title.subgenres
        
        genreKeys2.forEach((check) => {
          // if the current genrecheck array contains a title with the same id
          if (objIn2[check].some(obj => obj.id === titleId) ){
            //and the subgenre is not in the current list
            if(!subgenreList.includes(check)) {
              //add to the list
              subgenreList.push(check)
            }
          }
        })
        // Update the subgenre list in title
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
    const libRaw = fs.readFileSync('../data/netflix/lib/netflix_lib.json')
    const lib = JSON.parse(libRaw) // is obj
    // Load delta details
    const deltaListRaw = fs.readFileSync('../data/netflix/delta/ratings/deltaRatings.json')
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
      if(dTitle.type === 'movie') {
        for(let g=0; g<movieKeys.length; g++) {
          let gArray = movieObj[movieKeys[g]]
          for(let m=0; m<gArray.length; m++) {
            let mTitle = gArray[m]
            if(dTitle.id === mTitle.id) {
              dTitle.subgenres = mTitle.subgenres
              //if the title isn't already in the new delta
              if(!newDelta.some((title) => {return title.id === dTitle.id})) {
                newDelta.push(dTitle)
              }
            }
          }
        }
      }
      if(dTitle.type === 'tv') {
        for(let g=0; g<tvKeys.length; g++) {
          let gArray = tvObj[tvKeys[g]]
          for(let t=0; t<gArray.length; t++) {
            let tvTitle = gArray[t]
            if(dTitle.id === tvTitle.id) {
              dTitle.subgenres = tvTitle.subgenres
              //if the title isn't already in the new delta
              if(!newDelta.some((title) => {return title.id === dTitle.id})) {
                newDelta.push(dTitle)
              }
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
    fs.writeFile(`../data/netflix/lib/archive/netflix_lib_${dateIn}.json`, JSON.stringify(lib), function (err) {
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
  },
  separateTypes: (objIn, typeIn) => {
    let editArray = []
    let genreArray = objIn["Black Stories"]

    const tvRegex = /(TV-)/

    for(let i=0; i<genreArray.length; i++) {
      let title = genreArray[i]
      if(typeIn === 'tv') {
        if (title.rating.match(tvRegex)) {
          editArray.push(title)
        }
      }
      if(typeIn === 'movie') {
        if (!title.rating.match(tvRegex)) {
          editArray.push(title)
        }
      }
    }

    objIn["Black Stories"] = editArray

    return objIn
  }
}

module.exports = libUpdate
