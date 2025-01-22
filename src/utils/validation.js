const bcrypt= require('bcrypt')
  const validator = require('validator')
const validateSignUpdata=(req)=>{
    const {firstName,lastName,emailId,password} = req.body;
      if(!firstName||!lastName){
        throw new Error(" Name is not valid")
      }else if(!validator.isEmail(emailId)){
        throw new Error(" enter a valid email")
      }else if(!validator.isStrongPassword(password)){
        throw new Error('please enter a strong password')
      }
}

const validateProfileEditData=(req)=>{ 

  const data= req.body;
  const allowedUpdates =["firstName","lastName","about","photoUrl","skills","age","userId","gender"]

  const isAllowedUpdates = Object.keys(data).every((k)=>allowedUpdates.includes(k))
  if(!isAllowedUpdates){
    throw new Error("update not allowed")
  }
  if(data?.skills.length>10){
    throw new Error("limit exceed")
  }
  return true
    
}


const validatePassword =(req)=>{
  const data = req.body
  const allowedUpdate= ["password","userId"]
  const isValidUpdate =Object.keys(data).every((key)=>allowedUpdate.includes(key))
  if(!isValidUpdate){
    throw new Error("issue with request body")
  }

  return isValidUpdate

}
module.exports = {
    validateSignUpdata,
    validateProfileEditData,
    validatePassword
}