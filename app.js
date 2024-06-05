var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql')
var cors = require('cors');
var indexRouter = require('./routes/index');

var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
var mysqlStore = require('express-mysql-session')(session);
var passport = require('passport')
var localStrategy = require('passport-local').Strategy;

var app = express();

const options = {
  host: 'ollyc.iptime.org', 
  port: '15007',
  user: 'aqua',
  password: '1518',
  database: 'aqufarm'
}

const db = mysql.createConnection(options);
const sessionStore = new mysqlStore(options);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use(cookieParser());

app.use(session({
  secret: 'AquaFarm!@#',
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: { 
    secure: false
  }
}));
app.use(passport.initialize());
app.use(passport.session());


// 로그인 성공 시 유저 정보 세션에 저장
passport.serializeUser(function(user, done) {
  console.log('serial', user)
  done(null, user.id);
});
// 로그인 이후 검증 필요한 페이지마다 검사
passport.deserializeUser(function(user, done) {
  console.log('deserial', user)
  db.query('select * from members where id=?', [user.id],
    function (err, res) {
      if (err) done(err);
      if (!res[0]) done(err);
      var user = res[0];
      done(null, user);
    }
  )
});


app.post('/session_login', 
  passport.authenticate('local', {successRedirect: '/', failureRedirect: '/members/login' }
));

passport.use(new localStrategy(
  {
    usernameField: 'uid',
    passwordField: 'upw'
  },
  function(username, password, done) {
    db.query('select * from members where id=?', [username],
      function (err, res) {
        if (err) return done(err);
        if (!res[0]) return done(null, false, { message: 'Incorrect username.' });
        if (res[0].pw !== password) return done(null, false, { message: 'Incorrect password.' });
        var user = res[0];
        return done(null, user);
      }
    )
  }
));

app.get('/session_logout', function(req, res) {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect('/members/login');
  })
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
