





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