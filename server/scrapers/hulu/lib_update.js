const fs = require('fs')

const libUpdate = {
  run: () => {
    const dateStr = new Date().toISOString().substring(0,19).split(':').join('-')
    // Load new titles
    const newTitlesRaw = fs.readFileSync('../data/hulu/titles/huluTitles.json') // is obj
    const newTitles = JSON.parse(newTitlesRaw)

    // Populate subgenres
    const titlesWithGenres = libUpdate.populateSubgenres(newTitles)
    // Update lib
    const updatedLib = libUpdate.updateLib(titlesWithGenres, dateStr)
    // Populate details
    const titlesWithDetails = libUpdate.populateDetails(titlesWithGenres, updatedLib)
    // Split into movies and tv - for hulu only
    const movieTitles = libUpdate.getMediaType(titlesWithDetails, 'movie')
    const tvTitles = libUpdate.getMediaType(titlesWithDetails, 'tv')

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
  updateLib: (objIn, dateIn) => {
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
    console.log('Delta lib has:\t ', Object.keys(deltaObjGenres).length, ' titles...')
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
  },
  getMediaType: (objIn, type) => {
    const movieRegex = /(\/movie\/)/
    const tvRegex = /(\/series\/)/
    const genreKeys = Object.keys(objIn)
    let objOut = {}
    // Sort the data by movies or tv
    genreKeys.forEach((genre) => {
      const genreArray = objIn[genre]
      let titleList = []
      genreArray.forEach((title) => {
        if (type === 'movie') {
          if(title.href.match(movieRegex) !== null) {
            titleList.push(title)
          }
        }
        if (type === 'tv') {
          if(title.href.match(tvRegex) !== null) {
            titleList.push(title)
          }
        }
      })
      objOut[genre] = titleList
    })
    return objOut
  }
}

module.exports = libUpdate
