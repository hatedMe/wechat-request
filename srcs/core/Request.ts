


import * as util  from '../helpers/utils';
// import defaults from './defaults';
import InterceptorManager from './InterceptorManager';
import dispatchRequest from './dispatchRequest';


class Request {

    defaults : any ;
    interceptors : {
        request : InterceptorManager ,
        response : InterceptorManager
    };
    
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
        config = util.merge(this.defaults,{ method: 'GET' }, config );
        config.method = config.method.toLowerCase();

        let chain = [dispatchRequest, undefined];
        let promise = Promise.resolve( config );

        this.interceptors.request.forEach(function(interceptor) {
            chain.unshift(interceptor.fulfilled, interceptor.rejected);
        });
    
        this.interceptors.response.forEach(function(interceptor) {
            chain.push(interceptor.fulfilled, interceptor.rejected);
        });

        while (chain.length) {
            promise = promise.then(chain.shift(), chain.shift());
        }
    
        return promise;
    }
    all (promises){
        return Promise.all(promises);
    }

}


['delete', 'get', 'head', 'options'].forEach( (e : string) : void => {
    Request.prototype[e] = function ( url, config ) {
        return this.request( util.merge(config || {} ,{
            method: e,
            url: url
        }) )
    }
});


['post', 'put', 'patch'].forEach(e => {
    Request.prototype[e] = function ( url, data ,config ) {
        return this.request( util.merge(config || {} ,{
            method: e,
            url: url,
            data :data 
        }) )
    }
});



export default Request;