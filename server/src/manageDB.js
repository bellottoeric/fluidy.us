var fs = require('fs')
var popeyelib = require('popeyelib')
var wait = popeyelib.wait

function deleteOld() {
    return (new Promise(async (resolve, reject) => {
        try {
            if (fs.readdirSync('DB').length !== 0) {
                for (var i of fs.readdirSync('DB')) {
                    fs.unlinkSync("./DB/" + i)
                }
            }
            resolve()
        } catch (e) {
            console.log('Error', e)
        }
    }))
}

exports.deleteOld = deleteOld 
