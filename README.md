��#   n o d e _ j s t w i t t e r  
 
[개발환경]
- node.js, 요맨, express 설치 (요맨과 express는 개발을 도와주는 제네레이터)
- package.js에 있는 항목 npm install로 설치
- 만약 express 제네레이터를 이용해서 처음부터 개발 시작하고 싶은경우 아래 명령어 입력
express --ejs --css sass --git
=> 설명 ) ejs : EJS 엔진 사용, --css sass : 기본값인 일반 CSS 대신 전처리기가 필요한 SASS를 사용, --git : gitignore 생성

[구성]
1. mongoDB를 이용해서 진행
2. Controller(route포함), model, view(ejs)로 분리된 MVC 패턴 적용
3. 세션 관리
4. 사용자 인증 관리는 passport 사용


[실행방법]
1. mongodb 설치
2. mongodb 설치 위치에서 mongod.exe 실행 후 mongo.exe 실행
3. npm start로 실행
