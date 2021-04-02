const fs = require('fs')
const sha256 = require('sha256')
const popeyelib = require('popeyelib')
const wait = popeyelib.wait
const TwitterClient = require('twitter-api-client').TwitterClient
const configTwitter = require('../configuration/twitterConfig.json')
const twitterClient = new TwitterClient(configTwitter);
const processAudio = require('./processAudio.js').processAudio

var idCounter = 0

const setupLang = {
    "French": "fr",
    "German": "de",
    "Italian": "it",
    "Spanish": "es",
    "Portuese": "pt",
    "English": "en"
}

async function getBestTwitterPost(lang, country, querry) {
    return (new Promise(async (resolve, reject) => {
        try {
            console.log("Get Best Twitter Post", lang, querry)
            var querrySearch = querry.replace(/\-/g, " ")
            var big = 0
            var best = 0
            var bl = []
            var listPost = []

            var data = await twitterClient.tweets.search({ "q": querrySearch, "lang": setupLang[country], "result_type": "popular", "count": "100", tweet_mode: "extended" });
            if (data.statuses.length === 0)
                data = await twitterClient.tweets.search({ "q": querrySearch, "lang": setupLang[country], "count": "100" });

            for (var index = 0; index < 5; index++) {
                for (var i of data.statuses) {
                    if (i.retweeted_status)
                        continue
                    if (big <= i.favorite_count && bl.indexOf(i.id_str) === -1) {
                        big = i.favorite_count
                        best = i
                    }
                }
                if (best !== 0) {
                    bl.push(best.id_str)
                    listPost.push(best)
                    big = 0
                    best = 0
                }
            }
            //console.log(listPost)
            if (!listPost.length) {
                console.log("NOT FOUND", lang, querrySearch, country, setupLang[country])
                return (resolve())
            }
            var item = {}
            var twitterText = querry + " news on twitter. "
            item.content = "<h1>Last " + querry + " news on twitter on " + listPost[0].created_at + "</h1>"
            for (var i of listPost) {
                var res = await twitterClient.tweets.statusesLookup({ id: i.id_str, include_ext_alt_text: true, tweet_mode: "extended" })
                twitterText += "Tweeter name ." + i.user.screen_name + ". " + res[0].full_text
                item.content += + "<h3>" + res[0].full_text + "</h3>" + '<div class="tweet" tweetID="' + i.id_str + '"></div><br/>'
            }
            twitterText = twitterText.replace(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g, "")
            item.title = listPost[0].text.split('.')[0]
            item.link = "https://twitter.com/" + listPost[0].user.screen_name + "/status/" + listPost[0].id_str
            item.pubDate = listPost[0].created_at
            item.isoDate = new Date(listPost[0].created_at)
            item.author = "@" + listPost[0].user.screen_name
            item.source = "Twitter"
            item.img = "https://api.fluidy.new/v1/FluidyTwitter.jpg"
            item.id = idCounter
            var nameFile = new Date(item.pubDate).getTime() + "-" + sha256(item.title)
            item.sound = "/v1/getSound/" + country + "/" + querry + "/" + nameFile + ".mp3"
            await processAudio(twitterText, item.sound, country)
            console.log("./DB/" + country + "/" + querry + "/" + nameFile + ".txt")
            fs.writeFileSync("./DB/" + country + "/" + querry + "/" + nameFile + ".txt", JSON.stringify(item))
            idCounter++
            resolve()
        } catch (e) {
            if (e.statusCode === 429) {
                console.log("Ban Twitter wait 30 secondes")
                await wait(30000)
                await getBestTwitterPost(lang, country, querry)
                resolve()
            } else {
                console.log('Error in function', arguments.callee.name, e)
            }
        }
    }))
}

async function processTwitter() {
    return (new Promise(async (resolve, reject) => {
        try {
            for (var i of fs.readdirSync('./configuration/categories')) {
                const listQuerries = fs.readFileSync('./configuration/categories/' + i, "utf-8").split('\n')
                for (var j of listQuerries) {
                    if (i.split(':')[0].toLowerCase() !== "de") {
                        await getBestTwitterPost(i.split(':')[0].toLowerCase(), i.split('_')[1].split('.txt')[0], j.split('_')[0])
                        await wait(1000000)

                    }
                }
            }
        } catch (e) {
            console.log('Error in function', arguments.callee.name, e)
        }
    }))
}

exports.processTwitter = processTwitter