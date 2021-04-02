var express = require('express')
var router = express.Router()
var all = require('./manageDB.js').all
var fs = require('fs')

router.use(function (req, res, next) {
    next()
})

router.route('/').get(function (req, res) {
    res.send("home route")
})

router.route('/v1/categories').get(function (req, res) {
    res.status(200).json(all.categories)
})

router.route('/v1/articles').get(function (req, res) {
    if (!req.query || !req.query.lang || !req.query.category) {
        res.status(400).json({ "response": "Bad Request" })
    } else {
        if (!all.articles || !all.articles[req.query.lang] || !all.articles[req.query.lang][req.query.category]) {
            res.status(400).json({ "response": "Bad Request" })
        } else {
            var content = JSON.parse(all.articles[req.query.lang][req.query.category].replace(/,\]/g, "]"))
            var resContent = []
            for (var i of content) {
                delete i.content
                resContent.push(i)
            }
            res.status(200).json(resContent)
        }
    }
})

router.route('/v1/article').get(function (req, res) {
    if (!req.query || !req.query.lang || !req.query.category || !req.query.id) {
        res.status(400).json({ "response": "Bad Request" })
    } else {
        if (!all.articles || !all.articles[req.query.lang] || !all.articles[req.query.lang][req.query.category]) {
            res.status(400).json({ "response": "Bad Request" })
        } else {
            var content = JSON.parse(all.articles[req.query.lang][req.query.category].replace(/,\]/g, "]"))
            for (var i of content) {
                if (i.id === Number(req.query.id)) {
                    res.status(200).json(i)
                    return
                }
            }
            res.status(404).json({ "response": "Article not found" })
        }
    }
})

router.route('/v1/getArticles/').get(function (req, res) {
    if (!req.query || !req.query.lang || !req.query.category) {
        res.status(400).json({ "response": "Bad Request" })
    } else {
        if (!all.articles || !all.articles[req.query.lang] || !all.articles[req.query.lang][req.query.category]) {
            res.status(400).json({ "response": "Bad Request" })
        } else {
            var content = JSON.parse(all.articles[req.query.lang][req.query.category].replace(/,\]/g, "]"))
            var resContent = []
            for (var i of content) {
                delete i.content
                resContent.push(i)
            }
            res.status(200).json(resContent)
        }
    }
})

router.route('/v1/getSound/:lang/:category/:nameFile/').get(function (req, res) {
    var audioPath = './DBAUDIO/' + req.params.lang + "/" + req.params.category + "/" + req.params.nameFile
    if (!fs.existsSync(audioPath)) {
        res.status(400).json({ "response": "Bad Request" })
    } else {
        res.writeHead(200, {
            'Content-Type': 'audio/mp3',
            'Content-Length': fs.statSync(audioPath).size
        })
        var readStream = fs.createReadStream(audioPath)
        readStream.pipe(res)
    }
})

router.route('/v1/FluidyLogo.jpg').get(function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'image/jpeg',
        'Content-Length': fs.statSync("./FluidyLogo.jpg").size
    })
    var readStream = fs.createReadStream("./FluidyLogo.jpg")
    readStream.pipe(res)
})

router.route('/v1/FluidyTwitter.jpg').get(function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'image/jpeg',
        'Content-Length': fs.statSync("./FluidyTwitter.jpg").size
    })
    var readStream = fs.createReadStream("./FluidyTwitter.jpg")
    readStream.pipe(res)
})

router.route('*').all(function (req, res) {
    res.status(404).json({
        response: 'Error 404'
    })
})

module.exports = router