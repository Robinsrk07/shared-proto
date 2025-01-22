const mongoose = require('mongoose');
const {Schema} = mongoose
const validator = require('validator')
var jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const userSchema = new Schema({
    firstName :{
        type: String,
        required:[true,"first name required"],
        minLength:[3,"first name must be  charater long"],
        maxLength:[50,"first name cannot exceed 50 character"],
        trim:true,
        validate:function(v){
             return /^[A-Za-z\s]+$/.test(v)
        }
    },
    lastName:{
        type: String,
        required:[true,"last name should be required"],
        minLength:[3,"last name should be 3 char long"],
        maxLength:[40,"last name cannot exeed 50 char"],
        trim:true,
        validate(value){
            return " "||/^[A-Za-z\s]+$/.test(value)
        }
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        validate:validator.isEmail
    },
    password:{
        type: String,
        required :true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("enter a strong password")
            }
        }
    },
    age:{
        type :Number,
        max:100,
        min:18
    },
    gender:{
        type :String,
        enum: {
            values: ['Male', 'Female', 'Other', 'Prefer not to say'],
            message: 'Invalid gender option'
        }
    },
    about:{
        type:String,
        default: "defalut value",
        maxLength:[500]
    },
    photoUrl:{
        type:[String]
      
    },
    skills:{
        type:[String],
        validate:function(v){
            return v.length<=10
        }
          
    },
},{
        timeStamps:true

})
userSchema.index({firstName:1, lastName:1})
//helper methodes of schema
userSchema.methods.getJWT= async function(){
    console.log("from user schema:",this);
    const token = await jwt.sign({_id:this._id},'ROBIN@123',{expiresIn:"1d"})
     return token
}

userSchema.methods.isValidPasswordH= async function (userEnterdPassword) {
    const validation = await bcrypt.compare(userEnterdPassword,this.password)
    console.log(validation);
    
    return validation
}

const User =mongoose.model("User",userSchema)
module.exports = User
