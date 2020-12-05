var express = require('express');
var router = express.Router();
var all = require('./manageDB.js').all


router.use(function (req, res, next) {
    next();
});

router.route('/').get(function (req, res) {
    res.send("home route")
    console.log(all)
})

module.exports = router;