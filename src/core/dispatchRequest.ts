import { buildData, buildURL, combineURLs, isAbsoluteURL, merge } from "../helpers/util";
import type {
  HeadersMap,
  RequestConfig,
  RequestError,
  Response,
  WxGlobal,
  WxRequestTask,
} from "../types";
import { CanceledError } from "../types";

declare const wx: WxGlobal;

/** 发起请求前需要从 headers 对象上剥离的方法分组键。 */
const NESTED_HEADER_KEYS = [
  "delete",
  "get",
  "head",
  "options",
  "trace",
  "post",
  "put",
  "patch",
  "common",
];

/** 由 url + params/baseURL 拼出完整请求地址，不发送请求。 */
export function getUri<D>(config: RequestConfig<D>): string {
  const url = config.url ?? "";
  const full = config.baseURL && !isAbsoluteURL(url) ? combineURLs(config.baseURL, url) : url;
  return buildURL(full, config.params);
}

export function dispatchRequest<T = unknown, D = unknown>(
  config: RequestConfig<D>,
): Promise<Response<T>> {
  config.url = getUri(config);

  const transformRequest = config.transformRequest ?? ((data: D) => data);
  config.data = transformRequest(config.data as D, config.headers) as D;

  const headers = config.headers ?? {};
  const flattened: HeadersMap = merge<HeadersMap>(
    {},
    headers.common ?? {},
    (headers[(config.method ?? "get") as string] as HeadersMap) ?? {},
    headers as HeadersMap,
  );
  NESTED_HEADER_KEYS.forEach((key) => {
    delete flattened[key];
  });
  config.headers = flattened;

  const transformResponse = config.transformResponse ?? ((data: unknown) => data);
  const validateStatus = config.validateStatus ?? (() => true);

  return new Promise<Response<T>>((resolve, reject) => {
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    // eslint-disable-next-line prefer-const -- deferred assignment: created below, closed over by the abort handler.
    let requestTask: WxRequestTask | undefined;

    const cleanup = () => {
      if (timer !== undefined) {
        clearTimeout(timer);
        timer = undefined;
      }
      if (config.signal) {
        config.signal.removeEventListener("abort", onAbort);
      }
    };
    const settleResolve = (response: Response<T>) => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      resolve(response);
    };
    const settleReject = (error: unknown) => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      reject(error);
    };
    function onAbort() {
      requestTask?.abort();
      settleReject(new CanceledError<T>("canceled", config));
    }

    if (config.signal) {
      if (config.signal.aborted) {
        settleReject(new CanceledError<T>("canceled", config));
        return;
      }
      config.signal.addEventListener("abort", onAbort, { once: true });
    }

    requestTask = wx.request({
      url: config.url ?? "",
      data: buildData(config.data),
      header: flattened,
      method: config.method,
      dataType: config.dataType,
      responseType: config.responseType,
      success: (res) => {
        const response: Response<T> = {
          data: transformResponse(res.data) as T,
          headers: res.header,
          status: res.statusCode,
          statusText: "ok",
          config,
        };
        if (!validateStatus(response.status)) {
          const error = new Error(
            `Request failed with status code ${response.status}`,
          ) as RequestError<T>;
          error.config = config;
          error.code = "ERR_BAD_RESPONSE";
          error.request = requestTask;
          error.response = response;
          error.isAxiosError = true;
          settleReject(error);
          return;
        }
        settleResolve(response);
      },
      fail: (err) => {
        settleReject(err);
      },
      complete: () => {
        config.complete?.();
      },
    });

    // 保留原有的超时语义：超时后中断请求并按取消状态 resolve。
    if (config.timeout && typeof config.timeout === "number" && config.timeout > 1000) {
      timer = setTimeout(() => {
        requestTask?.abort();
        settleResolve({
          data: undefined as T,
          headers: {},
          status: "canceled" as unknown as number,
          statusText: "canceled",
          config,
        });
      }, config.timeout);
    }
  });
}
