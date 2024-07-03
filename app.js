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
var flash = require('connect-flash');

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
app.use(flash());


app.use('/', indexRouter);
require('./lib/passport')(passport, options);

// 아이디 중복 검사 및 회원가입
app.post('/duplicate', function(req, res) {
  var uid = req.body.uid;
  var level = req.body.level;
  var val = true;

  if (level == 1) {
    db.query('select * from members_temp where id=?' , [uid],
      function(err, data) {
        if (err) throw(err);
        if (data[0]) val = false;
      }
    )
  }
  if (val == false) res.send(val)
  else {
    db.query('select * from members where id=?', [uid],
      function(err, data) {
        if (err) throw(err);
        if (data[0]) val = false;
        res.send(val);
      }
    )
  }
})
app.post('/register', function(req, res) {
  var base64crypto = (password) => { return crypto.createHash('sha512').update(password).digest('base64') }
  var level = req.body.level;
  var school = req.body.school;
  var name = req.body.name;
  var grade = req.body.grade;
  var classNum = req.body.class;
  var number = req.body.number
  var id = req.body.id
  var pw = base64crypto(req.body.pw)
  var today = new Date();
  var date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var q = ['members', 'members_temp']

  db.query(`insert into ${q[level]} (level, school, name, grade, class, number, id, pw, date) values (?, ?, ?, ?, ?, ?, ?, ?, ?);`, 
    [Number(level), school, name, Number(grade), Number(classNum), Number(number), id, pw, date], 
    function(err, data) {
      if (err) {
        console.log(err);
        res.send("<script>alert('회원가입에 실패하였습니다. 다시 시도해 주세요.'); location.href='/register';</script>");
      } else {
        if (level == 0) res.send("<script>alert('회원가입이 완료되었습니다.');location.href='/login';</script>");
        else res.send("<script>alert('회원가입 신청이 완료되었습니다.\\n\\n회원가입 승인 후 로그인이 가능합니다.');location.href='/login';</script>");
      }
    }
  )
})


// app.post('/session_login', 
//   passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login', failureFlash: true, }
// ));
app.post("/session_login", (req, res) => {
  passport.authenticate("local",
      (err, user, options) => {
        if (user) {
          req.login(user, (error)=>{
            if (error) res.send(error);
            else res.redirect("/");
          });
        } else res.send("<script>alert('로그인에 실패하였습니다. 다시 시도해 주세요.'); location.href='/login';</script>");
  })(req, res)
});
app.get('/session', function(req, res) {
  var data = [];
  if (req.isAuthenticated()) {
    data.push({
      auth: req.isAuthenticated(),
      id: req.user.id,
      level: req.user.level,
      school: req.user.school,
      name: req.user.name,
      grade: req.user.grade,
      class: req.user.class,
      number: req.user.number,
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
  let userLevel = req.body.userLevel;
  let level = req.body.level;
  let school = req.body.school;
  let grade = req.body.grade;
  let classNum = req.body.class;
  let name = req.body.name;
  let start = req.body.start;
  let end = req.body.end;
  let sql = '';
  let data = null;
  
  if (userLevel == 1) {
    sql = `select * from members where id not in (?) and school like ? and level like ? and name like ? and grade=? and class=?`
    data = [ req.user.id, '%'+school+'%', '%'+level+'%', '%'+name+'%', grade, classNum]
  }
  else {
    sql = `select * from members where id not in (?) and school like ? and level like ? and name like ?`
    data = [ req.user.id, '%'+school+'%', '%'+level+'%', '%'+name+'%']
  }
  if (start == end) sql += ` and date='${end}'`
  else if (start != '' && start != undefined) sql += ` and date between str_to_date('${start}', '%Y-%m-%d') and str_to_date('${end}', '%Y-%m-%d')`
  console.log(sql);
  db.query(sql, data,
    function(err, data) {
      if(err) throw(err);
      else {
        let val = [];
        if (data.length == 0) res.send(null);
        else {
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
        }
      };
    }
  )
})

app.post('/members_temp', function(req, res) {
  db.query('select * from members_temp', function(err, data) {
    if(err) throw(err);
    else {
      let datas = [];
      $.each(data, function(i, v) {
        datas.push({
          id: v.id,
          level: v.level,
          school: v.school,
          name: v.name,
          grade: v.grade,
          class: v.class,
          number: v.number,
          date: v.date
        })
        if (data.length - 1 == i) res.send(datas);
      })
    }
  })
})

app.post('/members_temp_suc', function(req, res) {
  var id = req.body.id;
  var today = new Date();
  var date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

  db.query('select * from members_temp where id=?;', [id],
    function(err, data) {
      if(err) throw(err);
      db.query('insert into members(level, school, name, grade, class, number, id, pw, date) values(?, ?, ?, ?, ?, ?, ?, ?, ?);', 
      [Number(data[0].level), data[0].school, data[0].name, Number(data[0].grade), Number(data[0].class), Number(data[0].number), data[0].id, data[0].pw, date],
        function(err, data) {
          if(err) throw(err);
          db.query('delete from members_temp where id=?;', [id], 
            function(err, data) { if(err) throw(err); }
          )
          res.send('회원가입 승인이 완료되었습니다.');
        }
      )
    }
  )
})
app.post('/members_temp_del', function(req, res) {
  var id = req.body.id;

  db.query(`delete from members_temp where id=?;`, [id], 
    function(err, data) {
      if(err) throw(err);
      res.send('회원 삭제가 완료되었습니다.');
    }
  )
})
app.post('/members_del', function(req, res) {
  var id = req.body.id;

  db.query(`delete from members where id=?;`, [id], 
    function(err, data) {
      if(err) throw(err);
      res.send('회원 삭제가 완료되었습니다.');
    }
  )
})

app.post('/modify_profile', function(req, res) {
  var base64crypto = (password) => { return crypto.createHash('sha512').update(password).digest('base64') }
  let pw = base64crypto(req.body.pw);
  let id = req.user.id;
  let school = req.body.school;
  let name = req.body.name;
  let grade = req.body.grade;
  let classNum = req.body.class;
  let number = req.body.number;

  db.query('update members set school=?, name=?, grade=?, class=?, number=?, pw=? where id=?', 
    [school, name, grade, classNum, number, pw, id], function(err, data) {
      if(err) {
        res.send("회원정보수정에 실패했습니다.");
        throw(err);
      } else res.send("<script>alert('회원정보수정이 완료되었습니다.');location.href='/modify_profile';</script>");
    })
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
