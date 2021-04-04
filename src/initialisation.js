const getRss = require('./getRss.js').getRss
const processTwitter = require('./processTwitter.js').processTwitter
const processReddit = require('./processReddit.js').processReddit
const dataInit = require('./manageDB.js')

async function initialisation() {
    return (new Promise(async (resolve, reject) => {
        try {
            dataInit.dataInit()
            //await dataInit.deleteOld()
            if (process.argv[2] === "prod") {
                console.log("PRODUCTION\n\n")
                //getRss()
                //processTwitter()
                processReddit()
            }

        } catch (e) {
            console.log('Error', e)
        }
    }))
}

exports.initialisation = initialisation