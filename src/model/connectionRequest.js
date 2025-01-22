const mongoose = require('mongoose')
const User =require("./userSchema")

const connectionRequestSchema = new mongoose.Schema({
    senderId :{
        type : mongoose.Schema.Types.ObjectId,
        required:true,
        ref:User
    },
    receiverId :{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:User
    }, 
    status :{
        type: String,
        enum:{
            
            values:["accepted","ignored","interested","rejected"],
             message : `{VALUE} is not allowed`
        
        },
        required:true
    },
 

},{
    timestamps:true
})


connectionRequestSchema.index({senderId:1,receiverId:1})


connectionRequestSchema.pre("save", function(next) {
    console.log("SenderId:", this.senderId);
    console.log("ReceiverId:", this.receiverId);
    console.log("Are they equal:", 
        this.senderId.toString() === this.receiverId.toString()
    );
    
    if (this.senderId.toString() === this.receiverId.toString()) {
        return next(new Error("Cannot send self connection request"));
    }
    next();
});

connectionRequestSchema.index({senderId:1,receiverId:1})
const ConnectionRequestModel= new mongoose.model(
    "ConnectionRequest",connectionRequestSchema
)
module.exports = ConnectionRequestModel