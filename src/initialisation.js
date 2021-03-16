var getRss = require('./getRss.js').getRss
var dataInit = require('./manageDB.js')

async function initialisation() {
    return (new Promise(async (resolve, reject) => {
        try {
            dataInit.dataInit()
            //await dataInit.deleteOld()
            //getRss()

        } catch (e) {
            console.log('Error', e)
        }
    }))
}

exports.initialisation = initialisation