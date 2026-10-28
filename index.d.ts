/**
 * wechat-request 公共类型定义。
 *
 * 保持与原 `index.d.ts` 的调用方式兼容，同时用泛型替代 `any` 默认值，
 * 并补齐 Axios v1 风格的取消、错误守卫与表单别名所需的类型。
 */
type Method = "get" | "GET" | "delete" | "DELETE" | "head" | "HEAD" | "options" | "OPTIONS" | "trace" | "TRACE" | "post" | "POST" | "put" | "PUT" | "patch" | "PATCH" | "link" | "LINK" | "unlink" | "UNLINK";
/** 旧版公开的宽松键值类型，保留作兼容别名。 */
type BaseData = Record<string, unknown>;
/** 扁平化后的请求头键值表。 */
type HeadersMap = Record<string, string | undefined>;
/** 按请求方法分组的请求头（含 axios 风格的 common/method 嵌套写法）。 */
interface RequestHeaders {
    common?: HeadersMap;
    delete?: HeadersMap;
    get?: HeadersMap;
    head?: HeadersMap;
    options?: HeadersMap;
    trace?: HeadersMap;
    post?: HeadersMap;
    put?: HeadersMap;
    patch?: HeadersMap;
    [key: string]: HeadersMap | string | undefined;
}
type WxDataType = "json" | "text" | string;
type WxResponseType = "text" | "arraybuffer";
interface RequestConfig<D = unknown> {
    url?: string;
    method?: Method;
    baseURL?: string;
    headers?: RequestHeaders;
    params?: Record<string, unknown>;
    data?: D;
    timeout?: number;
    dataType?: WxDataType;
    responseType?: WxResponseType;
    /** 请求发出前的数据转换钩子，默认直接透传（方法签名以保持泛型协变可用）。 */
    transformRequest?(data: D, headers?: RequestHeaders): unknown;
    /** 响应 resolve 前的数据转换钩子，默认直接透传。 */
    transformResponse?: (data: unknown) => unknown;
    /** 状态码校验，默认接受全部状态码（由调用方判断）。 */
    validateStatus?: (status: number) => boolean;
    /** AbortController 取消信号，触发时请求按取消错误 reject。 */
    signal?: AbortSignal;
    /** 底层请求完成后的回调，原样透传。 */
    complete?: () => void;
}
interface Response<T = unknown> {
    data: T;
    status: number;
    statusText: string;
    headers: HeadersMap;
    config: RequestConfig;
}
/** Promise 形式的响应（保留旧版 `RequestPromise` 别名语义）。 */
type RequestPromise<T = unknown> = Promise<Response<T>>;
interface RequestError<T = unknown> extends Error {
    config?: RequestConfig;
    code?: string;
    request?: unknown;
    response?: Response<T>;
    isAxiosError: boolean;
}
/** 可被 `isCancel` 识别的取消错误。 */
declare class CanceledError<T = unknown> extends Error implements RequestError<T> {
    readonly __CANCEL__: true;
    readonly isAxiosError = false;
    code: string;
    config?: RequestConfig;
    request?: unknown;
    response?: Response<T>;
    constructor(message?: string, config?: RequestConfig);
}
/** 判断是否为取消错误（鸭子类型：识别 `__CANCEL__` 标记）。 */
declare function isCancel(value: unknown): boolean;
/** 判断是否为 Axios 风格错误（识别 `isAxiosError` 标记）。 */
declare function isAxiosError<T = unknown>(payload: unknown): payload is RequestError<T>;
type FulfilledHandler<V> = (value: V) => V | Promise<V>;
type RejectedHandler = (error: unknown) => unknown;
interface InterceptorRecord<V> {
    fulfilled?: FulfilledHandler<V>;
    rejected?: RejectedHandler;
}
interface InterceptorManager<V> {
    use(onFulfilled?: FulfilledHandler<V> | null, onRejected?: RejectedHandler | null): number;
    eject(id: number): void;
    forEach(fn: (interceptor: InterceptorRecord<V>) => void): void;
}
interface Instance {
    <T = unknown>(config: RequestConfig): RequestPromise<T>;
    <T = unknown>(url: string, config?: RequestConfig): RequestPromise<T>;
    defaults: RequestConfig;
    interceptors: {
        request: InterceptorManager<RequestConfig>;
        response: InterceptorManager<Response>;
    };
    request<T = unknown, D = unknown>(config: RequestConfig<D>): RequestPromise<T>;
    request<T = unknown, D = unknown>(url: string, config?: RequestConfig<D>): RequestPromise<T>;
    get<T = unknown>(url: string, config?: RequestConfig): RequestPromise<T>;
    delete<T = unknown>(url: string, config?: RequestConfig): RequestPromise<T>;
    head<T = unknown>(url: string, config?: RequestConfig): RequestPromise<T>;
    options<T = unknown>(url: string, config?: RequestConfig): RequestPromise<T>;
    trace<T = unknown>(url: string, config?: RequestConfig): RequestPromise<T>;
    post<T = unknown, D = unknown>(url: string, data?: D, config?: RequestConfig<D>): RequestPromise<T>;
    put<T = unknown, D = unknown>(url: string, data?: D, config?: RequestConfig<D>): RequestPromise<T>;
    patch<T = unknown, D = unknown>(url: string, data?: D, config?: RequestConfig<D>): RequestPromise<T>;
    postForm<T = unknown, D = unknown>(url: string, data?: D, config?: RequestConfig<D>): RequestPromise<T>;
    putForm<T = unknown, D = unknown>(url: string, data?: D, config?: RequestConfig<D>): RequestPromise<T>;
    patchForm<T = unknown, D = unknown>(url: string, data?: D, config?: RequestConfig<D>): RequestPromise<T>;
    /** 由 url + params/baseURL 拼出完整请求地址，不发送请求。 */
    getUri(config?: RequestConfig): string;
    /** 兼容方法：等价于 `Promise.all`，保留以兼容旧版本调用。 */
    all<T>(values: Array<T | Promise<T>>): Promise<T[]>;
    /** 兼容方法：将多参回调转为数组参数形式，保留以兼容旧版本调用。 */
    spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R;
    create(config?: RequestConfig): Instance;
    isCancel(value: unknown): boolean;
    isAxiosError<T = unknown>(payload: unknown): payload is RequestError<T>;
    /** 挂载在默认实例上的取消错误构造器（axios 风格，兼容 UMD 直接引用）。 */
    CanceledError: typeof CanceledError;
}
interface RequestStatic extends Instance {
    create(config?: RequestConfig): Instance;
    all<T>(values: Array<T | Promise<T>>): Promise<T[]>;
}

declare const request: Instance;

export { type BaseData, CanceledError, type HeadersMap, type Instance, type InterceptorManager, type Method, type RequestConfig, type RequestError, type RequestHeaders, type RequestPromise, type RequestStatic, type Response, request as default, isAxiosError, isCancel };
