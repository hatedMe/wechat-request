import Request from "./class";
import * as util from "./helpers/util";
import defaults from "./defaults";

function createInstance(config) {
    let context = new Request(config);
    let instance = util.bind(Request.prototype.request, context);
    util.extend(instance, Request.prototype, context);
    util.extend(instance, context);
    // 用于创建多个实例
    instance.create = function (config) {
        return createInstance(util.merge(defaults, config));
    };
    return instance;
}

const request = createInstance(defaults);
// 并发请求数据处理
request.spread = function (callback) {
    return function (...arg) {
        return callback.apply(null, [...arg]);
    };
};

export default request;
