const TwitterClient = require('twitter-api-client').TwitterClient
const configTwitter = require('../configuration/twitterConfig.json')
const twitterClient = new TwitterClient(configTwitter);

async function start() {
    return (new Promise(async (resolve, reject) => {
        try {
            var big = 0
            var best = 0
            var data = await twitterClient.tweets.search({ "q": "Política", "lang": "pt" });
            console.log(data)
            for (var i of data.statuses) {
                var actuBig = i.retweeted_status ? i.retweeted_status.retweet_count : i.retweeted_status
                if (big < actuBig) {
                    big = actuBig
                    best = i
                }
            }
            console.log(best, "https://twitter.com/" + best.user.screen_name + "/status/" + best.id_str)

        } catch (e) {
            console.log('Error in function', arguments.callee.name, e)
        }
    }))
}

start()

