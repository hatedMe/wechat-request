


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
        // config.baseUrl 
        

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

        // if( config.timeout && typeof config.timeout === 'number' ){
            
        // }
        // console.log( promise );
    
        return promise;
    }
    all (promises){
        return Promise.all(promises);
    }

    uploadFile ( ){  // 上传图片
        let config = util.merge({url: arguments[0]}, arguments[1]);
        let formData;
        if( config.formData && typeof config.formData === 'object' ){
            formData = new FormData();
            for(let attr in config.formData){
                formData.append( attr , config.formData[attr] )
            }
            config.formData = formData
        }
        return new Promise((resolve, reject) => {
            wx.uploadFile({
                url: config.url, 
                filePath: config.filePath,
                name: config.name,
                formData: config.formData,
                success: function(res){
                    resolve({
                        data : res.data ,
                        headers : res.header,
                        status : res.statusCode,
                        statusText : 'ok'
                    })
                },
                fail (err) {
                    reject(err)
                },
                complete() {}
            })
        });
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