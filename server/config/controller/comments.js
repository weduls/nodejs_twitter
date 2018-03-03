// gravatar 아이콘 얻기
var gravatar = require('gravatar');
// 코멘트 모델 가져오기
var Comments = require('../model/comments');

// 코멘트 목록
exports.list = (req, res) => {
  // 코멘트 전체 목록을 날짜별로 정렬하기
  Comments.find().sort('-created').populate('user', 'local.email').
    exec((error, comments) => {
      console.log(comments);
      if (error) {
        return res.send(400, {
          message: error
        });
      }
      // 결과 렌더링 하기
      res.render('comments', {
        titile: 'Comments Page',
        comments : comments,
        gravatar: gravatar.url(comments.email, {s: '80', r: 'x', d: 'retro'}, true)
      });
    });
};

// 코멘트 작성
exports.create = (req, res) => {
  // request body를 가진 코멘트 모델 생성하기
  var comments = new Comments(req.body);

  // id 설정
  comments.user = req.user;
  // 수신 데이터 저장
  comments.save((error) => {
    if(error) {
      return res.send(400, {
        message: error
      });
    }

    // 코멘트 페이지로 리다이렉트 하기
    res.redirect('/comments');
  });
};

// 코멘트 인증 미들웨어
exports.hasAuthorization = (req, res, next) => {
  if (req.isAuthenticated()) {
    // next는 다음 작업을 진행하는 callback 함수
    return next();
  }
  res.redirect('/login');
};
