

import * as util from './util';


export const dispatchRequest = function (config) {

    if (config.baseURL && !util.isAbsoluteURL(config.url)) {
        config.url = util.combineURLs(config.baseURL, config.url);
    }
    return new Promise((resolve, reject) => {
        wx.request({
            url : config.url ,
            data : config.data || {},
            header : config.header,
            method : config.method,
            dataType : config.dataType,
            success : function (res) {
                resolve( res.data )
            },
            fail : function (err) {
                reject(err)
            },
            complete :  function () {
                config.complete && config.complete()
            } 
        })
    });
}

