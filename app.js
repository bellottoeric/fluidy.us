const express = require('express')
const app = express()
var initialisation = require('./src/initialisation.js')
const allRoutes = require('./src/router');

async function start(e) {
    return(new Promise(async (resolve, reject) => {
        try {
            initialisation.initialisation()
        } catch(e) {
            console.log('Error', e)
        }
    }))
}

start()

app.use('/', allRoutes);

app.listen(3000)