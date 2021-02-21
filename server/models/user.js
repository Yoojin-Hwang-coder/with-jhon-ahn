const mongoose = require('mongoose')
const bycrypt = require('bcrypt');
const saltRounds= 10;
const jwt = require('jsonwebtoken');



const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email:{
        type: String,
        trim: true,
        unique: 1
    },
    password:{
        type: String,
        Minlength: 8
    },
    lastname:{
        type: String,
        maxlength: 50
    },
    role:{
        type: Number,
        default: 0
    },
    image:String,
    token: String,
    tokenExp: Number
    
})


// pre는 몽구스에서 가져온 method
userSchema.pre('save', function(next){
    var user = this;
    // 비밀번호가 변환될 때만 실행
    if(user.isModified('password')){
        
        // 비밀번호를 암호화 시킴
    bycrypt.genSalt(saltRounds, function(err, salt){
        if(err){
            return next(err)
        }else{
        bycrypt.hash(user.password , salt, function(err, hash){
            if(err){
                return next(err);
            }else{
                user.password = hash
                next();
            }
        } )
      }
    })
    }else{
        next();
    }
})



userSchema.methods.comparePassword = function(plainPassword, cb){
    // plainpassword 1234567  데이터베이스에 암호화된 비밀번호 $2b$10$ZN.KBEiBlAFO317nznJzruLpF3ezUMOdo4DEwU7G8wivMSGu03yZq
    bycrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err),
           cb(null, isMatch)
    })
}


userSchema.methods.maketoken = function (cb){
    let user = this;
    // jsonwebtoken을 이용해서 토큰을 생성하기
    // _id는 데이터베이스에 _id
    const token = jwt.sign(user._id.toHexString(), 'secretToken')
    user.token = token
    user.save(function(err, user){
        if(err){
            return cb(err)
        }else{
            cb(null, user)
        }
        
    })
}


 userSchema.statics.findByToken = function (token, cb){
    var user = this;

    // 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decode){
        // 유저 아이디를 이용해서 유저를 찾은 다음에 
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({ "_id": decode, "token": token }, function(err, user){
            if(err) return cb(err);
            cb(null, user);

        })
    })



 }

const User = mongoose.model('User', userSchema)

module.exports ={ User }