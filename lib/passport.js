var mysql = require('mysql')
var localStrategy = require('passport-local').Strategy;
var crypto = require('crypto');
const options = {
    host: 'ollyc.iptime.org', 
    port: '15007',
    user: 'aqua',
    password: '1518',
    database: 'aqufarm'
}
const db = mysql.createConnection(options);

module.exports = function (passport) {
    
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
}
  