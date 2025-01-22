require('dotenv').config();
const mongoose = require('mongoose');


const ConnectDb = async () => {
    
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
       
    } 


module.exports= ConnectDb;