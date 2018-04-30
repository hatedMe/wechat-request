

import wxRequest from 'wechat-request';


// 针对post请求增加token
wxRequest.interceptors.request.use(
    config => {
        if (config.method === 'post') {
            config.headers.common['Authorization'] = AUTH_TOKEN;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });



export default wxRequest;



