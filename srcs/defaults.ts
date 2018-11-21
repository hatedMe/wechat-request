


import * as util from './helpers/utils';

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


const DEFAULT_CONTENT_TYPE = {
    'Content-Type': 'application/x-www-form-urlencoded'
};

let defaults = {
    method: 'get', // default
    // baseURL: '',
    dataType : 'json',
    responseType : 'text',
    // timeout: 0,
    headers: {},
}


