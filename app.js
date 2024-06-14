var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql')
var cors = require('cors');
var indexRouter = require('./routes/index');
var express = require('express')
var session = require('express-session')
var mysqlStore = require('express-mysql-session')(session);
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var crypto = require('crypto');
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
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use(session({
  secret: 'AquaFarm!@#',
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: { 
    secure: false
  }
}));
app.use(passport.authenticate('session'));
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: "http://localhost:3003",
    credentials: true,
  })
);


// 로그인 성공 시 유저 정보 세션에 저장
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
// 로그인 이후 검증 필요한 페이지마다 검사
passport.deserializeUser(function(user, done) {
  console.log('deserial', user)
  db.query('select * from members where id=?', [user],
    function (err, res) {
      if (err) done(err);
      if (!res[0]) done(err);
      var user = res[0];
      done(null, user);
    }
  )
});

app.post('/duplicate', function(req, res) {
  var uid = req.body.uid;
  var val = true;
  db.query('select * from members where id=?', [uid],
    function(err, data) {
      if (err) throw(err);
      if (data[0]) val = false;
      else val = true;
      res.send(val);
    }
  )
})
app.post('/register', function(req, res) {
  var base64crypto = (password) => { return crypto.createHash('sha512').update(password).digest('base64') }
  var level = req.body.level
  var school = req.body.school
  var name = req.body.name
  var number = req.body.number
  var id = req.body.id
  var pw = base64crypto(req.body.pw)

  db.query('insert into members (level, school, name, number, id, pw) values (?, ?, ?, ?, ?, ?);', [Number(level), school, name, Number(number), id, pw], 
    function(err, data) {
      if (err) {
        console.log(err);
        res.write("<script>alert('회원가입에 실패하였습니다. 다시 시도해 주세요.')</script>");
      }
      res.send("<script>alert('회원가입이 완료되었습니다.');location.href='/login';</script>");
    }
  )
})


app.post('/session_login', 
  passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login' }
));

passport.use(new localStrategy(
  {
    usernameField: 'uid',
    passwordField: 'upw'
  },
  function(username, password, done) {
    db.query('select * from members where id=?', [username],
      function (err, res) {
        var base64crypto = (password) => { return crypto.createHash('sha512').update(password).digest('base64') };
        if (err) return done(err);
        if (!res[0]) return done(null, false, { message: 'Incorrect username.' });
        if (res[0].pw !== base64crypto(password)) return done(null, false, { message: 'Incorrect password.' });
        var user = res[0];
        return done(null, user);
      }
    )
  }
));


// 접근 제어 페이지
app.get('/', function (req, res, next) {
  if (req.isAuthenticated()) res.render('index.html');
  else res.status(301).redirect('/login');
});


app.get('/session', function(req, res) {
  var data = [];
  if (req.isAuthenticated()) {
    data.push({
      auth: req.isAuthenticated(),
      name: req.user.name,
      id: req.user.id,
      level: req.user.level,
      number: req.user.number,
      school: req.user.school
    });
  }
  else data.push({auth: req.isAuthenticated()});
  res.send(data);
});


app.post('/session_logout', function(req, res) {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/login');
    });
  });
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
