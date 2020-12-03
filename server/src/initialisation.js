var getRss = require('./getRss.js').getRss
var deleteOld = require('./manageDB.js').deleteOld

async function initialisation() {
    return(new Promise(async (resolve, reject) => {
        try {
            //await deleteOld()
            getRss()
        } catch(e) {
            console.log('Error', e)
        }
    }))
}

exports.initialisation = initialisation