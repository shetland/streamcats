const fs = require('fs');
const importObj = require('../data/lib/hulu_lib.json')

let editObj = importObj
let keys = Object.keys(editObj)

for(k=0;k<keys.length;k++){
    let genre = keys[k]
    let genreArr = editObj[genre]
    let length = genreArr.length

    for(t=0;t<length;t++){
        let title = genreArr[t]
        if (title.rating==='?') {
            console.log('found incorrect rating')
            title.rating = '?'  
        }
        if (title.imdbScore === 0){
            console.log('found 0 imdb score')
            title.imdbScore = '?'
        }
        genreArr[t] = title
    }
    editObj[genre] = genreArr
}

// Also need to fix tv titles:
// "TVSeries"

// Save out the movie data
fs.writeFile('./tv/finalTv.json', JSON.stringify(editObj), function (err) {
    if (err) throw err;
    console.log('Saved!');
});