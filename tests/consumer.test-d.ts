import { describe, expectTypeOf, test } from "vitest";
// 消费者视角：直接引用构建产物根声明，而非源码类型。
import entry, { CanceledError, isAxiosError, isCancel } from "../index";
import type { BaseData, Instance, Response } from "../index";

describe("generated declaration entry", () => {
  test("default export is callable", () => {
    expectTypeOf(entry).toMatchTypeOf<Instance>();
    expectTypeOf(entry.get<{ id: number }>("/users")).toEqualTypeOf<
      Promise<Response<{ id: number }>>
    >();
  });

  test("named helpers exist", () => {
    expectTypeOf(isCancel).toBeFunction();
    expectTypeOf(isAxiosError).toBeFunction();
    expectTypeOf(CanceledError).toBeConstructibleWith("boom");
  });

  test("BaseData is exported", () => {
    const data: BaseData = { page: 1 };
    expectTypeOf(data).toMatchTypeOf<Record<string, unknown>>();
  });
});
