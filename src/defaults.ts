import { merge } from "./helpers/util";
import type { RequestConfig } from "./types";

const DEFAULT_CONTENT_TYPE = {
  "Content-Type": "application/x-www-form-urlencoded",
};

const METHOD_HEADERS_KEYS = [
  "delete",
  "get",
  "head",
  "options",
  "trace",
  "post",
  "put",
  "patch",
] as const;

const defaults: RequestConfig = {
  method: "get", // default
  // baseURL: '',
  dataType: "json",
  responseType: "text",
  // timeout: 0,
  headers: {},

  // params: {},

  transformRequest(data) {
    return data;
  },

  transformResponse(data) {
    return data;
  },

  validateStatus() {
    return true;
  },
};

defaults.headers = {
  common: {
    Accept: "application/json, text/plain, */*",
  },
};

// 每个方法只携带自身的默认请求头；旧实现把整个 headers 对象合并进来，
// 会在各方法下残留 common 及其他方法的嵌套对象。
METHOD_HEADERS_KEYS.forEach((key) => {
  defaults.headers![key] = merge({}, DEFAULT_CONTENT_TYPE);
});

export default defaults;
