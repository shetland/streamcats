const fs = require('fs')

const connector = {
  saveConnections: (ipIn) => {
    try {
      let ipDate = new Date().toISOString() + " : " + ipIn + ",\n"
      let ipStream = fs.createWriteStream("./data/connections/ip_list.txt", {flags:'a'})
      ipStream.write(ipDate)
      ipStream.end()
    } catch (error) {
      console.log(error)
      let errorDate = new Date().toISOString() + " : " + error + ",\n"
      let errorStream = fs.createWriteStream("./data/connections/error_log.txt", {flags:'a'})
      errorStream.write(errorDate)
      errorStream.end()
    }
  }
}

module.exports = connector