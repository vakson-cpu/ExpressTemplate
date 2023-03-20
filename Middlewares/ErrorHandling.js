const ErrorHandler=(error,req,res,next)=>{
    if(res.headerSent){
    return next(error);
    }
    res.status(error.code || 500)
    res.json({message:error.message  || "An Unknown Error occured! "});

}

module.exports=ErrorHandler;