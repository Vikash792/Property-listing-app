//for handling error
module.exports =  (fn) =>{
    return function(req,res,next){
        fn(req,res,next).catch((err) =>{
            console.log("hello asyncWrap")
            next(err);
        });
}
}