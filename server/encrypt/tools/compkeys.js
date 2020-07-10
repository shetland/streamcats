const huluMovieData =  require("../data/hulu/finalMovie.json")
const huluTvData =  require("../data/hulu/finalTv.json")
const netflixMovieData =  require("../data/netflix/finalMovie.json")
const netflixTvData =  require("../data/netflix/finalTv.json")
const fs = require('fs');

let hmk = getCompressionKey(huluMovieData)
let htk = getCompressionKey(huluTvData)
let nmk = getCompressionKey(netflixMovieData)
let ntk = getCompressionKey(netflixTvData)

let hmv = keyFlip(getCompressionKey(huluMovieData))
let htv = keyFlip(getCompressionKey(huluTvData))
let nmv = keyFlip(getCompressionKey(netflixMovieData))
let ntv = keyFlip(getCompressionKey(netflixTvData))

const exportCompKeys = {"hmv":hmv,"htv":htv,"nmv":nmv,"ntv":ntv}
const keyNum1 = Object.keys(hmv).length
const keyNum2 = Object.keys(htv).length
const keyNum3 = Object.keys(nmv).length
const keyNum4 = Object.keys(ntv).length

console.log('Key Count 1: ', keyNum1)
console.log('Key Count 2: ', keyNum2)
console.log('Key Count 3: ', keyNum3)
console.log('Key Count 4: ', keyNum4)

if(keyNum1 > 64000 || keyNum2 > 64000 || keyNum3 > 64000 || keyNum4 > 64000) {
    console.log("!Warning!: A Compression key is too long - must use Uint32Array for encoding")
} else {
    console.log('Ok')
}

fs.writeFile('../data/compressionKeys.json', JSON.stringify(exportCompKeys), function (err) {
    if (err) throw err;
    console.log('Saved!')
});

let compHmd = compressData(hmk,huluMovieData)
let compHtd = compressData(htk,huluTvData)
let compNmd = compressData(nmk,netflixMovieData)
let compNtd = compressData(ntk,netflixTvData)

fs.writeFile('../data/hulu/compHmd.json', JSON.stringify(compHmd), function (err) {
    if (err) throw err;
    console.log('Saved!')
});
fs.writeFile('../data/hulu/compHtd.json', JSON.stringify(compHtd), function (err) {
    if (err) throw err;
    console.log('Saved!')
});
fs.writeFile('../data/netflix/compNmd.json', JSON.stringify(compNmd), function (err) {
    if (err) throw err;
    console.log('Saved!')
});
fs.writeFile('../data/netflix/compNtd.json', JSON.stringify(compNtd), function (err) {
    if (err) throw err;
    console.log('Saved!')
})

// OPTIONAL TEST TO CHECK DATA INTEGRITY (may also use sha256sum later)
//=====================================================================
// console.log('Testing decompression...')
// let testDecomp = dComp(exportCompKeys['hmv'],compHmd,'hulu','movies')

// fs.writeFile('testDecompHmd.json', JSON.stringify(testDecomp), function (err) {
//     if (err) throw err;
//     console.log('Saved!')
// })

// FUNCTION DEFINITIONS
// ==================================================================================

// 1. getCompressionKey returns numbered key/value pairs for all unique data
function getCompressionKey(objIn) {
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
}

// 2. compressData turns the data object into a compress obj of number arrays
function compressData(keyObjIn, dataObjIn) {
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
}

// 3. dComp decompresses the dataObj with the value key - used on client 
function dComp(valueObjIn, dataObjIn, catIn, typeIn) {
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
}

// 4. keyFlip flips an objects keys and values
function keyFlip(objIn) {
    const ret = {};
    Object.keys(objIn).forEach(key => {
      ret[objIn[key]] = key
    })
    return ret;
}


