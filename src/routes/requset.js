const express = require('express')
const ConnectionRequestModel= require('../model/connectionRequest')
const reqRouter = express.Router()
const {userAuth} =require('../middlewares/userAuth')
const User = require('../model/userSchema')
const { default: mongoose } = require('mongoose')


reqRouter.post('/request/send/:status/:toUserID',userAuth,async(req,res)=>{
   try{
     const user = req.user;
     const senderId = user._id
     const receiverId =  req.params.toUserID;
     const status = req.params.status
    
 
     const allowedStatus =["ignored","interested"];
     if(!allowedStatus.includes(status)){
        return res.status(400).send({message:"Invalid status received"})
     } 
     const toUser = await User.findById(receiverId)
     console.log("touser ",toUser);
     if(!toUser){  
        return res.status(400).send({message:"user not found"})
     }
     const existingConnection= await ConnectionRequestModel.findOne({
        $or:[
            {senderId,receiverId},{senderId:receiverId,receiverId:senderId}
        ]
     })
     console.log("extxt",existingConnection);
     if(existingConnection){
        return res.status(400).send({message:" already have connection"})
     }
     const connectionRequest = new ConnectionRequestModel({
      senderId,receiverId,status
     })
      const data =  await connectionRequest.save()
      res.send({message:"Connection request send succesfully",data})
   }catch(err){
    res.status(400).send('ERROR:'+err.message)
   }
    
})



reqRouter.post('/request/review/:status/:requestId',userAuth,async(req,res)=>{
const{status,requestId} = req.params
console.log(req.params);
 
const loggedUser = req.user
try{
const allowedStatus = ["accepted","rejected"]
if(!allowedStatus.includes(status)){
   return res.status(400).send(" status not allowed ")
}
if(!mongoose.Types.ObjectId.isValid(requestId)){
   return res.status(400).send({success:false,  message:"invalid requestId"})
}
const connection = await ConnectionRequestModel.findOne({
   _id:requestId,
   receiverId:loggedUser._id,
   status:"interested"
})
if(!connection){
   return res.status(400).send({message:"connection wont find..."})
}
console.log(connection);

connection.status = status

const data = await connection.save()
res.send({success:true,
          message:"user request"+status,
          data
})
}catch(err){

res.status(400).send({success:false,
   message:"invalid entry"+err.message
})

}

})

module.exports = reqRouter