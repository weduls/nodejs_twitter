// 몽구스와 패스워드 암호화를 위해서 bcrypt를 불러온다.
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// user 모델의 스키마 정의
var userSchema = mongoose.Schema({
  // local strategy  패스워드용 로컬 키
  local: {
    name: String,
    email: String,
    password: String
  }
});

// 패스워드 암호화
userSchema.methods.generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// 패스워드 유효체크
userSchema.methods.validPassword = (password, userPassword) => {
  return bcrypt.compareSync(password, userPassword);
};

// user 모델을 생성하고 앱에 공개(expose)
module.exports = mongoose.model('User', userSchema);
