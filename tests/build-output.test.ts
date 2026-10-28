import { existsSync } from "node:fs";
import { createRequire } from "node:module";

const distUrl = new URL("../dist/index.js", import.meta.url);

// 构建产物测试：dist 被 git 忽略，本地未构建时跳过，由 CI 中 build 之后执行覆盖。
describe.runIf(existsSync(distUrl))("build output (dist/index.js)", () => {
  it("exposes the callable instance directly via require", async () => {
    (globalThis as Record<string, unknown>).wx = {
      request: (options: { success?: (res: unknown) => void; complete?: () => void }) => {
        options.success?.({ data: { ok: true }, header: {}, statusCode: 200 });
        options.complete?.();
        return { abort: () => undefined };
      },
    };

    const require = createRequire(import.meta.url);
    const exported: unknown = require("../dist/index.js");

    // 兼容性断言：必须可直接调用，而不是 { default } 命名空间。
    expect(typeof exported).toBe("function");
    const instance = exported as {
      get: (url: string) => Promise<{ status: number; data: unknown }>;
      postForm: unknown;
      isCancel: unknown;
      isAxiosError: unknown;
      CanceledError: unknown;
    };
    expect(typeof instance.postForm).toBe("function");
    expect(typeof instance.isCancel).toBe("function");
    expect(typeof instance.isAxiosError).toBe("function");
    expect(typeof instance.CanceledError).toBe("function");

    const response = await instance.get("/users");
    expect(response.status).toBe(200);
  });

  it("exposes real named exports via ESM import", async () => {
    (globalThis as Record<string, unknown>).wx = {
      request: (options: { success?: (res: unknown) => void; complete?: () => void }) => {
        options.success?.({ data: { ok: true }, header: {}, statusCode: 200 });
        options.complete?.();
        return { abort: () => undefined };
      },
    };

    // 非字面量路径：避免 tsc 解析构建产物，同时绕过 vite 的静态分析。
    const esmPath = "../dist/index.mjs";
    const esm = (await import(/* @vite-ignore */ esmPath)) as unknown as {
      default: { get: (url: string) => Promise<{ status: number }> };
      isCancel: (value: unknown) => boolean;
      isAxiosError: (payload: unknown) => boolean;
      CanceledError: new (message?: string) => Error;
    };

    expect(typeof esm.isCancel).toBe("function");
    expect(typeof esm.isAxiosError).toBe("function");
    expect(typeof esm.CanceledError).toBe("function");
    expect(esm.isCancel(new esm.CanceledError("boom"))).toBe(true);

    const response = await esm.default.get("/users");
    expect(response.status).toBe(200);
  });
});
