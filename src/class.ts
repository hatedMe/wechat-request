import { getUri } from "./core/dispatchRequest";
import { dispatchRequest } from "./core/dispatchRequest";
import { deepMerge, merge } from "./helpers/util";
import InterceptorManager from "./InterceptorManager";
import type { Method, RequestConfig, RequestPromise, Response } from "./types";

// 拦截器链在请求/响应阶段之间变换类型，与 axios 一致使用动态类型。
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyHandler = (value: any) => any;

const NO_BODY_METHODS = ["delete", "get", "head", "options", "trace"] as const;
const BODY_METHODS = ["post", "put", "patch"] as const;
/** 表单别名与其实际发送的方法的映射。 */
const FORM_METHODS = [
  { alias: "postForm", method: "post" },
  { alias: "putForm", method: "put" },
  { alias: "patchForm", method: "patch" },
] as const;

class Request {
  defaults: RequestConfig;
  interceptors: {
    request: InterceptorManager<RequestConfig>;
    response: InterceptorManager<Response>;
  };

  constructor(config: RequestConfig) {
    this.defaults = config;
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager(),
    };
  }

  request<T = unknown, D = unknown>(config: RequestConfig<D>): RequestPromise<T>;
  request<T = unknown, D = unknown>(url: string, config?: RequestConfig<D>): RequestPromise<T>;
  request<T = unknown, D = unknown>(
    config: RequestConfig<D> | string,
    urlConfig?: RequestConfig<D>,
  ): RequestPromise<T> {
    let resolved: RequestConfig<D>;
    if (typeof config === "string") {
      resolved = merge<RequestConfig<D>>({ url: config }, urlConfig);
    } else {
      resolved = config;
    }

    resolved = deepMerge<RequestConfig<D>>(this.defaults, resolved);
    resolved.method = (resolved.method ? resolved.method.toLowerCase() : "get") as Method;

    const chain: Array<AnyHandler | undefined> = [dispatchRequest, undefined];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let promise: Promise<any> = Promise.resolve(resolved);

    this.interceptors.request.forEach((interceptor) => {
      chain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    this.interceptors.response.forEach((interceptor) => {
      chain.push(interceptor.fulfilled, interceptor.rejected);
    });

    while (chain.length > 0) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise as RequestPromise<T>;
  }

  getUri(config: RequestConfig = {}): string {
    return getUri(deepMerge<RequestConfig>(this.defaults, config));
  }

  all<T>(promises: Array<T | Promise<T>>): Promise<T[]> {
    return Promise.all(promises);
  }
}

NO_BODY_METHODS.forEach((method) => {
  (Request.prototype as unknown as Record<string, AnyHandler>)[method] = function <T = unknown>(
    this: Request,
    url: string,
    config?: RequestConfig,
  ): RequestPromise<T> {
    return this.request<T>(
      merge<RequestConfig>({}, config, {
        method,
        url,
      }),
    );
  };
});

BODY_METHODS.forEach((method) => {
  (Request.prototype as unknown as Record<string, AnyHandler>)[method] = function <
    T = unknown,
    D = unknown,
  >(this: Request, url: string, data?: D, config?: RequestConfig<D>): RequestPromise<T> {
    return this.request<T, D>(
      merge<RequestConfig<D>>({}, config, {
        method,
        url,
        data,
      }),
    );
  };
});

FORM_METHODS.forEach(({ alias, method }) => {
  (Request.prototype as unknown as Record<string, AnyHandler>)[alias] = function <
    T = unknown,
    D = unknown,
  >(this: Request, url: string, data?: D, config?: RequestConfig<D>): RequestPromise<T> {
    return this.request<T, D>(
      merge<RequestConfig<D>>({}, config, {
        method,
        url,
        data,
        headers: merge({}, config?.headers, {
          "Content-Type": "multipart/form-data",
        }),
      }),
    );
  };
});

export default Request;
