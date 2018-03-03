var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');

var index = require('./server/routes/index');
var users = require('./server/routes/users');

// 코멘트 컨트로러 불러오기
var comments = require('./server/config/controller/comments');

// 몽고 디비 ODM
var mongoose = require('mongoose');
// 세션 저장용 모듈 ( 로그인 후 유저정보를 세션에 저장하기 위해 사용하는 모듈 )
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
// 패스포트와 경고 플래시 모듈
var passport = require('passport'); // 인증 미들웨어
var flash = require('connect-flash');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'server/views/pages'));

// resolver와 같은 개념
app.set('view engine', 'ejs');

// 몽고 DB 설정
var config = require('./server/config/config.js');
mongoose.connect(config.url);
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Make Sure MongoDB is running.');
});

// passport 설정
require('./server/config/passport')(passport);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// passport용
// 세션 비밀키
app.use(session({
  secret: 'sometextgohere',
  saveUninitialized: true,
  resave: true,
  // express-session과 connect-mongo를 이용해 MongoDB에 세션 저장
  store: new MongoStore({
    url: config.url,
    collection : 'sessions'
  })
}));
// 패스포트 인증 초기화
app.use(passport.initialize());
// 영구적인 로그인 세션
app.use(passport.session());
// 플래시 메시지
app.use(flash());

app.use('/', index);
app.use('/users', users);

app.get('/comments', comments.hasAuthorization, comments.list);
app.post('/comments', comments.hasAuthorization, comments.create); // path, condition, callback

// catch 404 and forward to error handler ( 404 에러가 발생되면 에러 핸들러에 전송 )
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

module.exports = app;

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
