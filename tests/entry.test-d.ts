import { describe, expectTypeOf, test } from "vitest";
import request from "../src";
import type { BaseData, Instance, RequestConfig, Response } from "../src";

describe("root source entry types", () => {
  test("default export is a callable instance", () => {
    expectTypeOf(request).toMatchTypeOf<Instance>();
    expectTypeOf(request.getUri).toEqualTypeOf<(config?: RequestConfig) => string>();
  });

  test("request supports config and url-string overloads", () => {
    expectTypeOf(request.request<{ id: number }>({ url: "/users" })).toEqualTypeOf<
      Promise<Response<{ id: number }>>
    >();
    expectTypeOf(request.request<{ id: number }>("/users")).toEqualTypeOf<
      Promise<Response<{ id: number }>>
    >();
    expectTypeOf(request.request("/users", { timeout: 1000 })).toEqualTypeOf<
      Promise<Response<unknown>>
    >();
  });

  test("aliases, form helpers and guards are typed", () => {
    expectTypeOf(request.postForm).toBeFunction();
    expectTypeOf(request.putForm).toBeFunction();
    expectTypeOf(request.patchForm).toBeFunction();
    expectTypeOf(request.isCancel).toBeFunction();
    expectTypeOf(request.isAxiosError).toBeFunction();
    expectTypeOf(request.CanceledError).toBeConstructibleWith("boom");
  });

  test("BaseData compat alias is exported", () => {
    const data: BaseData = { page: 1 };
    expectTypeOf(data).toMatchTypeOf<Record<string, unknown>>();
  });

  test("create, all and spread compat surface is typed", () => {
    const api = request.create({ baseURL: "https://api.example.com" });
    expectTypeOf(api).toMatchTypeOf<Instance>();
    expectTypeOf(request.all([Promise.resolve(1)])).toEqualTypeOf<Promise<number[]>>();
    expectTypeOf(request.spread((a: number, b: number) => a + b)).toEqualTypeOf<
      (arr: number[]) => number
    >();
  });
});
