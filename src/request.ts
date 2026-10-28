import Request from "./class";
import defaults from "./defaults";
import { bind, deepMerge, extend } from "./helpers/util";
import { CanceledError, isAxiosError, isCancel } from "./types";
import type { Instance, RequestConfig } from "./types";

function createInstance(config: RequestConfig): Instance {
  const context = new Request(config);
  const instance = bind(Request.prototype.request, context) as unknown as Instance;
  extend(instance, Request.prototype, context);
  extend(instance, context);
  // 用于创建多个实例：始终基于全局默认配置合并，保持与旧版本一致。
  instance.create = function (instanceConfig?: RequestConfig): Instance {
    return createInstance(deepMerge<RequestConfig>(defaults, instanceConfig));
  };
  instance.isCancel = isCancel;
  instance.isAxiosError = isAxiosError;
  // axios 风格：把取消构造器挂到实例上，UMD/CJS 直接 require 也能取到。
  instance.CanceledError = CanceledError;
  return instance;
}

const request = createInstance(defaults);

// 并发请求数据处理（兼容 API）：把 all 的数组结果展开为回调的多参数。
request.spread = function spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R {
  return function arrToArgs(arr: T[]): R {
    return callback(...arr);
  };
};

export default request;
