const mongoose = require('mongoose');
const Objectid = mongoose.Types.ObjectId
const productSchema = new mongoose.Schema({


    image: {
        type:[String],
        required: true
    },

   productName: {
    type: String,
    required: true
},

    description: {
        type: String,
        required: true
    },
    mycategory: {
        type: String,
        required: true,
        ref:"category",
    },
    price: {
        type: Number,
        required: true
    },
    status : {
        type: Boolean,
        default: true
    }
    



    // status: {
    //     type: String,
    //     default: 'Unblocked'
    // },
    
    // date: {
    //     type: Date,
    //     default: Date.now
    // },
    // blockedDate: {
    //     type: Date,
    //     default: Date.now
    // },




})

module.exports =  mongoose.model('Product', productSchema);