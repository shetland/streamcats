const fs = require('fs')
const titleLib = require('../data/hulu/lib/hulu_lib.json')
const newTitles = require('../data/hulu/titles/huluTitles.json') // Todo: update save in get titles


const deltaFinder = {
  run: () => {
    // Get delta
    const delta = deltaFinder.getDelta(newTitles)
    console.log('Found: ', delta.length, ' new titles')
    // Save in delta titles and dated backup
    console.log('Saving...')
    let dateStr = new Date().toISOString().substring(0,19).split(':').join('-')
    fs.writeFile(`../data/hulu/delta/titles/archive/deltaTitles_${dateStr}.json`, JSON.stringify(delta), function (err) {
      if (err) throw err
      console.log('Archived delta!')
    })
    fs.writeFileSync('../data/hulu/delta/titles/deltaTitles.json', JSON.stringify(delta))
    console.log('Delta Saved!')
  },
  getDelta: (titlesIn) => {
    console.log('Getting delta...')
    // get all genres in object
    let genreKeys = Object.keys(titlesIn)
    let deltaTitles = []
    // for each genre
    genreKeys.forEach((genre) => {
        let genreArray = titlesIn[genre]
        // for each title in the genre
        genreArray.forEach((title) => {
          // TODO: will add this when scraping titles...
          let titleStr = title.title.replace(/[^\w\s]|_/g, "").replace(/\s+/g, "-").toLowerCase()
          let realId = titleStr + '-' + title.id
          // see if title is in lib and save into delta
          if(!titleLib[realId]) {
            title.id = realId
            deltaTitles.push(title)
          }
        })
    })
    return deltaFinder.filterDupes(deltaTitles)
  },
  filterDupes: (arrayIn) => {
    console.log('Filtering delta...')
    // filter out any duplicates by id
    const filteredArray = arrayIn.filter((item, index, self) =>
      index === self.findIndex((t) => (
          t.id === item.id
      ))
    )
    return filteredArray
  }
}

module.exports = deltaFinder