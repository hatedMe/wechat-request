





export const bind = function(fn,thisArg){
    return function warp(){
       return fn.apply(thisArg , Array.from(arguments) )
    }
}

export const extend = function (a,b, thisArg) {
    let o = Object.getOwnPropertyNames( b );
    o.forEach(attr => {
        if(thisArg && typeof b[attr] === "function" ){
            a[attr] = bind( b[attr] , thisArg )
        }else{
            a[attr] = b[attr];
        }
    });
    return a;
}

export const copyobj = function( a, b ){
    return Object.assign( {} , a ,b );
}

export const merge = function(){
    var result = {};
    Array.from(arguments).forEach( e =>{
        for(let key in e){
            if( typeof e[key] === 'object' && !isEmptyObject(e[key]) ){
                merge( result[key] , e[key] )
            }
            result[key] = e[key]
        }
    })

    return result;
}



export const isEmptyObject = function(obj){
    return Object.getOwnPropertyNames(obj).length === 0
}



export const combineURLs = function (baseURL, relativeURL) {
    return relativeURL
      ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
      : baseURL;
};


// /**
//  * Transform the data for a request or a response
//  *
//  * @param {Object|String} data The data to be transformed
//  * @param {Array} headers The headers for the request or response
//  * @param {Array|Function} fns A single function or Array of functions
//  * @returns {*} The resulting transformed data
//  */
// export const transformData = function(data, headers, fns) {
//     // utils.forEach(fns, function transform(fn) {
//     //   data = fn(data, headers);
//     // });
    
//     if( typeof data !== 'object' ) {
//         data = [data]
//     }

//     if( Array.isArray(data) ){
        
//     }

//     return data;
// };


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */

export const isAbsoluteURL =  function (url) {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};