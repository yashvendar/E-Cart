const express = require("express")
const http = require('http');
const mongoose = require('mongoose');

var AddDummyDataRouter = require('./routes/addData');
const BasketRoute = require("./routes/basket");
const BasketItemRouter = require("./routes/basketItem");


const app = express();
mongoose.connect('mongodb://localhost:27017/e-cart',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
},
(err) => {
  if (err) {
    console.error('FAILED TO CONNECT TO MONGODB');
    console.error(err);
  } else {
    console.log('CONNECTED TO MONGODB');
  }
})

app.use('/addDummyData',AddDummyDataRouter);
app.use('/getBasket',BasketRoute);
app.use('/updateBasket',BasketItemRouter);

// app.use('/',(req,res,next)=>{
//     // console.log(req);
//     // console.log(res);
//     res.end("All Done");
// })
const server = http.createServer(app)
console.log("Hello YASH!")

server.listen(4000,"localhost",()=>{
    console.log("server listing on localhost:4000")
})