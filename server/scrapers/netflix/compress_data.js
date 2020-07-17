const fs = require('fs')

const dataCompressor = {
  run: () => {
    // Get data
    const dateStr = new Date().toISOString().substring(0,19).split(':').join('-')
    const movieDataRaw = fs.readFileSync('../data/netflix/current/movieData.json')
    const movieData = JSON.parse(movieDataRaw)
    const tvDataRaw = fs.readFileSync('../data/netflix/current/tvData.json')
    const tvData = JSON.parse(tvDataRaw)

    let nmk = dataCompressor.getCompressionKey(movieData)
    let ntk = dataCompressor.getCompressionKey(tvData)
    let nmv = dataCompressor.keyFlip(nmk)
    let ntv = dataCompressor.keyFlip(ntk)
    let compNmd = dataCompressor.compressData(nmk, movieData)
    let compNtd = dataCompressor.compressData(ntk, tvData)
    let exportCompKeys = { "nmv": nmv, "ntv": ntv }

    console.log('Saving...')
    try {
      fs.writeFileSync('../../data/netflix/compNmd.json', JSON.stringify(compNmd))
      console.log('Movie data compressed!')

      fs.writeFileSync('../../data/netflix/compNtd.json', JSON.stringify(compNtd))
      console.log('Tv data compressed!')

      fs.writeFileSync('../../data/compkeys/netflixCompKeys.json', JSON.stringify(exportCompKeys))
      console.log('Compression keys saved!')

      fs.writeFile(`../../data/netflix/archive/compNmd_${dateStr}.json`, JSON.stringify(compNmd), function (err) {
        if (err) throw err
        console.log('Archived compressed movie data!')
      })
      fs.writeFile(`../../data/netflix/archive/compNtd_${dateStr}.json`, JSON.stringify(compNtd), function (err) {
        if (err) throw err
        console.log('Archived compressed tv data!')
      })
      fs.writeFile(`../../data/compkeys/archive/netflixCompKeys_${dateStr}.json`, JSON.stringify(exportCompKeys), function (err) {
        if (err) throw err
        console.log('Archived compression keys!')
      })

    } catch(err) {
      console.log('Compression save error: ', err)
      // Throw to stop execution if not saved
      throw err
    }
    // Last step in update.
    setTimeout(()=>{
      console.log('Done.')
    }, 2000)
  },
  getCompressionKey: (objIn) => {
    let gKeys = Object.keys(objIn)
    let gLength = gKeys.length
    let keyObjExport = {}
    let count = 0
    for(let g=0;g<gLength;g++) {
      let currG = gKeys[g]
      let currArr = objIn[currG]
      let tLength = currArr.length
  
      for(let t=0;t<tLength;t++) {
        let title = currArr[t]
        let tKeys = Object.keys(title)
        let iLength = tKeys.length
        for(let i=0;i<iLength;i++) {
          let iKey = tKeys[i]
  
          if(iKey !== 'subgenres' && iKey !== 'href') {
            let keyStr = title[iKey]
            let strArr = keyStr.split(' ')
            for(let w=0;w<strArr.length;w++){
              let wKey = strArr[w]
              if(!keyObjExport[wKey]){
                keyObjExport[wKey] = count
                count++
              }
            }
          } else {
            let subArr = title['subgenres']
            for(let s=0;s<subArr.length;s++){
              let sKey = subArr[s]
              if(!keyObjExport[sKey]){
                keyObjExport[sKey] = count
                count++
              }
            }
          }
        }
      }
    }
    return keyObjExport
  },
  compressData: (keyObjIn, dataObjIn) => {
    let gKeys = Object.keys(dataObjIn)
    let gLength = gKeys.length
    let compObjExport = {}
    for(let g=0;g<gLength;g++) {
      let currG = gKeys[g]
      let currArr = dataObjIn[currG]
      let tLength = currArr.length
      for(let t=0;t<tLength;t++) {
        let title = currArr[t]
        delete title['href']
        let tKeys = Object.keys(title)
        let iLength = tKeys.length
        for(let i=0;i<iLength;i++) {
          let iKey = tKeys[i]
          if(iKey !== 'subgenres' && iKey !== 'href') {
            let keyStr = title[iKey]
            let strArr = keyStr.split(' ')
            let parsedArray = []
            for(let w=0;w<strArr.length;w++){
              let eValue = keyObjIn[strArr[w]]
              parsedArray.push(eValue)
            }
            title[iKey] = parsedArray
          } else {
            let subArr = title['subgenres']
            let parsedSgArray = []
            for(let s=0;s<subArr.length;s++){
              let seValue = keyObjIn[subArr[s]]
              parsedSgArray.push(seValue)
            }
            title['subgenres'] = parsedSgArray
          }
        }
        currArr[t]=title
      }
      compObjExport[currG] = currArr
    }
    return compObjExport
  },
  decompressData: (valueObjIn, dataObjIn, catIn, typeIn) => {
    // used on the client
    let gKeys = Object.keys(dataObjIn)
    let gLength = gKeys.length
    let dCompObjExport = {}
      
    for(let g=0;g<gLength;g++) {
      let currG = gKeys[g]
      let currArr = dataObjIn[currG]
      let tLength = currArr.length
  
      for(let t=0;t<tLength;t++) {
        let title = currArr[t]
        let urlStr = ''
        let tKeys = Object.keys(title)
        let iLength = tKeys.length
              
        for(let i=0;i<iLength;i++) {
          let iKey = tKeys[i]
                  
          if(iKey !== 'subgenres' && iKey !== 'href') {
            let keyArr = title[iKey]
            let parsedArray = []
            let parsedStr = ''
            for(let k=0;k<keyArr.length;k++){
              let dValue = valueObjIn[keyArr[k]]
              parsedArray.push(dValue)
            }
            parsedStr = parsedArray.join(' ')
            title[iKey] = parsedStr
          } else {
            let subKeyArr = title['subgenres']
            let parsedSgArray = []
            for(let s=0;s<subKeyArr.length;s++){
              let sdValue = valueObjIn[subKeyArr[s]]
              parsedSgArray.push(sdValue)
              }
              title['subgenres'] = parsedSgArray
          }
        }
        if (catIn === 'hulu') {
          if(typeIn === 'movies') {
            urlStr = 'https://www.hulu.com/movie/' + title.id
          }
          if(typeIn === 'tv') {
            urlStr = 'https://www.hulu.com/series/' + title.id
          }
        }
        if (catIn === 'netflix') {
          urlStr = 'https://www.netflix.com/title/' + title.id
        }
        title.href = urlStr
        currArr[t]=title
      }
      dCompObjExport[currG] = currArr
    }
    return dCompObjExport
  },
  keyFlip: (objIn) => {
    const ret = {};
    Object.keys(objIn).forEach(key => {
      ret[objIn[key]] = key
    })
    return ret;
  }
}

module.exports = dataCompressor