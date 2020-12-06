var fs = require('fs')
var Parser = require('rss-parser');
var parser = new Parser();
var axios = require('axios').default; 
var popeyelib = require('popeyelib')
var wait = popeyelib.wait
var sha256 = require('sha256');
const { prototype } = require('stream');

async function getArticles(lang, category, blackList, url) {
    return(new Promise(async (resolve, reject) => {
        try {
            for (var i of url.split('-AND-')) {
                var feed = await parser.parseURL(i)

                for (var item of feed.items) {
                    await wait(2)
                    if (blackList.indexOf(sha256(item.title) + ".txt") === -1) {
                        fs.writeFileSync("./DB/" + lang + "/" + category + "/" + new Date(item.pubDate).getTime() + "-" + sha256(item.title) + ".txt", JSON.stringify(item))
                    }
                }
            }
            resolve()
        } catch(e) {
            console.log('Error', e)
            resolve()
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

async function getRss() {
    return(new Promise(async (resolve, reject) => {
        try {
            for (var i of fs.readFileSync('./configuration/langueList.txt', "UTF-8").split('\n')) {
                for (var j of fs.readFileSync('./configuration/categories/' + i + ".txt", "UTF-8").split('\n')) {
                    var lang = i.split('_')
                    var blackList = await getOldArticles(lang[1], j.split("_")[0])
                    getArticles(lang[1], j.split("_")[0], blackList, j.split("_")[1])
                    await wait(1000)
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




/*
    // https://news.google.com/rss/search?q=deporte&ceid=MX:es&hl=es-419&gl=MX

    //var url = ("https://news.google.com/rss/search?q=" + category + "&ceid=" + code + "&gl=" + code.split(':')[0])
    //url = slugify(url)
    //console.log(url)

    function slugify(str) {
        var map = {
            '-': ' ',
            '-': '_',
            'a': 'á|à|ã|â|À|Á|Ã|Â',
            'e': 'é|è|ê|É|È|Ê',
            'i': 'í|ì|î|Í|Ì|Î',
            'o': 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
            'u': 'ú|ù|û|ü|Ú|Ù|Û|Ü',
            'c': 'ç|Ç',
            'n': 'ñ|Ñ'
        };

        for (var pattern in map) {
            str = str.replace(new RegExp(map[pattern], 'g'), pattern);
        };

        return str;
    };
*/