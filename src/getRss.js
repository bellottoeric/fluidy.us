var fs = require('fs')
var Parser = require('rss-parser');
var parser = new Parser();
var popeyelib = require('popeyelib')
const cheerio = require('cheerio');
var wait = popeyelib.wait
var sha256 = require('sha256');
const {
  extract 
} = require('article-parser');

async function getMetaData(link) {
    return(new Promise(async (resolve, reject) => {
        try {
            extract(link).then((article) => {
                if (article.image) {
                    const $ = cheerio.load(article.content)

                    $('img').each(function (i, elem) {
                        if (!elem.attribs.src) {
                            $(this).replaceWith("");
                        }
                    });
                    resolve(article)
                } else {
                    //console.log("No image")
                    resolve("err")
                }
            }).catch((err) => {
                //console.log(err)
                resolve("err")
            });
        } catch(e) {
            console.log('Error in function', arguments.callee.name, e)
        }
    }))
}

async function getArticles(lang, category, blackList, url) {
    return(new Promise(async (resolve, reject) => {
        try {
            for (var i of url.split('-AND-')) {
                var feed = await parser.parseURL(i)
                var id = 1
                for (var item of feed.items) {
                    await wait(2)
                    if (blackList.indexOf(sha256(item.title) + ".txt") === -1) {
                        var infoArticle = await getMetaData(item.link)
                        if (infoArticle !== "err") {
                            item.author = infoArticle.author
                            item.source = infoArticle.source
                            item.content = infoArticle.content
                            item.img = infoArticle.image
                            item.id = id
                            delete item.guid
                            delete item.contentSnippet
                            fs.writeFileSync("./DB/" + lang + "/" + category + "/" + new Date(item.pubDate).getTime() + "-" + sha256(item.title) + ".txt", JSON.stringify(item))
                            id++
                        }
                    }
                }
            }
            resolve()
        } catch(e) {
            console.log('Error getarticles', e)
            await getArticles(lang, category, blackList, url)
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