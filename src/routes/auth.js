const express = require('express');
const {validateSignUpdata}= require('../utils/validation')
const User =require('../model/userSchema')
const bcrypt= require('bcrypt')
const {sendOTPEmail,otpStore} = require("../utils/OtpSending")



const authRouter = express.Router();

authRouter.post('/signup',async(req,res)=>{
    console.log(req.body);
    try{

       validateSignUpdata(req)
      const {firstName,lastName,emailId,password,photoUrl,skills,age,about} = req.body

      const passwordHash = await bcrypt.hash(password,10)
     


      const existingUserByEmail = await User.findOne({ emailId });
      if (existingUserByEmail) {
          return res.status(400).json({ message: "Email already registered. Please log in." });
      }

      const user = new User({
       firstName,
       lastName,
       emailId,
       password:passwordHash,
       photoUrl,
       skills,
       age,
       about
     })
      const savedUser = await user.save()  
      const token = await savedUser.getJWT();
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        res.cookie("token", token, { expires });
        res.json({message:"User added succefully",data:savedUser})
    }catch(err){
       res.send('error occured :' +err.message)
    }
   })
authRouter.post('/login',async(req,res)=>{ 
    try{
    const {emailId,password}=req.body;
    const user = await User.findOne({emailId:emailId})
    if(!user){
       res.status(401).send("invalid credentials")
    }
    const isPasswordValid = await user.isValidPasswordH(password)
    
    
    if(isPasswordValid){
        const token = await user.getJWT();
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        res.cookie("token", token, { expires });
        res.send(user)
    }else{
        res.status(401).send("invalid credentials")
    }
    }catch(err){
    console.log("error occured"+err.message);
    res.status(400).send("invalid credentials")
    }
    })

authRouter.post('/logout',async(req,res)=>{
     res.cookie("token",null,{expires:new Date(Date.now())}).send("user logged out")
    })
module.exports = authRouter; 
authRouter.post('/send-otp',(req,res)=>{
    const{email}= req.body
   try{ 
    sendOTPEmail(email)
    res.send(" otp send succesfully")
   }catch(err){
    res.status(400).send("error")
    console.log(err);
    
   }
   
})
authRouter.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;  // User's email and OTP submitted for verification

    // Retrieve the OTP and expiry time from the store
    const storedData = otpStore.get(email);

    if (!storedData) {
        return res.status(400).send("OTP not found or expired.");
    }

    // Check if OTP has expired
    if (Date.now() > storedData.expiry) {
        otpStore.delete(email);  // Delete expired OTP
        return res.status(400).send("OTP has expired.");
    }

    // Check if OTP matches
    if (storedData.otp !== otp) {
        return res.status(400).send("Invalid OTP.");
    }

    // OTP is valid and not expired
    otpStore.delete(email);  // Delete OTP after successful verification
    res.send("OTP verified successfully.");
});