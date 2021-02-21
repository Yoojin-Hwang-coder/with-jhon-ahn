const express = require('express');
const app = express();
const port = 5000;
const {User} = require('./server/models/user');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const config = require('./server/config/key')
const cookieParser = require('cookie-parser');
const { auth } = require('./server/middleware/auth');



// application/x-www-form-urlencoded 이렇게 된 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyparser.urlencoded({extended: true}));
// application/json  json타입으로 된 정보를 분석해서 가져올 수 있게 해줌
app.use(bodyparser.json());
app.use(cookieParser());

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


// 회원가입 기능!!!!!!!!!!!!!

app.post('/api/user/register', (req,res)=>{
    // 회원가입 할 때 필요한 정보들은 client에서 가져오면
    // 그 정보들을 데이터 베이스에 넣어준다.

    const user = new User(req.body);
    // req.body 에는 아이디나 비밀번호 등 정보가 들어 있음(bodyparser가 있어서 가능)
     
    user.save((err, userInfo)=>{
        if(err){
            return res.json({ success : false, err})
        } return res.status(200).json({ success: true, userInfo});
    })
    // save는 몽구스에서 오는 method
})


// 로그인기능!!!!!!!!!!!

app.post('/api/user/login', (req, res)=>{

    // 요청된 아이디를 데이터베이스에 있는지 찾는다
    User.findOne({ email: req.body.email}, (err, userInfo)=>{
        if(!userInfo){
            return res.json({
                loginSuccess: false,
                message : "제공된 아이디에 해당하는 유저가 없습니다."
            })
    }

    
   // 아이디가 데이터베이스테 있다면 비밀번호가 맞는지도 확인한다
   userInfo.comparePassword (req.body.password, (err, isMatch)=>{
    if(!isMatch)
        return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."})
    })


     // 비밀번호까지 맞다면 토큰을 생성한다
    userInfo.maketoken((err, userInfo)=>{
    if(err) return res.status(400).send(err);
    
        // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지등 원하는 곳에 해도됨
        //  (지금은 쿠키에 저장하기 위해 cookieParser 라이브러리 사용 )
        res.cookie("x_auth", userInfo.token)
        .status(200)
        .json({ loginSuccess: true, userId: userInfo._id})
    
   })
  })
 })


//  인증기능!!!!!!!!!!!!!!!!

 app.get('/api/user/auth', auth , (req, res)=>{

    // 여기까지 미들웨어(auth)를 통과해 왔다는 것은
    // authentication 이 true라는 말.
    res.status(200).json({
        _id : req.user._id,
        isAdmin : req.user.role === 0? false : true,
        isAuth : true,
        email : req.user.email,
        name : req.user.name,
        lastname: req.user.lastname,
        role : req.user.role,
        image : req.user.image
    })

 })



//  로그아웃 기능!!!!(사실상 토큰을 없애버리는 기능)

app.get('/api/user/logout', auth, (req, res)=>{

    User.findOneAndUpdate({_id: req.user._id}, {token : ""},
        (err, user)=> {
            if(err) return res.json({ success : false, err})
            return res.status(200).send({ success : true})
        }
    )

})

app.listen(port, ()=>{
    console.log(`Example app listening on port ${port}`)
})