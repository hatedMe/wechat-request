


import * as util  from './util';
import defaults from './defaults';
import InterceptorManager from './InterceptorManager';
import { dispatchRequest } from './dispatchRequest';


class Request {
    constructor( config ){
        this.defaults = config;
        this.interceptors = {
            request: new InterceptorManager(),
            response: new InterceptorManager()
        };
    }
    request( config ){
        if( typeof config === 'string'){
            config = util.merge({url: arguments[0]}, arguments[1]);
        }
        config = util.merge(defaults, this.defaults, { method: 'GET' }, config );
        config.method = config.method.toLowerCase();



        // console.log( config ,'config');

        // dosoming 
        // congif.baseUrl 
        

        let chain = [dispatchRequest, undefined];
        let promise = Promise.resolve( config );

        this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
            chain.unshift(interceptor.fulfilled, interceptor.rejected);
        });
    
        this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
            chain.push(interceptor.fulfilled, interceptor.rejected);
        });
        // wxRequest.abort()

        while (chain.length) {
            promise = promise.then(chain.shift(), chain.shift());
        }

        // if( congif.timeout && typeof congif.timeout === 'number' ){
            
        // }
        // console.log( promise );
    
        return promise;
    }
    all (promises){
        return Promise.all(promises);
    }
}


['delete', 'get', 'head', 'options'].forEach(e => {
    Request.prototype[e] = function ( url,config ) {
        return this.request( util.merge(config || {} ,{
            method: e,
            url: url
        }))
    }
});


['post', 'put', 'patch'].forEach(e => {
    Request.prototype[e] = function ( config ) {
        return this.request( config )
    }
});


// ["options", "get", "head", "post", "put", "delete", "trace", "connect"].forEach(e => {
//     Request.prototype[e] = function ( config ) {
//         return this.request( config )
//     }
// });



export default Request;