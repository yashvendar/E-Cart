const bodyParser = require('body-parser');
const express = require('express');
const Basket = require('../models/Basket');
const Product = require('../models/Product');
const ErrorHandler = require('../utils/ErrorHandler');
const { checkDiscountAndQty } = require('../utils/utils');
const BasketItemRouter = express.Router();

BasketItemRouter.use(bodyParser.json());
BasketItemRouter.route('/:product_id')
.delete((req,res,next)=>{
    let product_id = req.params.product_id;
    Basket.findOne({userId:101})
    .then((basket)=>{
        basket.list=basket.list.filter((doc)=>doc.product!=product_id);
        return basket.save();
    })
    .then((data)=>{
        res.contentType('application/json');
        res.json(data)
    })
})
.post((req,res,next)=>{
    let product_id = req.params.product_id;
    Product.findOne({_id:product_id})
    .then(async(productItem)=>{
        if(!productItem){
            return ErrorHandler(new Error("Sorry, We don't have this product any more."),404,req,res);
        }
        let discount = req.body.discount, qty=req.body.qty;
        if(discount && qty){
            checkDiscountAndQty(discount,qty,res);
            let basket = Basket.findOne({userId:101})
            if(!basket){
                basket = await Basket.create({
                    userId:101,
                    list:[]
                })
            }
            let basketItem = basket.list.filter((basketData)=>basketData.product==product_id);
            if(basketItem[0]){
                res.statusCode=401;
                res.contentType('application/json');
                res.json({status:false,err:'You already have item in basket!.'})
            }
            else{
                Basket.list.push({
                    product:product_id,
                    qty,
                    discount,
                    price:(1-discount)*qty*productItem.price

                })
                return Basket.save()
                .then((data)=>{
                    res.statusCode=201;
                    res.contentType('application/json');
                    res.json({
                        status:true,
                        data
                    })
                })
            }
        }
        else{
            res.statusCode=401;
            res.contentType('application/json');
            res.json({status:false,err:'Required data is missing'})
        }

    })
    .catch((err)=>ErrorHandler(err,500,req,res))
})
.put((req,res,next)=>{
    let product_id = req.params.product_id;
    Product.findOne({_id:product_id})
    .then(async(productItem)=>{
        let UserBasket = await Basket.findOne({userId:101});
        if(!UserBasket){
            res.statusCode=401;
            res.contentType('application/json');
            res.json({
                status:false,
                data:'Nothing to update, please add items first before update.'
            })
        }
        if(!productItem){
            UserBasket.list=UserBasket.list.filter((doc)=>doc.product!=product_id);
            await UserBasket.save();
            return ErrorHandler(new Error("Sorry, We don't have this product any more."),404,req,res);
        }

        let discount = req.body.discount, qty=req.body.qty;
        checkDiscountAndQty(discount,qty,res);


        let basketItem = UserBasket.list.filter((basketData)=>basketData.product==product_id);

        console.log(basketItem)
         
        if(!basketItem[0]){
            res.statusCode=401;
            res.contentType('application/json');
            res.json({
                status:false,
                data:'Nothing to update, please add items first before updating item.'
            })
            return;
        }
        if(discount && qty){
                basketItem[0].qty=qty;
                basketItem[0].discount=discount;
                basketItem[0].price=(1-discount)*qty*productItem.price;
                return UserBasket.save()
                .then((data)=>{
                    res.statusCode=204;
                    res.contentType('application/json');
                    res.json({status:true,data})
                })
        }
        else if(qty){
            basketItem[0].qty=qty;
            basketItem[0].price=(1-basketItem[0].discount)*qty*productItem.price;
            return UserBasket.save()
            .then((data)=>{
                res.statusCode=204;
                res.contentType('application/json');
                res.json({status:true,data})
            })
        }
        else if(discount){
            basketItem[0].discount=discount;
            basketItem[0].price=(1-discount)*basketItem[0].qty*productItem.price;
            return UserBasket.save()
            .then((data)=>{
                res.statusCode=204;
                res.contentType('application/json');
                res.json({status:true,data})
            })
        }
        res.statusCode=401;
        res.contentType('application/json');
        res.json({status:false,error:"Didn't find required body arguments"})

    })

})


module.exports = BasketItemRouter
