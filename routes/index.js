var express = require('express');
var router = express.Router();
var path = require("path")

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.sendFile(path.join(__dirname, "../views/index.html"));
// });

router.get('/login', function(req, res, next) {
  res.sendFile(path.join(__dirname, "../views/members/login.html"));
});

router.get('/register', function(req, res, next) {
  res.sendFile(path.join(__dirname, "../views/members/register.html"))
});

router.get('/forgot_id', function(req, res, next) {
  res.sendFile(path.join(__dirname, "../views/members/forgot_id.html"))
});

router.get('/forgot_pw', function(req, res, next) {
  res.sendFile(path.join(__dirname, "../views/members/forgot_pw.html"))
});

module.exports = router;