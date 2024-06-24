var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql')
var cors = require('cors');
var express = require('express')
var session = require('express-session')
var mysqlStore = require('express-mysql-session')(session);
var passport = require('passport');
var app = express();
var indexRouter = require('./routes/index');
var crypto = require('crypto');

const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);

var fs = require('fs');
var txt = fs.readFileSync('lib/db.txt').toString().replace(/\r/g, "").split('\n');
const options = {
  host: txt[0], 
  port: txt[1],
  user: txt[2],
  password: txt[3],
  database: txt[4]
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

// session settings
app.use(session({
  secret: txt[5],
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: { 
    httpOnly: true,
    secure: false,
    maxAge: 30 * 60 * 1000 // 1000: 1초 -> 30분
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


app.use('/', indexRouter);
require('./lib/passport')(passport, options);

// 아이디 중복 검사 및 회원가입
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
  var level = req.body.level;
  var school = req.body.school;
  var name = req.body.name;
  var grade = req.body.grade;
  var classNUm = req.body.class;
  var number = req.body.number
  var id = req.body.id
  var pw = base64crypto(req.body.pw)
  var q = ['members', 'members_temp']

  db.query(`insert into ${q[level]} (level, school, name, grade, class, number, id, pw) values (?, ?, ?, ?, ?, ?, ?, ?);`, 
    [Number(level), school, name, Number(grade), Number(classNUm), Number(number), id, pw], 
    function(err, data) {
      if (err) {
        console.log(err);
        res.send("<script>alert('회원가입에 실패하였습니다. 다시 시도해 주세요.'); location.href='/register';</script>");
      } else {
        if (level == 0) res.send("<script>alert('회원가입이 완료되었습니다.');location.href='/login';</script>");
        else res.send("<script>alert('회원가입 신청이 완료되었습니다.\n회원가입 승인 후 로그인이 가능합니다.');location.href='/login';</script>");
      }
    }
  )
})


app.post('/session_login', 
  passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login' }
));
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
      delete req.session;
      res.clearCookie('connect.sid');
      res.redirect('/login');
    });
  });
});


app.post('/get_device', function(req, res) {
  let id = req.body.id;
  
  db.query('select * from link where user_id=?', [id],
    function(err, data) {
      if (err) throw(err);
      res.send(data);
    }
  )
});

app.post('/searchTable', function(req, res) {
  let school = req.body.school;
  let level = req.body.level;
  let name = req.body.name;
  let start = req.body.start;
  let end = req.body.end;
  let sql = `select * from members where school like ? and level like ? and name like ?`
  if (start != '' && start != undefined) sql += ` and date>=str_to_date('${start}', '%Y-%m-%d')`
  if (end != '' && end != undefined) sql += ` and date<=str_to_date('${end}', '%Y-%m-%d')`

  db.query(sql, [ '%'+school+'%', '%'+level+'%', '%'+name+'%'],
    function(err, data) {
      if (err) throw(err);
      else {
        let val = [];
        $.each(data, function(i, v) {
          val.push({
            id: v.id,
            level: v.level,
            school: v.school,
            name: v.name,
            grade: v.grade,
            class: v.class,
            number: v.number,
            date: v.date
          })
          if (data.length - 1 == i) res.send(val);
        })
      };
    }
  )
})


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
