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
    is_varified:{
        type:Number,
        default:0
    }
})

module.exports = mongoose.model("user",userSchema)