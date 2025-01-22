const express = require('express')
const {userAuth} =require('../middlewares/userAuth')
const profileRouter =express.Router()
const User =require("../model/userSchema")
const {validateProfileEditData,validatePassword } =require('../utils/validation')
const validator = require('validator')
const bcrypt = require('bcrypt')



profileRouter.get('/profile/view',userAuth ,async(req,res)=>{
    try{
    const user = req.user 

    console.log(user);
    if(!user){
        throw new Error("invalid user")
    }
    res.send(user)
    }catch(err){
        res.status(400).send("ERROR:"+err.message)
    }
})



profileRouter.get('/user',async(req,res)=>{
    const userEmail = req.body.emailId
    console.log("userEmail:",userEmail);
    try{
        const user = await User.findOne({emailId:userEmail})
        console.log(user);
        res.send(user)
    }catch(err){
        res.send("somethig send wrong")
    }
})



profileRouter.patch('/profile/edit',userAuth,async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
       if(!validateProfileEditData(req)){
          throw new Error("invalid edit")
       }
       const loggedInuser = req.user;
       Object.keys(req.body).forEach((key)=>loggedInuser[key]=req.body[key])
       try{
        await loggedInuser.save()
        res.send({succes:true ,message:"user updated"})

       }catch(error){
        res.status(400).send("invalid input") 

       }
    } catch (err) {
        console.error(err);
        res.status(400).send("Update failed: " + err.message); 
    }
});


profileRouter.patch('/profile/forgotPassword',userAuth,async(req,res)=>{
     try{ const user = req.user;
        if(!validatePassword(req)){
            throw new Error("validation error")
        }
        if(user.password=== req.body.password){
            throw new Error("cannot use existing password")
        }
        if(!req.body.password && !validator.isStrongPassword(req.body.password)){
            throw new Error("please enter strong password")
        }
        const loggedUser = req.user
        console.log(loggedUser);
        const hasedPassword = await bcrypt.hash(req.body.password,10)
         Object.keys(req.body).forEach((key)=>loggedUser[key] =hasedPassword)
         console.log(loggedUser);
         await loggedUser.save()
         res.send("password changed succesfully")
    }catch(err){
        res.status(400).send("canot change password" +err.message)
    }
    
   
})

module.exports = profileRouter   