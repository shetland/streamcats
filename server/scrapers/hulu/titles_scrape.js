const puppeteer = require('puppeteer');
const fs = require('fs');
// will import the running list and skip over genres we already have

async function run() {
    const browser = await puppeteer.launch({ headless: false});
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();

    await page.setViewport({
        width: 1000,
        height: 800
    });

    // login
    await page.goto(`https://auth.hulu.com/web/login`);
    await page.focus('#email_id')
    await page.keyboard.type('ellynkeith@gmail.com');
    await page.waitFor(1*1000);
    await page.focus('#password_id')
    await page.keyboard.type('3rnieM@tilda');
    await page.waitFor(2*1000);
    await page.click('#__next > div > div > div.jsx-2318525612.login-dialog > div.jsx-2318525612.login-panel > div.jsx-1761454348.hulu-login > button') 
    await page.waitFor(5*1000);
    await page.click('#__next > div > div > div.Modal__dialog.Modal__dialog--visible > div.ProfileSelectorModal__bottom.cu-profileselectormodal-bottom > div > div:nth-child(3) > button')
    await page.waitForNavigation();
    await page.waitFor(3*1000);

    // get a list of all the genres and their names
    // todo - save this genre list in its own file automatically
    let genreLinks = await page.evaluate(()=>{
        let links = document.querySelectorAll('a.BrowseMenu__item')
        let linkList = []
        for (i=6;i<links.length;i++) {
            let genreName = links[i].text
            let genreLink = links[i].href
            linkList.push({'name': genreName, 'href': genreLink })
        }
        return linkList
    });

    console.log('Current Genre Links: ', genreLinks)
    console.log('=========================================================')
    console.log('')
    console.log('')

    // save all running titles
    fs.writeFile('../data/hulu/titles/huluGenres.json', JSON.stringify(genreLinks), function (err) {
        if (err) throw err;
        console.log('Hulu Genres Saved!');
    });

    let huluObj = {}
    // let movieObj = {}
    let errorLog = []

    // for each genre link
    for (c=0;c<genreLinks.length;c++) {
        let currentGenre = genreLinks[c].name
        let currentLink = genreLinks[c].href

        console.log('On Genre: ', currentGenre)

        try {

        await page.goto(`${currentLink}`);
        await page.waitFor(5*1000);

        await autoScroll(page);
        // find the index of the row that is A-Z (potential bug for the A-z row not being found)
        let azRowIndex = await page.evaluate(() => {
            let index = -1
            let allRows = document.querySelectorAll('.Hub__collection')
            for (i=0;i<allRows.length;i++){
                let text = allRows[i].innerText.slice(0,3)
                if (text === 'A-Z') {
                    index = i
                    break
                }
            }
            if (index === -1) {
                console.log('Err: No index for A-Z row on genre')
            }
            return index
        });

        let nextBtnDisabled
        let genreHuluList = []
        // let genreMovieList = []
        let pageCounter = 0

        // scroll A-Z list until the end
        for (pageIndex=0;!nextBtnDisabled;pageIndex++) {
            console.log('   On page: ', pageCounter)

            // Check for the next button disable
            nextBtnDisabled = await page.evaluate((rowIndex) => {
                let correctBtn = document.querySelector(`.Hub__collection:nth-child(${rowIndex + 1}) > div > div[data-testid="slider"] > button[data-testid="slider-next"]`)
                return correctBtn.disabled
            }, azRowIndex)

            // get all items on current page in list
            let titlesOnPageList = await page.evaluate(()=>{
                let objList = []
                // let titlesOnPage = document.querySelectorAll('ul[aria-label = "A-Z"] > li a.GenericTileContent__title');
                // 
                let titlesOnPage = document.querySelectorAll('ul[aria-label = "A-Z"] > li > div > div > figure > div > button > div > img');
                for (i=0;i<titlesOnPage.length;i++) {
                    let currentObj = {}
                    let title = ''
                    let id = ''
                    let newTitle = titlesOnPage[i].alt.split('Cover art for ')[1]
                    let beforeQuest = titlesOnPage[i].src.split('?')[0]
                    let cutId = beforeQuest.split('artwork/')[1]

                    id = cutId
                    title = newTitle

                    currentObj.title = title
                    currentObj.id = id
                    objList.push(currentObj)
                }
                return objList
            })

            for (j=0;j<titlesOnPageList.length;j++){
                genreHuluList.push(titlesOnPageList[j])
            }
            // For each item on current page, divide into tv and movie titles // will search link in ddgo
            // for (j=0;j<titlesOnPageList.length;j++){
            //     let link = titlesOnPageList[j].href

            //     // Log for testing
            //     console.log(titlesOnPageList[j])

            //     if (link.includes('/series/')){
            //         genreTvList.push(titlesOnPageList[j])
            //     }
            //     if (link.includes('/movie/')){
            //         genreMovieList.push(titlesOnPageList[j])
            //     }
            //     if (!link.includes('/series/') && !link.includes('/movie/')){
            //         console.log('Err: Title is not a movie or a series?')
            //     }
            // }

            // Wait for debugging selectors
            // await page.waitFor(600000)

            // Set random page wait time from 2-4 seconds
            let pageWait = Math.floor(Math.random() * 3) + 2;
            await page.waitFor(pageWait*1000);

            // click to the next page
            await page.click(`.Hub__collection:nth-child(${azRowIndex + 1}) > div > div[data-testid="slider"] > button[data-testid="slider-next"]`)
            pageCounter++
        }
        console.log('Exited button clicking loop\n\n')

        // filter array for only unique Tv titles in genre
        const filteredHuluList = genreHuluList.filter((item, index, self) =>
            index === self.findIndex((t) => (
                t.id === item.id
            ))
        );

        // // filter array for only unique Movie titles in genre
        // const filteredMovieList = genreMovieList.filter((item, index, self) =>
        // index === self.findIndex((t) => (
        //     t.id === item.id
        // ))
        // );

        // save into tv and movie objects
        huluObj[currentGenre] = filteredHuluList
        // movieObj[currentGenre] = filteredMovieList

        // save all running titles
        fs.writeFile('../data/hulu/titles/huluData_running.json', JSON.stringify(huluObj), function (err) {
            if (err) throw err;
            console.log('Hulu Object Saved!');
        });

        // fs.writeFile('../data/hulu/titles/movieData_running.json', JSON.stringify(movieObj), function (err) {
        //     if (err) throw err;
        //     console.log('Movie Object Saved!');
        // });

        } catch(err) {
            console.log('Error: ', err)
            let abbrString = err.slice(0, 300)
            // save all titles with genre divisions
            errorLog.push(abbrString)
            fs.writeFile('../data/hulu/titles/errorLog.json', JSON.stringify(errorLog), function (err) {
                if (err) throw err;
                console.log('Tv Object Saved!')
            });

        }
    }

    // save all titles with genre divisions
    fs.writeFile('../data/hulu/titles/huluData.json', JSON.stringify(huluObj), function (err) {
        if (err) throw err;
        console.log('Tv Object Saved!');
    });

    // fs.writeFile('../data/hulu/titles/movieData.json', JSON.stringify(movieObj), function (err) {
    //     if (err) throw err;
    //     console.log('Movie Object Saved!');
    // });

    await page.waitFor(5*1000);

    browser.close();
    console.log('finished');

    // function definitions
    async function autoScroll(page){
        await page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                var totalHeight = 0;
                var distance = 60;
                var timer = setInterval(() => {
                    var scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
    
                    if(totalHeight >= scrollHeight){
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });
    }

}

run();