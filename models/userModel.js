const mongoose=require("mongoose")
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true

    },
    confirmpassword:{
        type:String,
        required:true

    },
    status : {
        type: String,
        default: 'Unblocked'
    },
    is_admin:{
        type:Number,
        required:true
    },
    verified:{
        type:Boolean,
        default:false
    },
    token:{
        type:String,
        default:'empty'
      },
    address :[
        {
   Name: String,
   Lastname: String,
   House: String,
   Post: String,
   Pin: String,
   City: String,
   District:String,
   State: String,
   Country: String,
    

        
}],

})

module.exports = mongoose.model("user",userSchema)