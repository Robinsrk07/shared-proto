const express = require('express')
const { userAuth } = require('../middlewares/userAuth')
const ConnectionRequestModel = require('../model/connectionRequest')
const User = require('../model/userSchema')
const userRouter = express()


const SAFE_DATA =  ["firstName" ,"lastName","age","photoUrl","about","emailId","skills"]

userRouter.get('/user/requests/received',userAuth,async(req,res)=>{
    try{
        const loggedUser =  req.user
        const connectionRequest =  await ConnectionRequestModel.find({
            receiverId:loggedUser._id,
            status:"interested"  
        }).populate("senderId",SAFE_DATA)
        if(!connectionRequest){
            return res.status(400).send({message:"connection not found"}) 
        }
        res.send({message:" data fetched succefully",data:connectionRequest})
    }catch(err){ 
        res.status(400).send("ERROR"+err.message)
    }
})



userRouter.get("/user/connection",userAuth,async(req,res)=>{
    try{
     const loggedInuser = req.user;
     const allConnections= await ConnectionRequestModel.find({ 
        $or:[
            {senderId:loggedInuser._id ,status:"accepted"},
            {receiverId:loggedInuser.id,status:"accepted"}
        ]
     }).populate("senderId",SAFE_DATA).populate("receiverId",SAFE_DATA)
     if(!allConnections){
        return res.status(400).send("connection error")
     }
     if(allConnections.length==0){
        return  res.send({message:"there is no connctions"})
     }
   const data =  allConnections.map((connection)=>{
    return connection.senderId._id.equals(loggedInuser._id)
       ? connection.receiverId :connection.senderId
   })
     res.send({success:true,message:"connection fetched succefully",data:data})
    }catch(err){
       res.status(400).send({message:err.message})
    }
})

 
userRouter.get('/feed',userAuth,async(req,res)=>{
    try{
    let page = parseInt(req.query.page)||1 ;
    let  limit = parseInt(req.query.limit) || 10
    limit =limit >50 ? 50 :limit;
    page = page > 30 ?30 :page;
    const skip = (page-1)*limit;  
        const loggedUser = req.user
        const Connections = await ConnectionRequestModel.find({
            $or:[
                {senderId:loggedUser._id},
                {receiverId:loggedUser._id}
            ]
        }).select("senderId receiverId")
        const hideUser=  new Set()
        Connections.forEach( (req)=>{
            hideUser.add(req.senderId.toString());
            hideUser.add(req.receiverId.toString());
        })
        const users =await User.find({
            $and:[
                {_id:{$nin: Array.from(hideUser)}},
                {_id:{$ne:loggedUser._id}}
            ]
        }).select(SAFE_DATA)
        .skip(skip)
        .limit(limit)
        res.json({users})
    }catch(err){
        console.log("direct");
        
        res.status(400).json({success:false,message:err.message})
    }
})


module.exports = userRouter