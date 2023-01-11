const mongoose = require("mongoose")
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/District")
.then(()=>{
    console.log("connection successfull");
})
.catch((error)=>{
    console.log(error);
})