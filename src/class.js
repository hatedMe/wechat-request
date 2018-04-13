


import * as util  from './util';
import defaults from './defaults';



class Request {
    constructor( config ){
        this.defaults = config;
    }
    request( config ){
        if( typeof config === 'string'){
            config = util.merge({url: arguments[0]}, arguments[1]);
        }

        config = util.merge(defaults, this.defaults, { method: 'GET' }, config );
        config.method = config.method.toLowerCase();

        console.log( config ,'config');

        return new Promise(function(resolve, reject) {
            let wxRequest = wx.request({
                url : config.url ,
                // data : config.data,
                header : config.header,
                method : config.method,
                // dataType : config.dataType,
                success : function (res) {
                    resolve( res.data )
                },
                fail : function (err) {
                    reject(err)
                },
                complete : function () {

                }
            })

            // wxRequest.abort()

        });
    }
    all (promises){
        return Promise.all(promises);
    }
}




["options", "get", "head", "post", "put", "delete", "trace", "connect"].forEach(e => {
    Request.prototype[e] = function ( config ) {
        return this.request( config )
    }
});



export default Request;