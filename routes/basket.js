const express = require('express');
const Basket = require('../models/Basket');
const BasketRoute = express.Router();

BasketRoute.route('/')
.get((req,res,next)=>{
    Basket.find({userId:101})
    .populate('list.product')
    .then((data)=>{
        res.contentType('application/json');
        res.json(data)
    })
})

module.exports = BasketRoute;