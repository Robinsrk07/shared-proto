const express = require('express');
const ConnectDb =  require('./config/database')
const app = express();
var cookieParser = require('cookie-parser')
const authRouter =require('./routes/auth')
const profileRouter = require('./routes/profile')
const reqRouter =require('./routes/requset')
const userRouter = require('./routes/user')
const cors = require("cors")

ConnectDb().then(()=>{
    console.log("database Connection succes");
    app.listen(8080,()=>{
        console.log("server connected");
        
    })
    
})


app.use(cors({
    origin:"http://localhost:5173",credentials:true

}))
app.use(express.json())
app.use(cookieParser())
app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',reqRouter)
app.use('/',userRouter)

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Something went wrong");
});

