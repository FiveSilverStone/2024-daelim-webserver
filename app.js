const path = require('path')
// Express 모듈을 불러옵니다.
const express = require('express');
const { request } = require('http');
const { resourceUsage } = require('process');

// Express 애플리케이션을 생성합니다.
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');

// 기본 포트를 설정하거나 3000 포트를 사용합니다.
const PORT = process.env.PORT || 3000;

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(session({
  secret: '임의의_비밀키',
  resave: false,
  saveUninitialized: false,
}));
app.use(bodyParser.json())

const users = [
  {id: "hong", name: '홍길동', pwd: '1234'},
  {id: "kim", name: '김길동', pwd: '1234'},
  {id: "so", name: '소길동', pwd: '1234'},
  {id: "na", name: '나길동', pwd: '1234'},
];

// 루트 경로 ('/')에 대한 GET 요청을 처리합니다.
app.get('/user', (req, res) => {
  const {id} = req.query;

  if(id){
    const resultUser = users.find((userData) => {
      return userData.id === id
    });
    
    if(resultUser) {
      res.send(resultUser);
    }else {
      res.status(400).send('해당 사용자를 찾을 수 없습니다.');
    }
  }else{
    res.send(users);
  }  
});

app.get('/session/logout', (req, res) => {
  req.session.destroy();
  res.send('로그아웃 성공');
});

app.post('/session/login', (req, res) => { 
  const { id, pwd } = req.body;
  const user = users.find(user => user.id === id && user.pwd === pwd);

  if (user) {
    req.session.user = {id: user.id, name: user.name};
    res.send('로그인 성공');
  } else {
    res.status(401).send('로그인 실패');
  }
});

app.post('/user', (req, res) => {
  const { id, name, pwd } = req.body;
  
  // 받은 데이터 처리...
  const resultUser = users.find((userData) => {
    return userData.id === id
  });

  if(resultUser) {
    res.status(400).send('이미 있는 사용자입니다');
  }else{
    if(pwd.length >= 8) {
      res.json({ message: `${id},${name},${pwd}를 받았습니다.` });
    } else {
      res.status(400).send('pwd가 너무 짧습니다. (8자 이상)');
    }
  }
  });

app.put('/user', (req, res) => {
  const {id,name,pwd} =req.body;
  const existingUser = users.find(user => user.id === id);
  if(!existingUser) {
    return res.status(400).send({message:'해당 사용자는 존재하지 않습니다'})
  }
  if(pwd && pwd.length < 8) {
    return res.status(400).send({message : '비밀번호는 8자리 이상'})
  }
  if(name) {
    existingUser.name = name;
  }
  if(pwd) {
    existingUser.pwd = pwd;
  }
  res.json('업데이트');
});

app.delete('/user', (req, res) => {
  res.send('유저 삭제')
});



// 서버를 설정한 포트에서 실행합니다.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
