import * as util from "./helpers/util";
import InterceptorManager from "./InterceptorManager";
import { dispatchRequest } from "./core/dispatchRequest";

class Request {
    constructor(config) {
        this.defaults = config;
        this.interceptors = {
            request: new InterceptorManager(),
            response: new InterceptorManager(),
        };
    }
    request(config) {
        if (typeof config === "string") {
            config = util.merge({ url: arguments[0] }, arguments[1]);
        }

        config = util.deepMerge(this.defaults, config);
        config.method = config.method ? config.method.toLowerCase() : "get";

        let chain = [dispatchRequest, undefined];
        let promise = Promise.resolve(config);

        this.interceptors.request.forEach(function (interceptor) {
            chain.unshift(interceptor.fulfilled, interceptor.rejected);
        });

        this.interceptors.response.forEach(function (interceptor) {
            chain.push(interceptor.fulfilled, interceptor.rejected);
        });

        while (chain.length) {
            promise = promise.then(chain.shift(), chain.shift());
        }

        return promise;
    }
    all(promises) {
        return Promise.all(promises);
    }
}

["delete", "get", "head", "options", "trace"].forEach((method) => {
    Request.prototype[method] = function (url, config) {
        return this.request(
            util.merge(config || {}, {
                method,
                url,
            })
        );
    };
});

["post", "put", "patch"].forEach((method) => {
    Request.prototype[method] = function (url, data, config) {
        return this.request(
            util.merge(config || {}, {
                method,
                url,
                data,
            })
        );
    };
});

export default Request;
