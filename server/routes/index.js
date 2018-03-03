var express = require('express');
var router = express.Router();
// passport 모듈
var passport = require('passport');
// 이메일에서 gravatar 아이콘 사용
var gravatar = require('gravatar');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'welcome'});
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login/login', { message: req.flash('loginMessage') });
});

/* POST login page. */
router.post('/login', passport.authenticate('local-login', {
  // 성공하면 프로필 페이지로, 실패하면 로그인 페이지로
  successRedirect : '/profile',
  failureRedirect : '/login',
  failureFlash : true
}));

/* GET join page. */
router.get('/signup', function(req, res, next) {
  res.render('login/signup', { message: req.flash('signupMessage') });
});

/* POST 메서드용 가입 처리 */
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/profile',
  failureRedirect : 'signup',
  failureFlash : true
}));

/* GET profile page. */
router.get('/profile', isLoggedIn, function(req, res, next) {
  res.render('login/profile', { title: 'Profile Page', user: req.user, avatar: gravatar.url(req.user.email, {s: '100', r:'x', d: 'retro'}, true)});
});

// 사용자가 로그인 했는지 확인
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// 로그아웃
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
