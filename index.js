const express = require('express');
const app = express();
const port = 5000;
const {User} = require('./models/user.js');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const config = require('./config/key')

// application/x-www-form-urlencoded 이렇게 된 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyparser.urlencoded({extended: true}));
// application/json  json타입으로 된 정보를 분석해서 가져올 수 있게 해줌
app.use(bodyparser.json());

mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndexL: true, useFindAndModify:false
}).then(()=>{
    console.log('몽고 잘 연결 됨')
}).catch((error)=>{
    console.log(error);
})

app.get('/', (req, res)=>{
    res.send('helloasfsafasf')
})

app.post('/register', (req,res)=>{
    // 회원가입 할 때 필요한 정보들은 client에서 가져오면
    // 그 정보들을 데이터 베이스에 넣어준다.

    const user = new User(req.body);
    // req.body 에는 아이디나 비밀번호 등 정보가 들어 있음(bodyparser가 있어서 가능)
     
    user.save((err, userInfo)=>{
        if(err){
            return res.json({ success : false, err})
        } return res.status(200).json({ success: true, userInfo});
    })
    // save는 몽고에서 오는 method
})

app.listen(port, ()=>{
    console.log(`Example app listening on port ${port}`)
})