export interface BaseData {
    [key: string]: any;
}

export interface RequestPromise<T = any> extends Promise<Response<T>> {

}

export interface RequestConfig {
    url?: string ;
    method?: Method ;
    baseURL?: string ;
    headers? : BaseData;
    params? : BaseData;
    timeout? : number;
}

export interface InterceptorManager<V> {
    use(onFulfilled?: (value: V) => V | Promise<V>, onRejected?: (error: any) => any): number;
    eject(id: number): void;
}

export interface Response<T = BaseData> {
    data : T , 
    status : number ,
    statusText : string ,
    headers : T ,
    config : RequestConfig
} 

export interface RequestError<T = any> extends Error {

}

export interface Instance {
    (config: RequestConfig): RequestPromise;
    (url: string, config?: RequestConfig): RequestPromise;
    interceptors: {
        request: InterceptorManager<RequestConfig>;
        response: InterceptorManager<Response>;
    };
    request<T = any, R = Response<T>> (config: RequestConfig): Promise<R>;
    get<T = any, R = Response<T>>(url: string, config?: RequestConfig): Promise<R>;
    delete<T = any, R = Response<T>>(url: string, config?: RequestConfig): Promise<R>;
    head<T = any, R = Response<T>>(url: string, config?: RequestConfig): Promise<R>;
    post<T = any, R = Response<T>>(url: string, data?: any, config?: RequestConfig): Promise<R>;
    put<T = any, R = Response<T>>(url: string, data?: any, config?: RequestConfig): Promise<R>;
    patch<T = any, R = Response<T>>(url: string, data?: any, config?: RequestConfig): Promise<R>;
}
export interface RequestStatic extends Instance {
    create(config?: RequestConfig): Instance;
    all<T>(values: (T | Promise<T>)[]): Promise<T[]>;
}

declare const wechatRequest : RequestStatic
export default wechatRequest;