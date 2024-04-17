const path = require('path')
// Express 모듈을 불러옵니다.
const express = require('express');
const { request } = require('http');
const { resourceUsage } = require('process');

// Express 애플리케이션을 생성합니다.
const app = express();

// 기본 포트를 설정하거나 3000 포트를 사용합니다.
const PORT = process.env.PORT || 3000;

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.json());

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

app.post('/user', (req, res) => {
  const { id, name, pwd } = req.body;
  
  // 받은 데이터 처리...
  const resultUser = users.find((userData) => {
    return userData.id === id
  });

  if(pwd.length < 8) {
    return res.send('pwd가 너무 짧습니다. (8자 이상)');
  }
  
  if(resultUser) {
      return res.send('이미 있는 사용자입니다');
    }

  return res.json({ message: `${id},${name},${pwd}를 받았습니다.` });
  });

app.put('/user', (req, res) => {
  res.send('유저 수정')
});

app.delete('/user', (req, res) => {
  res.send('유저 삭제')
});



// 서버를 설정한 포트에서 실행합니다.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
