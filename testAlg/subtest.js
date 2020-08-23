const fs = require('fs')


// Load lib
const libRaw = fs.readFileSync('../server/scrapers/data/netflix/lib/netflix_lib.json')
const lib = JSON.parse(libRaw) // is obj

const movieObjRaw = fs.readFileSync('./movieTitles.json') // is obj
const movieObj = JSON.parse(movieObjRaw)

 const moviesWithGenres = populateSubgenres(movieObj)
 // Populate details
 const movieTitles = populateDetails(moviesWithGenres, lib, 'movie')

  // Separate movie and tv types for Black Stories until Netflix fixes this 
  const movieTitlesFix = separateTypes(movieTitles , 'movie')

 fs.writeFileSync('./movieDataCheck.json', JSON.stringify(movieTitlesFix))
 console.log('Movie data saved!')

function populateSubgenres(objIn) {
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
}

function populateDetails(objIn, libIn) {
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

function separateTypes(objIn, typeIn) {
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