class HttpError extends Error{
    constructor(message,code,succeeded){
        super(message);
        this.code=code;
        this.succeeded=succeeded
    }   
}

module.exports = HttpError;