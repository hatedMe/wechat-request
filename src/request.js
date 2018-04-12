/*
 * @Author: 7548764@qq.com
 * @Date: 2018-04-12 21:38:16 
 * @Last Modified by: 7548764@qq.com
 * @github : https://www.github.com/hatedMe/wechat-request
 */


import defaults from './defaults';
import util from './util';

class X {
    constructor(){
        
        this.defaults = defaults
    }

    // static defaults () {
        
    // }


    request(url , data , options){


        console.log( this.defaults );

        return new Promise((resolve, reject) => {
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
    };

    all ( promises) {
        return Promise.all( promises );
    }
}



['get','post','put'].forEach(e => {
    X.prototype[e] = function () {
        return this.request()
    }
});







console.log( new X );


var _x = new X;
_x.defaults.timeout = 5000;

console.log( _x );
//export default new X;