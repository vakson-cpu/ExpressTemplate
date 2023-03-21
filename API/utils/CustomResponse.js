class CustomResponse{
    constructor(data,message,succeeded){
        this.data=data;
        this.message=message;
        this.succeeded=succeeded;
    }
    SendToClient(res,code){
        res.status(code);
        return res.json({message:this.message,data:this.data,succeeded:this.succeeded});
    }
}

module.exports=CustomResponse;