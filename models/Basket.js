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
        type:Schema.Types.Decimal128,
        default:0
    }
})

const BasketSchema = new Schema({
    userId:{
        type:Number,
        required:true
    },
    list:[BasketItemSchema]
})

module.exports = Basket = new mongoose.model('Basket',BasketSchema);