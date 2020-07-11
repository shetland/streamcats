const fs = require('fs')

const test = {
  run: async () => {
    let textFrom1 = fs.readFileSync('text_file1.txt')

    console.log('text 1 loaded ... executing module 2...')
    let text = 'Module 2 got text from module 1: ' + textFrom1 + '\n'
    let multitext = ''
    for(let i=0;i<15;i++) {
      multitext += text
    }
    fs.writeFileSync('text_file2.txt', multitext)
    console.log('finished executing module 2')
  }
}

module.exports = test