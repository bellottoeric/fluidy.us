var initialisation = require('./src/initialisation.js').initialisation()


async function start(e) {
    return(new Promise(async (resolve, reject) => {
        try {
            initialisation()
        } catch(e) {
            console.log('Error', e)
        }
    }))
}

/*
const express = require('express')
const app = express()

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.listen(3000)*/