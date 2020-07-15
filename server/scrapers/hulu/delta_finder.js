const fs = require('fs')

const deltaFinder = {
  run: () => {
    // Get new titles
    const newTitlesRaw = fs.readFileSync('../data/hulu/titles/huluTitles.json')
    const newTitles = JSON.parse(newTitlesRaw)
    const delta = deltaFinder.getDelta(newTitles)

    console.log('Found: ', delta.length, ' new titles')
    // Save in delta titles and dated backup
    console.log('Saving...')
    try {
      fs.writeFileSync('../data/hulu/delta/titles/deltaTitles.json', JSON.stringify(delta))
      console.log('Delta Saved!')

      let dateStr = new Date().toISOString().substring(0,19).split(':').join('-')
      fs.writeFile(`../data/hulu/delta/titles/archive/deltaTitles_${dateStr}.json`, JSON.stringify(delta), function (err) {
        if (err) throw err
        console.log('Archived delta!')
      })
    } catch(err) {
      console.log('Delta save error: ', err)
      // Throw to stop execution if not saved
      throw err
    }
  },
  getDelta: (titlesIn) => {
    // Load lib
    const titleLibRaw = fs.readFileSync('../data/hulu/lib/hulu_lib.json')
    const titleLib = JSON.parse(titleLibRaw)
    console.log('Getting delta...')
    // Get all genres in object
    let genreKeys = Object.keys(titlesIn)
    let deltaTitles = []
    // For each genre
    genreKeys.forEach((genre) => {
        let genreArray = titlesIn[genre]
        // For each title in the genre
        genreArray.forEach((title) => {
          // See if title is in lib and save into delta
          if(!titleLib[title.id]) {
            deltaTitles.push(title)
          }
        })
    })
    return deltaFinder.filterDupes(deltaTitles)
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