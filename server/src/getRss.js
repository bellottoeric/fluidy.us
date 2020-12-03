var fs = require('fs')
const axios = require('axios').default; 
var popeyelib = require('popeyelib')
var wait = popeyelib.wait

async function getGoogleRss(lang, category) {
    return(new Promise(async (resolve, reject) => {
        try {
            axios.get("https://news.google.com/rss/search?q=<your_search>&hl=en-US&gl=US&ceid=US:en")
                .then(function (response) {
                    resolve()
                    console.log(response);
                }).catch(function (error) {
                    
                    console.log(error);
                })
        } catch(e) {
            console.log('Error', e)
        }
    }))
}

function getRss() {
    return(new Promise(async (resolve, reject) => {
        try {
            for (var i of fs.readFileSync('./configuration/langueGoogle.txt', "UTF-8").split('\n')) {
                console.log(i)
                for (var j of fs.readFileSync('./configuration/category/google/' + i + ".txt", "UTF-8").split('\n')) {
                    var lang = i.split('_')
                    console.log(lang, j)
                    await getGoogleRss(lang[0], j)
                }
            }
            //await getBingRss()
            await wait(100000)
            getRss()
        } catch(e) {
            console.log('Error', e)
        }
    }))
}

exports.getRss = getRss