var express = require('express');
var router = express.Router();
var path = require("path")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, "../views/index.html"));
});

router.get('/members/login', function(req, res, next) {
  res.sendFile(path.join(__dirname, "../views/members/login.html"));
});

router.get('/members/register', function(req, res, next) {
  res.sendFile(path.join(__dirname, "../views/members/register.html"))
});

module.exports = router;