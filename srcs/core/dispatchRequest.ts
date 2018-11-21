








// import * as util from './util';


// export const dispatchRequest = function (config) {

//     if (config.baseURL && !util.isAbsoluteURL(config.url)) {
//         config.url = util.combineURLs(config.baseURL, config.url);
//     }

//     config.headers = util.merge(
//         config.headers.common || {},
//         config.headers || {},
//         config.headers[config.method] || {},
//     )

//     let methods = ['delete', 'get', 'head', 'post', 'put', 'patch', 'common']
//     methods.forEach(method => {
//         delete config.headers[method];
//     });

//     let promise = Promise.resolve( config );
//     promise = promise.then( config => {
//        return new Promise(function(resolve, reject) {
//             let requestTask =  wx.request({
//                 url : config.url ,
//                 data : config.data || {},
//                 header : config.headers,
//                 method : config.method,
//                 dataType : config.dataType,
//                 success : function (res) {
//                     resolve({
//                         data : res.data ,
//                         headers : res.header,
//                         status : res.statusCode,
//                         statusText : 'ok'
//                     })
//                 },
//                 fail : function (err) {
//                     reject(err)
//                 },
//                 complete :  function () {
//                     config.complete && config.complete()
//                 }
//             })

//             if( config.timeout && typeof config.timeout === 'number' && config.timeout > 1000 ){
//                 setTimeout(() =>{
//                     requestTask.abort();
//                     resolve({
//                         status : 'canceled'
//                     });
//                 },config.timeout)
//             }
//         });
//     })

//     return promise;
// }
interface Idata {
    [key : string] : any ;
}


interface LabelledConf {
    method?: string ;
    baseURL?: string ; 
    dataType?: string ;
    responseType?: string ;
    headers?: Idata ;
    'Content-Type'? : string ;
}


interface RequestData extends LabelledConf {
    url : string ;
    data : string | Idata ;
}


const dispatchRequest : ( config : LabelledConf ) => Promise<{}> = function (config){
    let promise = Promise.resolve( config );
    promise = Promise.resolve( config ).then( (config : RequestData) : Promise<any> => {
        return new Promise(function(resolve : any, reject) {
            wx.request({
                url : config.url ,
                data : config.data || {},
                header : config.headers,
                method : config.method,
                dataType : config.dataType,
                success(res) {
                    resolve( res )
                }
            })
        });
    })
    return promise;
}


export default dispatchRequest;