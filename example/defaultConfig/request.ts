import wxRequest from "wechat-request";
import type { RequestConfig } from "wechat-request";

declare const AUTH_TOKEN: string;

// 针对post请求增加token
wxRequest.interceptors.request.use(
  (config: RequestConfig) => {
    if (config.method === "post") {
      config.headers = {
        ...(config.headers ?? {}),
        common: {
          ...(config.headers?.common ?? {}),
          Authorization: AUTH_TOKEN,
        },
      };
    }
    return config;
  },
  (err: unknown) => Promise.reject(err),
);

export default wxRequest;
