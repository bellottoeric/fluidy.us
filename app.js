const express = require('express')
const cors = require("cors")
const morgan = require("morgan")
const compression = require("compression")
const helmet = require("helmet")

const app = express()

const initialisation = require('./src/initialisation.js')
const allRoutes = require('./src/router')

app.use(morgan("common"));
app.use(helmet());
app.use(cors());
app.use(compression());

async function start(e) {
    return (new Promise(async (resolve, reject) => {
        try {
            initialisation.initialisation()
        } catch (e) {
            console.log('Error', e)
        }
    }))
}

start()

app.use('/', allRoutes)
app.listen(3001)