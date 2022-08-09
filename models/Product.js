const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    inventory:{
        type:Number,
        required:true
    }
})

module.exports = Product = new mongoose.model('Product',ProductSchema);