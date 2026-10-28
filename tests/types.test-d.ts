import { describe, expectTypeOf, test } from "vitest";
import type {
  Instance,
  InterceptorManager,
  Method,
  RequestConfig,
  RequestError,
  Response,
} from "../src/types";
import { CanceledError, isAxiosError, isCancel } from "../src/types";
import { buildURL, deepMerge, merge } from "../src/helpers/util";

describe("public types", () => {
  test("method covers case-insensitive aliases", () => {
    expectTypeOf<Method>().toMatchTypeOf<string>();
    expectTypeOf<"get">().toMatchTypeOf<Method>();
    expectTypeOf<"POST">().toMatchTypeOf<Method>();
  });

  test("request config supports generics, signal and hooks", () => {
    const config: RequestConfig<{ name: string }> = {
      url: "/users",
      method: "post",
      timeout: 3000,
      signal: new AbortController().signal,
      transformRequest: (data) => data,
      transformResponse: (data) => data,
      validateStatus: (status) => status >= 200 && status < 300,
    };
    expectTypeOf(config.data).toEqualTypeOf<{ name: string } | undefined>();
  });

  test("response carries the data generic", () => {
    const response: Response<{ id: number }> = {
      data: { id: 1 },
      status: 200,
      statusText: "ok",
      headers: {},
      config: {},
    };
    expectTypeOf(response.data).toEqualTypeOf<{ id: number }>();
  });

  test("cancel and error helpers are typed", () => {
    expectTypeOf(isCancel("nope")).toEqualTypeOf<boolean>();
    expectTypeOf(isAxiosError("nope")).toEqualTypeOf<boolean>();
    const canceled = new CanceledError("canceled");
    expectTypeOf(canceled).toMatchTypeOf<RequestError>();
    expectTypeOf(canceled.__CANCEL__).toEqualTypeOf<true>();
  });

  test("interceptor manager and instance shapes", () => {
    expectTypeOf<InterceptorManager<RequestConfig>>().toMatchTypeOf<{
      use: (...args: never[]) => number;
    }>();
    expectTypeOf<Instance>().toMatchTypeOf<{
      getUri: (config?: RequestConfig) => string;
    }>();
  });

  test("utils keep explicit input/output types", () => {
    expectTypeOf(merge({ a: 1 }, { b: "x" })).toMatchTypeOf<Record<string, unknown>>();
    expectTypeOf(
      deepMerge({ headers: { common: { a: "1" } } }, { headers: { post: { b: "2" } } }),
    ).toMatchTypeOf<Record<string, unknown>>();
    expectTypeOf(buildURL("/u", { page: 1 })).toEqualTypeOf<string>();
  });
});
