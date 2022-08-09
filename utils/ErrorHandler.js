module.exports= ErrorHandler =(err,message,req,res)=>{
    let err1=new Error(err.toString());
    res.statusCode=401;
    res.end('Getting Error')
}