const fs = require('fs')
const popeyelib = require('popeyelib')
const wait = popeyelib.wait

var all = {}

async function dataInit() {
    return (new Promise(async (resolve, reject) => {
        try {
            console.log("DATA INIT manageDB.js")
            await wait(1000)
            all.langNumber = fs.readdirSync("./DB/").length
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
            var newCategories = []
            for (var i in all.categories) {
                newCategories.push({ "lang": i, categories: all.categories[i] })
            }
            all.categories = newCategories
        } catch (e) {
            console.log('Error', e)
        }
    }))
}

async function deleteOld() {
    return (new Promise(async (resolve, reject) => {
        try {
            console.log("DELET OLD manageDB.js")
            await wait(10000)
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