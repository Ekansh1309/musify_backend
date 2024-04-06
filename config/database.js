const mongoose = require("mongoose");

require("dotenv").config();

const connectWithDb=()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true 
    })
    .then(()=>{console.log("DB Connected Succesfully")})
    .catch((err)=>{
        console.log("Error in DB Connection") 
        console.log(err)
        process.exit(1)
    })
}

module.exports= connectWithDb;

// eku130902
// aNKXed4N0t5J9ECL
// mongodb+srv://eku130902:aNKXed4N0t5J9ECL@cluster0.bcftoor.mongodb.net/