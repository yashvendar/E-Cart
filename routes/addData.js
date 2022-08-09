const express = require('express');
const Product = require('../models/Product');
const Basket = require('../models/Basket');
const ErrorHandler = require('../utils/ErrorHandler');
const AddDummyDataRouter = express.Router();

AddDummyDataRouter.route('/')
.get(async(req,res,next)=>{
    let haveBasket = await Basket.findOne({userId:101});
    if(!haveBasket){
        await Basket.create({
            userId:101,
            list:[]
        })
        .then((data)=>{basket_id=data._id})
        .catch((err)=>{ErrorHandler(err,'Getting error while trying to insert data in Basket.',req,res)});

        await Product.insertMany([
            {
                name:'Apple Smart Watch 1',
                price:20000,
                inventory:1000
            },
            {
                name:'Apple Smart Watch 2',
                price:10000,
                inventory:1000
            },
            {
                name:'Apple Smart Watch 3',
                price:5000,
                inventory:1000
            }
        ]).catch((err)=>{ErrorHandler(err,'Getting error while trying to insert data in Product.',req,res)});

        await Product.findOne({name:"Apple Smart Watch 1"})
            .then((product)=>{
                Basket.findOne({userId:101})
                .then(async(basket)=>{
                    let qty=2,discount=0.10;
                    basket.list.push({
                        qty,
                        discount,
                        price:(1-discount)*qty*product.price, 
                        product:product._id
                    })
                    await basket.save();

                })
            })

            await Product.findOne({name:"Apple Smart Watch 2"})
            .then((product)=>{
                Basket.findOne({userId:101})
                .then(async(basket)=>{
                    let qty=3,discount=0.20;
                    basket.list.push({
                        qty,
                        discount,
                        price:(1-discount)*qty*product.price, 
                        product:product._id
                    })
                    await basket.save();
                    res.send('Done')
                })
            })

    }
    else{
        res.statusCode=400;
        res.json({
            status:false,
            message:'You already have basket'
        })
    }

})

module.exports = AddDummyDataRouter