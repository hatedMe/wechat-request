

import * as util from './util';

let DEFAULT_CONTENT_TYPE = {
    'Content-Type': 'application/x-www-form-urlencoded'
};

var defaults = {
    method: 'get', // default
    // baseURL: '',
    dataType : 'json',
    responseType : 'text',

    timeout: 0,
    // xsrfCookieName: 'XSRF-TOKEN',
    // xsrfHeaderName: 'X-XSRF-TOKEN',
    // maxContentLength: -1,
    // validateStatus: function validateStatus(status) {
    //     return status >= 200 && status < 300;
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