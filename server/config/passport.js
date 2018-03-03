// 패프포트 모듈 로드
var LocalStrategy = require('passport-local').Strategy;
// user 모델 가져오기
var User = require('./model/users');

module.exports = (passport) => {
  // 패스포트 초기화
  // 세션을 위한 user 직렬화로써 streagy가 성공되면 user 정보가  deserializeUser의 첫 번째 매개변수로 이동
  // serialize는 user 객체를 전달받아 세션에 저장
  passport.serializeUser((user, done) => {
    // done 의 첫번째는 에러, 두번째는 결과 값, 세번째는 에러 메시지
    done(null, user.id);
  });

  // user 역직렬화 ( 매개변수 user는 serializeUser의 done의 인자 user를 받은 것 )
  // deserializeUser는 실제 서버로 들어온 정보와 실제 DB의 데이터와 비교
  // serialize에서 전달하는 결과값과 파라미터가 맞아야 한다. 위에서 id를 보내니 deserialize 파라미터도 id로 받아야 한다.
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user); // 여기서 user가 req.user가 된다.
    });
  });

  // local strategy 사용
  passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passportField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) {
    if (email) {
      email = email.toLowerCase();
    }

    process.nextTick(function() {
      User.findOne({ 'local.email' : email}, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, req.flash('loginMessage', 'No user found.'));
        }
        if (!user.validPassword(password)) {
          return done(null, false, req.flash('loginMessage', 'Wohh! Wrong password.'));
        } else {
          return done(null, user);
        }
      });
    });
  }));

  passport.use('local-signup', new LocalStrategy({
    // 사용자명과 패스워드의 기본값을 email과 password로 변경
    usernameField: 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) {
   if (email) {
     email = email.toLowerCase();
   }
   // 비동기 처리
   process.nextTick(function() {
     // user가 아직 로그인 하지 않았다면
     if (!req.user) {
       User.findOne({'local.email' : email}, function(err, user) {
         if (err) {
           return done(err);
         }
         // 이메일 중복검사
         if (user) {
           return done(null, false, req.flash('signupMessage', 'Wohh! the email is alrady token.'));
         } else {
           // user 생성
           var newUser = new User();
           newUser.local.name = req.body.name;
           newUser.local.email = email;
           newUser.local.password = newUser.generateHash(password);
           // 데이터 저장
           newUser.save(function(err) {
             if (err) {
               throw err;
             }
             return done(null, newUser);
           });
         }
       });
     } else {
       return done(null, req.user);
     }
   });
 }));
};
