
const jwt = require('jsonwebtoken')
const User = require('../model/userSchema')

const userAuth= async(req,res,next)=>{
    try{
        const cookies = req.cookies
        const{token} = cookies
        if(!token){
            return res.status(401).send("please login user")
        }
        const decode = await jwt.verify(token,"ROBIN@123")
        const {_id} = decode;
        const user = await User.findById(_id)
        console.log("userfrf",user);
        
        if(!user){
            throw new Error(" user not found")
        } 
        req.user =user
        next()
    } catch(err){
  res.status(404).send("invalid credentials")
    }
    
}

module.exports = {userAuth}