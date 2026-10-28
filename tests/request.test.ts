import request from "../src";
import type { WxRequestOptions } from "../src/types";

describe("request instance", () => {
  it("builds a URI and supports form aliases", () => {
    expect(request.getUri({ url: "/users", params: { page: 1 } })).toBe("/users?page=1");
    expect(typeof request.postForm).toBe("function");
    expect(typeof request.putForm).toBe("function");
    expect(typeof request.patchForm).toBe("function");
  });

  it("exposes axios-style error guards", () => {
    const error = new Error("cancelled");
    Object.assign(error, { __CANCEL__: true });
    expect(request.isCancel(error)).toBe(true);
    expect(request.isAxiosError({ isAxiosError: true })).toBe(true);
  });

  it("sends form aliases with the form content type", async () => {
    const calls: WxRequestOptions[] = [];
    (globalThis as Record<string, unknown>).wx = {
      request: (options: WxRequestOptions) => {
        calls.push(options);
        options.success?.({ data: { ok: true }, header: {}, statusCode: 200 });
        options.complete?.();
        return { abort: () => undefined };
      },
    };

    const response = await request.postForm<{ ok: boolean }>("/form", { name: "a" });
    expect(calls).toHaveLength(1);
    expect(calls[0].header?.["Content-Type"]).toBe("multipart/form-data");
    expect(calls[0].data).toEqual({ name: "a" });
    expect(response.data).toEqual({ ok: true });
  });
});
