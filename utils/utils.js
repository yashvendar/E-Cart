const checkDiscountAndQty =(discount,qty,res)=>{
    if(qty && qty<1){
        res.statusCode=401;
        res.contentType('application/json');
        res.json({status:false,err:'Qty must be greater then 1 and number.'})
    }
    else if(discount && (discount>1 || discount<0)){
        res.statusCode=401;
        res.contentType('application/json');
        res.json({status:false,err:'discount must be between 0-1.'})
    }
}

module.exports={
    checkDiscountAndQty
}