


import * as util  from './util';

class X {
    constructor(){
        this.defaults = defaults
    }

    request(url , data , options){
        return new Promise((resolve, reject) => {
            wx.request({
                url : url ,
                data : data ,
                header : header ,
                method : method ,
                dataType : dataType ,
                responseType : responseType ,
                success : function (res) {
                    resolve( res.data )
                },
                fail : function (err) {
                    reject(err)
                },
                complete : function () {

                }
            });
        });
    };

    all ( promises) {
        return Promise.all( promises );
    }
}


class Request {
    constructor( config ){
        this.defaults = config;
    }
    request(){
        console.log( this.defaults ,"==========" )
        return new Promise(function(resolve, reject) {
            // wx.request({
            //     url : url ,
            //     data : data ,
            //     header : header ,
            //     method : method ,
            //     dataType : dataType ,
            //     responseType : responseType ,
            //     success : function (res) {
            //         resolve( res.data )
            //     },
            //     fail : function (err) {
            //         reject(err)
            //     },
            //     complete : function () {

            //     }
            // });
        });
    }
    all (promises){
        return Promise.all(promises);
    }
}

[OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT].forEach(e => {
    Request.prototype[e] = function (url , config) {
        return this.request( url , config)
    }
});



export default Request;