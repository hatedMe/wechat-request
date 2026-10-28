/**
 * 通用工具函数（TypeScript 迁移版）。
 *
 * 行为与原实现保持兼容，另修复 `merge`/`deepMerge` 丢失深层字段的问题：
 * 原实现中递归合并的返回值被丢弃，随后的浅赋值会覆盖深层结果。
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

export function bind<T extends AnyFunction>(fn: T, thisArg: unknown): T {
  return function warp(...args: Parameters<T>): ReturnType<T> {
    return fn.apply(thisArg, args);
  } as T;
}

export function extend<T extends object, B extends object>(a: T, b: B, thisArg?: unknown): T & B {
  const keys = Object.getOwnPropertyNames(b) as Array<keyof B>;
  keys.forEach((attr) => {
    const value = b[attr];
    if (thisArg && typeof value === "function") {
      (a as AnyRecord)[attr as string] = bind(value as AnyFunction, thisArg);
    } else {
      (a as AnyRecord)[attr as string] = value;
    }
  });
  return a as T & B;
}

export function copyobj<T extends object, B extends object>(a: T, b: B): T & B {
  return Object.assign({}, a, b);
}

function isPlainObject(value: unknown): value is AnyRecord {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/** 浅合并：返回新对象，不修改入参；跳过 null/undefined 来源。 */
export function merge<T = AnyRecord>(...sources: Array<object | null | undefined>): T {
  const result = {} as AnyRecord;
  sources.forEach((source) => {
    if (!source || typeof source !== "object") {
      return;
    }
    Object.keys(source).forEach((key) => {
      result[key] = (source as AnyRecord)[key];
    });
  });
  return result as T;
}

/**
 * 深合并：纯对象逐层合并并保留双方字段，数组按替换处理（拷贝一份，
 * 避免多实例共享引用）；其他类型（含函数）以后者为准直接引用。
 */
export function deepMerge<T = AnyRecord>(...sources: Array<object | null | undefined>): T {
  const result = {} as AnyRecord;
  sources.forEach((source) => {
    if (!source || typeof source !== "object" || isEmptyObject(source)) {
      return;
    }
    Object.keys(source).forEach((key) => {
      const incoming = (source as AnyRecord)[key];
      const existing = result[key];
      if (isPlainObject(incoming)) {
        result[key] = deepMerge(isPlainObject(existing) ? existing : {}, incoming);
      } else if (Array.isArray(incoming)) {
        result[key] = incoming.slice();
      } else {
        result[key] = incoming;
      }
    });
  });
  return result as T;
}

export function isEmptyObject(obj: unknown): boolean {
  if (!obj || typeof obj !== "object") {
    return true;
  }
  return Object.getOwnPropertyNames(obj).length === 0;
}

export function isObject(obj: unknown): obj is AnyRecord {
  return obj !== null && typeof obj === "object";
}

export function combineURLs(baseURL: string, relativeURL?: string): string {
  return relativeURL
    ? `${baseURL.replace(/\/+$/, "")}/${relativeURL.replace(/^\/+/, "")}`
    : baseURL;
}

function encode(val: unknown): string {
  return encodeURIComponent(String(val))
    .replace(/%40/gi, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",")
    .replace(/%20/g, "+")
    .replace(/%5B/gi, "[")
    .replace(/%5D/gi, "]");
}

export function buildURL(url: string, paramsObject?: Record<string, unknown>): string {
  if (!paramsObject || isEmptyObject(paramsObject)) {
    return url;
  }
  const parts: string[] = [];
  Object.keys(paramsObject).forEach((key) => {
    parts.push(`${encode(key)}=${encode(paramsObject[key])}`);
  });
  return `${url}${url.indexOf("?") === -1 ? "?" : "&"}${parts.join("&")}`;
}

export function isAbsoluteURL(url?: string): boolean {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url ?? "");
}

/** 过滤掉 null/undefined 的请求体字段；非对象或空对象返回空对象。 */
export function buildData(data: unknown): AnyRecord {
  if (!isObject(data) || isEmptyObject(data)) {
    return {};
  }
  const result: AnyRecord = {};
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && typeof data[key] !== "undefined") {
      result[key] = data[key];
    }
  });
  return result;
}
