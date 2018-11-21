




interface faceError extends Error {
    message : string,
    request ?: any , 
    response ?: any , 
    toJSON ?: () => any
}

const enhanceError : ( error : faceError, config : any , code : number, request : any , response : any ) => any = function (error, config, code, request, response) {
    error.request = request;
    error.response = response;
    error.toJSON = function () {
        return {
            message : this.message ,
            name : this.name ,
            config : this.config ,
            code : this.code 
        }
    }
    return error ;
}



interface settleFace {
    resolve : ( response : any ) => Promise<{}> ,
    reject : ( enhanceError : any ) => Promise<{}>,
    response : any
}

const settle : ( resolve : settleFace['resolve'] , reject : settleFace['reject'] , response : any ) => Promise<{}> = function(resolve , reject , response){
    const validateStatus = response.config.validateStatus;
    if( !validateStatus || validateStatus( response.status ) ){
        return resolve(response);
    }
    const error : faceError = new Error( 'Request failed with status code ' + response.status )
    reject( 
        enhanceError ( 
            error,
            response.config,
            null,
            response.request,
            response
        )
    );
}