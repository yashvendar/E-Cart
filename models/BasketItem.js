const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BasketItemSchema = new Schema({
    price:{
        type:Number,
        required:true
    },
    qty:{
        type:Number,
        required:true
    },
    product:{
        type:mongoose.Types.ObjectId,
        ref:'Product',
        required:true
    },
    discount:{
        type:Number,
        default:0
    }
})

// module.exports = BasketItem = new mongoose.model('BasketItem',BasketItemSchema);