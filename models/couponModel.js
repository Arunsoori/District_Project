const mongoose=require("mongoose")
const couponSchema = new mongoose.Schema({

    Name: {
        type: String,
        required: true,
        unique: true,
        index: true
      },
      Code: {
        type: Number,
        required: true,
        unique: true,
        index: true
      },
      Minbill: {
        type: Number
      },
      Cap: {
        type: Number
      }
      ,
      used_user: {
        type:[mongoose.Schema.Types.ObjectId],
        ref: 'user'
    },
    
      Discount: {
        type: Number,
        required: true,
        default: 0
      },
      Expire: {
        type: Date,
        required: true
      }
    })





module.exports = mongoose.model("coupon",couponSchema)
