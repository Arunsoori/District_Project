const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"admin_users"
      },
      address: {
        name: {
          type: String,
        },
        house: {
          type: String,
          
        },
        post: {
          type: String,
           
        },
        city: {
          type: String,
           
        },
        district: {
          type: String,
           
        },
        state: {
          type: String,
           
        },
        pin: {
          type: Number,
           
        }
      },
      total:{
        type: Number,    
      },
      discount_amount:{
        type: Number, 
      },
      grand_total:{
        type: Number, 
      },
      order_status: {
        type: String,
        default: 'pending'
      },
      payment: {
        pay_method: { type: String },
        pay_id: { type: String },
        pay_order_id: { type: String },
        pay_status: { type: String, default: 'pending' }
      },
      products: [{
        item: { type: mongoose.Schema.Types.ObjectId,ref:'product'   },
         quantity: { type: Number,   },
        price: { type: Number,   },
         
      }]
      ,
      
     
      ordered_date: {
        type: Date,
        default: Date.now()
      },
    })
    
   
    
    


module.exports = mongoose.model('order', orderSchema)