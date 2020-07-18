const fs = require('fs')

const deltaFinder = {
  run: async () => {
    // Get new titles
    const movieTitlesRaw = fs.readFileSync('../data/netflix/titles/movieTitles.json')
    const movieTitles = JSON.parse(movieTitlesRaw)
    const tvTitlesRaw = fs.readFileSync('../data/netflix/titles/tvTitles.json')
    const tvTitles = JSON.parse(tvTitlesRaw)
    const delta = deltaFinder.getDelta(movieTitles, tvTitles)
    const dateStr = new Date().toISOString().substring(0,19).split(':').join('-')

    console.log('Found: ', delta.length, ' new titles...')
    // Save in delta titles and dated backup
    console.log('Saving...')
    try {
      fs.writeFileSync('../data/netflix/delta/titles/deltaTitles.json', JSON.stringify(delta))
      console.log('Delta Saved!')

      fs.writeFile(`../data/netflix/delta/titles/archive/deltaTitles_${dateStr}.json`, JSON.stringify(delta), function (err) {
        if (err) throw err
        console.log('Archived delta!')
      })
    } catch(err) {
      console.log('Delta save error: ', err)
      // Throw to stop execution if not saved
      throw err
    }
  },
  getDelta: (movieObjIn, tvObjIn) => {
    // Load lib
    const titleLibRaw = fs.readFileSync('../data/netflix/lib/netflix_lib.json')
    const titleLib = JSON.parse(titleLibRaw)
    console.log('Getting delta...')
    // Get movie delta
    let movieKeys = Object.keys(movieObjIn)
    let deltaMovieTitles = []
    movieKeys.forEach((genre) => {
        let genreArray = movieObjIn[genre]
        genreArray.forEach((title) => {
          if(!titleLib[title.id]) {
            title.type = 'movie'
            deltaMovieTitles.push(title)
          }
        })
    })
    console.log("Found ", deltaMovieTitles.length, ' new movies')
    let filteredMovieDelta = deltaFinder.filterDupes(deltaMovieTitles)
    // Get tv delta
    let tvKeys = Object.keys(tvObjIn)
    let deltaTvTitles = []
    tvKeys.forEach((genre) => {
        let genreArray = tvObjIn[genre]
        genreArray.forEach((title) => {
          if(!titleLib[title.id]) {
            title.type = 'tv'
            deltaTvTitles.push(title)
          }
        })
    })

    console.log("Found ", deltaTvTitles.length, ' new tv shows')
    let filteredTvDelta = deltaFinder.filterDupes(deltaTvTitles)
    let fullDelta = [ ...filteredMovieDelta, ...filteredTvDelta ]
    // Return filtered full delta
    return deltaFinder.filterDupes(fullDelta)
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
  }
}

module.exports = deltaFinder