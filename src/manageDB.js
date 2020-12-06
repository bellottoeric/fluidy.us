var fs = require('fs')
var popeyelib = require('popeyelib')
var wait = popeyelib.wait

var all = {}

async function dataInit() {
    return(new Promise(async (resolve, reject) => {
        try {
            //all.langNumber = fs.readdirSync("./DB/").length
            if (!all.categories)
                all.categories = {}
            for (var i of fs.readdirSync("./DB")) {
                all.categories[i] = fs.readdirSync("./DB/" + i)
            }
            for (var i in all.categories) {
                for (var j of all.categories[i]) {
                    if (fs.existsSync('./DB/' + i + "/" + j)) {
                        if (!all.articles)
                            all.articles = []
                        if (!all.articles[i])
                            all.articles[i] = []
                        if (!all.articles[i][j])
                            all.articles[i][j] = "[" 
                        for (var n of fs.readdirSync('./DB/' + i + "/" + j)) {
                            var content = fs.readFileSync('./DB/' + i + "/" + j + "/" + n, "UTF-8")
                            all.articles[i][j] = all.articles[i][j] + content + ","
                        }
                        all.articles[i][j] = all.articles[i][j] + "]"
                        all.articles[i][j] = all.articles[i][j].replace(/\,\]/, "]")
                    }
                }
            }
            //console.log(all)
            await wait(5000)
            all.u = "555"
        } catch(e) {
            console.log('Error', e)
        }
    }))
}

async function deleteOld() {
    return (new Promise(async (resolve, reject) => {
        try {
            if (fs.readdirSync('DB').length !== 0) {
                for (var i of fs.readdirSync('DB')) {
                    fs.rmdirSync("./DB/" + i, { recursive: true });
                }
            }
            resolve()
        } catch (e) {
            console.log('Error', e)
        }
    }))
}

exports.deleteOld = deleteOld 
exports.dataInit = dataInit 
exports.all = all 