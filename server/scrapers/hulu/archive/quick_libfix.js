const fs = require('fs')
const libRaw = fs.readFileSync('../data/hulu/lib/hulu_lib.json')
const lib = JSON.parse(libRaw) // is obj
const titleKeys = Object.keys(lib)
const dateStr = new Date().toISOString().substring(0,19).split(':').join('-')
let newLib = {}
// Archive old lib
fs.writeFileSync(`../data/hulu/lib/archive/hulu_lib_${dateStr}.json`, JSON.stringify(lib))
console.log('archived file')

titleKeys.forEach((titleId) => {
  newLib[titleId] = lib[titleId]
  let oldTitle = newLib[titleId].title
  let fixTitle = oldTitle.replace(/\.$/, '')
  newLib[titleId].title = fixTitle
})

// Archive old lib
fs.writeFileSync(`../data/hulu/lib/hulu_lib.json`, JSON.stringify(newLib))
console.log('Saved new lib')