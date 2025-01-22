const nodemailer = require('nodemailer')
const otpStore = new Map();

function generateOTP(length = 6) {
    let otp = '';
    const characters = '0123456789';
    for (let i = 0; i < length; i++) {
      otp += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return otp;
  }
  let transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:"robinsyriak07@gmail.com",
        pass:"lmqf gnjw gvlp daew"
    }
  })
  function sendOTPEmail (receiverEmail){
    const otp = generateOTP()

    otpStore.set(receiverEmail, {
        otp: otp,
        expiry: Date.now() + 60000 
    });

    let mailOptions = {
        from:'robinsyriak07@gmail.com',
        to:receiverEmail,
        subject:"OTP verification",
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
            <h2>OTP Verification</h2>
            <p>Your one-time password is:</p>
            <h1 style="color: #4CAF50; letter-spacing: 5px;">${otp}</h1>
            <p>This OTP will expire in 1 minute.</p>
            <p>If you didn't request this OTP, please ignore this email.</p>
        </div>
    `
    }
    try{
        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                return console.log("Error sending email",error); 
            }
            console.log("Email sent :" + info.response);
        })
    }catch(err){
        console.log(err);
        
    }
    
    return otp
  }

  module.exports={sendOTPEmail,otpStore}