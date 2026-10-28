import { expectTypeOf } from "vitest";
import { dispatchRequest } from "../src/core/dispatchRequest";
import { isCancel } from "../src/types";
import type { WxRequestOptions } from "../src/types";

function mockWx(impl: (options: WxRequestOptions) => { abort?: () => void }) {
  const calls: WxRequestOptions[] = [];
  const abort = vi.fn();
  (globalThis as Record<string, unknown>).wx = {
    request: (options: WxRequestOptions) => {
      calls.push(options);
      const task = impl(options) ?? {};
      return { abort: task.abort ?? abort };
    },
  };
  return { calls, abort };
}

function succeed(options: WxRequestOptions) {
  options.success?.({
    data: { id: 1 },
    header: { "content-type": "application/json" },
    statusCode: 200,
  });
  // 真实 wx.request 在成功/失败后都会触发 complete。
  options.complete?.();
  return {};
}

describe("dispatchRequest", () => {
  it("builds the url, flattens headers and maps the wx response", async () => {
    const { calls } = mockWx(succeed);
    const response = await dispatchRequest({
      url: "/users",
      method: "get",
      baseURL: "https://api.example.com",
      params: { page: 1 },
      headers: { common: { Accept: "application/json" }, get: { "X-Method": "1" } },
    });

    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe("https://api.example.com/users?page=1");
    expect(calls[0].header).toEqual({ Accept: "application/json", "X-Method": "1" });
    expect(response).toMatchObject({ status: 200, statusText: "ok", data: { id: 1 } });
    expect(response.headers).toEqual({ "content-type": "application/json" });
  });

  it("keeps request/response generics flowing", async () => {
    mockWx(succeed);
    const response = await dispatchRequest<{ id: number }>({ url: "/users/1" });
    expectTypeOf(response.data).toEqualTypeOf<{ id: number }>();
    expect(response.data.id).toBe(1);
  });

  it("applies transform hooks and the complete callback", async () => {
    const { calls } = mockWx(succeed);
    const complete = vi.fn();
    await dispatchRequest({
      url: "/users",
      method: "post",
      data: { name: "a" },
      transformRequest: (data) => ({ ...(data as Record<string, unknown>), token: "t" }),
      transformResponse: (data) => ({ ...(data as Record<string, unknown>), wrapped: true }),
      complete,
    });

    expect(calls[0].data).toEqual({ name: "a", token: "t" });
    expect(complete).toHaveBeenCalledTimes(1);
  });

  it("rejects with an axios-style error when validateStatus fails", async () => {
    mockWx((options) => {
      options.success?.({ data: "nope", header: {}, statusCode: 500 });
      return {};
    });

    const error = await dispatchRequest({ url: "/boom", validateStatus: (s) => s < 400 }).catch(
      (err: unknown) => err,
    );
    expect(error).toMatchObject({ isAxiosError: true, code: "ERR_BAD_RESPONSE" });
  });

  it("rejects with a cancelable error when the signal is already aborted", async () => {
    const { calls } = mockWx(succeed);
    const controller = new AbortController();
    controller.abort();

    const error = await dispatchRequest({ url: "/users", signal: controller.signal }).catch(
      (err: unknown) => err,
    );
    expect(calls).toHaveLength(0);
    expect(isCancel(error)).toBe(true);
  });

  it("aborts the wx task and rejects when the signal aborts mid-flight", async () => {
    const abort = vi.fn();
    mockWx(() => ({ abort }));
    const controller = new AbortController();

    const pending = dispatchRequest({ url: "/users", signal: controller.signal });
    const assertion = expect(pending).rejects.toMatchObject({ __CANCEL__: true });
    controller.abort();
    await assertion;
    expect(abort).toHaveBeenCalledTimes(1);
  });

  it("preserves the legacy timeout semantics", async () => {
    vi.useFakeTimers();
    try {
      const abort = vi.fn();
      mockWx(() => ({ abort }));
      const pending = dispatchRequest({ url: "/slow", timeout: 1500 });
      await vi.advanceTimersByTimeAsync(1600);
      await expect(pending).resolves.toMatchObject({ status: "canceled" });
      expect(abort).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });
});
