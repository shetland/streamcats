const fs = require('fs');

const test = {
  run: async () => {
    let text = 'running the test module 1...'
    console.log(text)
    fs.writeFileSync('text_file1.txt', text)
    console.log('finished executing module 1')
  }
}

module.exports = test