const libUpdate = require('./lib_update.js')
const dataCompressor = require('./compress_data.js')

function main() {

  console.log('Updating library and title data...')
  libUpdate.run()

  console.log('Compressing data...')
  dataCompressor.run()

  // Todo: restart the server after data push...
}

main()