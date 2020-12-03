var fs = require('fs')
var Parser = require('rss-parser');
var parser = new Parser();
var axios = require('axios').default; 
var popeyelib = require('popeyelib')
var wait = popeyelib.wait
var sha256 = require('sha256')

async function getGoogleRss(lang, category, blackList) {
    return(new Promise(async (resolve, reject) => {
        try {
            var feed = await parser.parseURL("https://news.google.com/rss/search?q=" + category + "&hl=en-US&gl=US&ceid=" + lang)
            

            for (var item of feed.items) {
                await wait(2)
                if (blackList.indexOf(sha256(item.title) + ".txt") === -1) {
                    fs.writeFileSync("./DB/" + lang + "/" + category + "/" + new Date().getTime() + "-" + sha256(item.title) + ".txt", JSON.stringify(item))
                }
            }
            console.log(feed.items.length)
            resolve()
        } catch(e) {
            console.log('Error', e)
        }
    }))
}

async function getOldArticles(lang, j) {
    return(new Promise(async (resolve, reject) => {
        try {
            if (!fs.existsSync("./DB/" + lang))
                fs.mkdirSync("./DB/" + lang);
            if (!fs.existsSync("./DB/" + lang + "/" + j))
                fs.mkdirSync("./DB/" + lang + "/" + j)
            var blackList = []
            for (var i of fs.readdirSync("./DB/" + lang + "/" + j)) {
                blackList.push(i.split('-')[1])
            }
            resolve(blackList)    
        } catch(e) {
            console.log('Error', e)
        }
    }))
}

function getRss() {
    return(new Promise(async (resolve, reject) => {
        try {
            for (var i of fs.readFileSync('./configuration/langueGoogle.txt', "UTF-8").split('\n')) {
                for (var j of fs.readFileSync('./configuration/category/google/' + i + ".txt", "UTF-8").split('\n')) {
                    var lang = i.split('_')
                    var blackList = await getOldArticles(lang[0], j)
                    
                    await getGoogleRss(lang[0], j, blackList)
                    await wait(100000)
                }
            }
            await wait(100000)
            getRss()
        } catch(e) {
            console.log('Error', e)
        }
    }))
}

exports.getRss = getRss