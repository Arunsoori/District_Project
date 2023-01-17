const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user'
    },
    cartItems: [{
        productId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Product'
        },

        quantity: {
            type: Number,
            default: 1
        },
        total: {
            type:Number,
            default:0

        }
        
    }]
});

module.exports = mongoose.model('cart', cartSchema);