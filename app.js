const fs = require('fs')
const express = require('express')
const cors = require("cors")
const morgan = require("morgan")
const compression = require("compression")
const https = require("https")
const helmet = require("helmet")

const app = express()

const initialisation = require('./src/initialisation.js')
const allRoutes = require('./src/router')

var privateKey = fs.readFileSync('fluidy.us.key', 'utf8');
var certificate = fs.readFileSync('fluidy.us.crt', 'utf8');

app.use(morgan("common"));
app.use(helmet());
app.use(cors());
app.use(compression());

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

var httpsServer = https.createServer({ key: privateKey, cert: certificate }, app);

httpsServer.listen(8443);