var express = require('express');
var router = express.Router();
var all = require('./manageDB.js').all

router.use(function (req, res, next) {
    next();
});

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
            var content = JSON.parse(all.articles[req.query.lang][req.query.category])
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
            var content = JSON.parse(all.articles[req.query.lang][req.query.category])
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
            var content = JSON.parse(all.articles[req.query.lang][req.query.category])
            var resContent = []
            for (var i of content) {
                delete i.content
                resContent.push(i)
            }
            res.status(200).json(resContent)
        }
    }
})

router.route('*').all(function (req, res) {
    res.status(404).json({
        response: 'Error 404'
    })
})

module.exports = router