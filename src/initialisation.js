var getRss = require('./getRss.js').getRss
var processTwitter = require('./processTwitter.js').processTwitter

var dataInit = require('./manageDB.js')

async function initialisation() {
    return (new Promise(async (resolve, reject) => {
        try {
            dataInit.dataInit()
            //await dataInit.deleteOld()
            if (process.argv[2] === "rss") {
                getRss()
                //processTwitter()
            }

        } catch (e) {
            console.log('Error', e)
        }
    }))
}

exports.initialisation = initialisation