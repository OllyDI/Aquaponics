var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var expressSession = require('express-session');
var passport = require('passport')
var localStrategy = require('passport-local').Strategy;

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use(passport.initialize());
app.use(passport.session());

// app.use('/users', usersRouter);

app.use(cookieParser());
app.use(
  expressSession({
    secret: "aqufarm",
    resave: false,
    saveUninitialized: false,
  })
);

app.post('/session/login', 
  passport.authenticate('local', {successRedirect: '/', failureRedirect: '/members/login' }
));


passport.use(new localStrategy(
  {
    uid: 'id',
    upw: 'pw'
  },
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      // 검사 중 에러
      if (err) { return done(err); }

      // 아이디 에러
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      // 패스워드 에러
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      //성공
      return done(null, user);
    });
  }
));


passport.use(new LocalStrategy(
	//verify callback 함수
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }

			// 아이디 없음
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

			// 비밀번호 틀림
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }

			// 성공
      return done(null, user);
    });
  }
));

// 로그인 성공 시 유저 정보 세션에 저장
passport.serializeUser(function(user, done) {
  done(null, user,id);
});
// 로그인 이후 검증 필요한 페이지마다 검사
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


app.get('/session/logout', function(req, res) {
  req.logout();
  req.session.save((err) => {
    res.redirect('/members/login');
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
