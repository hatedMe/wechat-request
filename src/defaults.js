

import * as util from './util';

let DEFAULT_CONTENT_TYPE = {
    'Content-Type': 'application/x-www-form-urlencoded'
};

var defaults = {
    method: 'get', // default
    // baseURL: '',
    dataType : 'json',
    responseType : 'text',
    // timeout: 0,
    headers: {},
};


["delete","get","head"].forEach(e => {
    defaults.headers[e] = {};
});

['post', 'put', 'patch'].map(e => {
    defaults.headers = util.merge(defaults.headers , DEFAULT_CONTENT_TYPE);
});


export default defaults;