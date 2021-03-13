var getRss = require('./getRss.js').getRss
var dataInit = require('./manageDB.js').dataInit

async function initialisation() {
    return (new Promise(async (resolve, reject) => {
        try {
            dataInit()
            //await deleteOld()
            //getRss()

        } catch (e) {
            console.log('Error', e)
        }
    }))
}

exports.initialisation = initialisation