const fs = require('fs')
const Parser = require('rss-parser');
const parser = new Parser();
const popeyelib = require('popeyelib')
const cheerio = require('cheerio');
const wait = popeyelib.wait
const sha256 = require('sha256');
const { extract } = require('article-parser');
var processAudio = require('./processAudio.js').processAudio

async function getMetaData(link) {
    return (new Promise(async (resolve, reject) => {
        try {
            console.log("Get Metadata ", new URL(link).origin)
            extract(link)
                .then((article) => {
                    if (article && article.image) {
                        const $ = cheerio.load(article.content)
                        $('img').each(function (i, elem) {
                            if (!elem.attribs.src) {
                                $(this).replaceWith("");
                            }
                        });
                        resolve(article)
                    } else {
                        console.log("No image or article")
                        resolve("err")
                    }
                }).catch((err) => {
                    console.log("Error parsing", "err")
                    resolve("err")
                });
        } catch (e) {
            console.log('Error in function', arguments.callee.name, e)
        }
    }))
}

async function getArticles(lang, category, blackList, url) {
    return (new Promise(async (resolve, reject) => {
        try {
            for (var i of url.split('-AND-')) {
                console.log("\n\n\n\nParse", lang, category)
                var feed = await parser.parseURL(i)
                var id = 1
                for (var item of feed.items) {
                    let dateNow = JSON.stringify(new Date()).split('T')[0].replace('"', "")
                    let dateArticle = item.isoDate.split('T')[0]
                    if (dateNow === dateArticle) {
                        //console.log("\nParse Article", item.link)
                        if (blackList.indexOf(sha256(item.title) + ".txt") === -1) {
                            var infoArticle = await getMetaData(item.link)
                            if (infoArticle !== "err") {
                                delete item.guid
                                delete item.contentSnippet
                                item.author = infoArticle.author
                                item.source = infoArticle.source
                                item.content = infoArticle.content
                                item.img = infoArticle.image
                                item.id = id
                                var nameFile = new Date(item.pubDate).getTime() + "-" + sha256(item.title)
                                item.sound = "/v1/getSound/" + lang + "/" + category + "/" + nameFile + ".mp3"
                                processAudio(item, lang)
                                fs.writeFileSync("./DB/" + lang + "/" + category + "/" + nameFile + ".txt", JSON.stringify(item))
                                id++
                            }
                        }
                    }
                }
            }
            resolve()
        } catch (e) {
            console.log('Error getarticles', e)
            await getArticles(lang, category, blackList, url)
            resolve()
        }
    }))
}

async function getOldArticles(lang, j) {
    return (new Promise(async (resolve, reject) => {
        try {
            if (!fs.existsSync("./DB/" + lang))
                fs.mkdirSync("./DB/" + lang);
            if (!fs.existsSync("./DB/" + lang + "/" + j))
                fs.mkdirSync("./DB/" + lang + "/" + j)
            if (!fs.existsSync("./DBAUDIO/" + lang))
                fs.mkdirSync("./DBAUDIO/" + lang);
            if (!fs.existsSync("./DBAUDIO/" + lang + "/" + j))
                fs.mkdirSync("./DBAUDIO/" + lang + "/" + j)
            var blackList = []
            for (var i of fs.readdirSync("./DB/" + lang + "/" + j)) {
                blackList.push(i.split('-')[1])
            }
            resolve(blackList)
        } catch (e) {
            console.log('Error', e)
        }
    }))
}

async function getRss() {
    return (new Promise(async (resolve, reject) => {
        try {
            if (fs.readdirSync('./tempAudio').length !== 0) {
                for (var i of fs.readdirSync('./tempAudio')) {
                    fs.unlinkSync("./tempAudio/" + i, { recursive: true });
                }
            }
            for (var i of fs.readFileSync('./configuration/langueList.txt', "UTF-8").split('\n')) {
                for (var j of fs.readFileSync('./configuration/categories/' + i + ".txt", "UTF-8").split('\n')) {
                    var lang = i.split('_')
                    var blackList = await getOldArticles(lang[1], j.split("_")[0])
                    await getArticles(lang[1], j.split("_")[0], blackList, j.split("_")[1])
                }
            }
            await wait(100000)
            getRss()
        } catch (e) {
            console.log('Error', e)
        }
    }))
}

exports.getRss = getRss