const fs = require('fs')

const libUpdate = {
  run: () => {
    const dateStr = new Date().toISOString().substring(0,19).split(':').join('-')
    // Load new titles
    const movieObjRaw = fs.readFileSync('../data/netflix/titles/movieTitles.json') // is obj
    const movieObj = JSON.parse(movieObjRaw)

    const tvObjRaw = fs.readFileSync('../data/netflix/titles/tvTitles.json') // is obj
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
      fs.writeFileSync('../data/netflix/current/movieData.json', JSON.stringify(movieTitles))
      console.log('Movie data saved!')

      fs.writeFileSync('../data/netflix/current/tvData.json', JSON.stringify(tvTitles))
      console.log('Tv data saved!')

      fs.writeFileSync('../data/netflix/lib/netflix_lib.json', JSON.stringify(updatedLib))
      console.log('Library updated!')

      // Archive tv and movie data
      fs.writeFile(`../data/netflix/current/archive/movieData_${dateStr}.json`, JSON.stringify(movieTitles), function (err) {
        if (err) throw err
        console.log('Archived movie data!')
      })

      fs.writeFile(`../data/netflix/current/archive/tvData_${dateStr}.json`, JSON.stringify(tvTitles), function (err) {
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
    const libRaw = fs.readFileSync('../data/netflix/lib/netflix_lib.json')
    const lib = JSON.parse(libRaw) // is obj
    // Load delta details
    const deltaListRaw = fs.readFileSync('../data/netflix/delta/ratings/deltaRatings.json')
    const deltaList = JSON.parse(deltaListRaw) // is list

    const movieKeys = Object.keys(movieObj)
    const tvKeys = Object.keys(tvObj)

    let libOut = {}
    let deltaObj = {}
    let deltaObjGenres = {}
    // Convert delta to obj
    deltaList.forEach((title) => {
      deltaObj[title.id] = title
    })
    // Update delta object with genres from movie obj
    movieKeys.forEach((genre) => {
      const genreArray = movieObj[genre]
      genreArray.forEach((title) => {
        // if the title is in the delta obj and has year detail
        if (deltaObj[title.id] && deltaObj[title.id].year) {
          // save into new obj with subgenres
          deltaObjGenres[title.id] = deltaObj[title.id]
          deltaObjGenres[title.id].subgenres = title.subgenres
        }
      })
    })

    // Update delta object with genres from tv obj
    tvKeys.forEach((genre) => {
      const genreArray = tvObj[genre]
      genreArray.forEach((title) => {
        // if the title is in the delta obj and has year detail
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
    console.log('Delta lib has:\t ', Object.keys(deltaObjGenres).length, ' titles...')
    console.log('New lib has:\t', Object.keys(libOut).length, ' titles...')

    // Archive old lib
    fs.writeFile(`../data/netflix/lib/archive/netflix_lib_${dateIn}.json`, JSON.stringify(lib), function (err) {
      if (err) throw err
      console.log('Archived old lib!')
    })
    
    return libOut
  },
  populateDetails: (objIn, libIn, typeIn) => {
    const genreKeys = Object.keys(objIn)
    let objOut = {}
    // Update delta object with genres
    genreKeys.forEach((genre) => {
      const genreArray = objIn[genre]
      let titleList = []

      //Part of fix for black stories problem:
      const tvRegex = /(TV-)/

      genreArray.forEach((title) => {
        // Genre specific rule because genre tv and movies are not separated in Black Stories
        if (genre === 'Black Stories') {
          if(typeIn === 'tv') {
            if (libIn[title.id]) {
              // get details and push with updated genres
              let titleDetails = libIn[title.id]
              titleDetails.subgenres = title.subgenres
              if (titleDetails.rating.match(tvRegex) !== null) {
                titleList.push(titleDetails)
              }
            }
          }
          if(typeIn === 'movie') {
            if (libIn[title.id]) {
              // get details and push with updated genres
              let titleDetails = libIn[title.id]
              titleDetails.subgenres = title.subgenres
              if (!titleDetails.rating.match(tvRegex) !== null) {
                titleList.push(titleDetails)
              }
            }
          }
        } else {
          // if the title is in the updated lib (if we actually have correct details)
          if (libIn[title.id]) {
            // get details and push with updated genres
            let titleDetails = libIn[title.id]
            titleDetails.subgenres = title.subgenres
            titleList.push(titleDetails)
          }
        }
      })
      objOut[genre] = titleList
    })
    return objOut
  }
}

module.exports = libUpdate
