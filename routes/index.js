var express = require('express');
var router = express.Router();
var path = require("path")
const { auth } = require('../lib/auth');

/* GET home page. */
router.get('/', auth, function(req, res, next) {
  res.sendFile(path.join(__dirname, "../views/index.html"));
});

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
router.get('/change_pw', function(req, res, next) {
  res.sendFile(path.join(__dirname, "../views/members/change_pw.html"))
});

router.get('/dashboard', auth, function(req, res, next) {
  res.sendFile(path.join(__dirname, "../views/dashboard.html"))
});

router.get('/admin', auth, function(req, res, next) {
  if (req.user.level == 2) res.sendFile(path.join(__dirname, "../views/admin.html"))
});

module.exports = router;