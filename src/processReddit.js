const fs = require('fs')
const sha256 = require('sha256')
const popeyelib = require('popeyelib')
const wait = popeyelib.wait
const configReddit = require('../configuration/redditConfig.json')
const processAudio = require('./processAudio.js').processAudio
const snoowrap = require('snoowrap');
const reddit = new snoowrap(configReddit);

var idCounter = 0


const setupLang = {
    "French": "fr",
    "German": "de",
    "Italian": "it",
    "Spanish": "es",
    "Portuese": "pt",
    "English": "en"
}

async function getBestRedditPost(lang, country, query) {
    return (new Promise(async (resolve, reject) => {
        try {
            var querySearch = query.replace(/\-/g, " ")
            var data = []
            var big = 0
            var best = 0
            var bl = []
            var listPost = []
            console.log("START REDDIT", lang, country, query)
            await reddit.search({ query: querySearch, sort: "new", limit: 50 }).then(post => {
                data = post
            })
            for (var index = 0; index < 5; index++) {
                for (var i of data) {
                    if (big <= i.ups && bl.indexOf(i.id) === -1) {
                        big = i.ups
                        best = i
                    }
                }
                if (best !== 0) {
                    bl.push(best.id)
                    listPost.push(best)
                    big = 0
                    best = 0
                }
            }
            if (!listPost.length) {
                console.log("NOT FOUND REDDIT", lang, querySearch, country, setupLang[country])
                return (resolve())
            }

            var item = {}
            var redditText = query + " news on reddit. "
            item.content = "<h1>Last " + query + " news on reddit on " + new Date(listPost[0].created_utc) + "</h1>"
            for (var i of listPost) {
                var limitRedditText = ""
                var cc = 0
                for (var j of i.selftext.split('.')) {
                    if (cc < 5)
                        limitRedditText = limitRedditText + j + "."
                    cc++
                }
                redditText += " Reddit name. " + i.author.name + ". " + limitRedditText
                item.content += "<h3>" + i.title + "</h3>\n" + `<blockquote class="reddit-card" ><a href="https://www.reddit.com/` + i.id + `">` + i.selftext_html + `</a> from <a href="http://www.reddit.com/` + i.subreddit_name_prefixed + `">` + i.subreddit.display_name + `</a></blockquote>`
            }
            redditText = redditText.replace(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g, "")
            item.title = listPost[0].title
            item.link = "https://reddit.com/" + listPost[0].id
            item.pubDate = new Date(listPost[0].created_utc)
            item.isoDate = new Date(listPost[0].created_utc)
            item.author = "u/" + listPost[0].author.name
            item.source = "Reddit"
            item.img = "https://api.fluidy.new/v1/FluidyReddit.jpg"
            item.id = idCounter
            var nameFile = new Date(item.pubDate).getTime() + "-" + sha256(item.title)
            item.sound = "/v1/getSound/" + country + "/" + query + "/" + nameFile + ".mp3"
            await processAudio(redditText, item.sound, country)
            fs.writeFileSync("./DB/" + country + "/" + query + "/" + nameFile + ".txt", JSON.stringify(item))
            idCounter++
            resolve()
        } catch (e) {
            console.log('Error in function', arguments.callee.name, e)
        }
    }))
}

async function processReddit() {
    return (new Promise(async (resolve, reject) => {
        try {
            for (var i of fs.readdirSync('./configuration/categories')) {
                const listQuerries = fs.readFileSync('./configuration/categories/' + i, "utf-8").split('\n')
                for (var j of listQuerries) {
                    if (i.split(':')[0].toLowerCase() !== "de") {
                        await getBestRedditPost(i.split(':')[0].toLowerCase(), i.split('_')[1].split('.txt')[0], j.split('_')[0])
                    }
                }
            }
        } catch (e) {
            console.log('Error in function', arguments.callee.name, e)
        }
    }))
}

exports.processReddit = processReddit