const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user'
    },
    productId: [{
        type: String,
        ref: 'Product'
    }]
})

module.exports = mongoose.model('wishlist', wishlistSchema);