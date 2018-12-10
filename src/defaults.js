

import * as util from './helpers/util';

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

    // params : {},

    transformRequest (data) {
        return data;
    },

    // transformResponse (data) {
    //     return data;
    // },

    // validateStatus ( status ) {
    //     return status >= 200 && status < 300
    // }

};

defaults.headers = {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
};

['delete','get', 'head','post', 'put', 'patch'].map(e => {
    defaults.headers[e] = util.merge(defaults.headers , DEFAULT_CONTENT_TYPE);
});


export default defaults;