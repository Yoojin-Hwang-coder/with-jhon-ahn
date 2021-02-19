const express = require('express');
const app = express();
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://YoojinHwang:elwufk12@thefirstyoojindb.edswc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndexL: true, useFindAndModify:false
}).then(()=>{
    console.log('몽고 잘 연결 됨')
}).catch((error)=>{
    console.log(error);
})

app.get('/', (req, res)=>{
    res.send('hello')
})

app.listen(port, ()=>{
    console.log(`Example app listening on port ${port}`)
})