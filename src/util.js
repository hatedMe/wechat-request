





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