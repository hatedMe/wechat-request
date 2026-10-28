import defaultRequest from "../src/request";

const API_SURFACE = [
  "request",
  "get",
  "delete",
  "head",
  "options",
  "trace",
  "post",
  "put",
  "patch",
  "postForm",
  "putForm",
  "patchForm",
  "getUri",
  "all",
  "spread",
  "create",
  "isCancel",
  "isAxiosError",
  "CanceledError",
  "defaults",
  "interceptors",
] as const;

describe("default export compatibility", () => {
  it("is a callable instance carrying the full api surface", () => {
    expect(typeof defaultRequest).toBe("function");
    API_SURFACE.forEach((key) => {
      expect(defaultRequest[key], key).not.toBeUndefined();
    });
  });

  it("create isolates instances from each other", () => {
    const a = defaultRequest.create({ baseURL: "https://a.example.com" });
    const b = defaultRequest.create({ baseURL: "https://b.example.com" });

    expect(a.getUri({ url: "/users" })).toBe("https://a.example.com/users");
    expect(b.getUri({ url: "/users" })).toBe("https://b.example.com/users");

    a.defaults.headers!.common!.Authorization = "token-a";
    expect(b.defaults.headers?.common?.Authorization).toBeUndefined();
  });

  it("all resolves mixed values and spread expands the array", async () => {
    await expect(defaultRequest.all([1, Promise.resolve(2)])).resolves.toEqual([1, 2]);
    expect(defaultRequest.spread((a: number, b: number) => a + b)([1, 2])).toBe(3);
  });

  it("request accepts the url-string overload at runtime", async () => {
    (globalThis as Record<string, unknown>).wx = {
      request: (options: { success?: (res: unknown) => void; complete?: () => void }) => {
        options.success?.({ data: { ok: true }, header: {}, statusCode: 200 });
        options.complete?.();
        return { abort: () => undefined };
      },
    };

    const response = await defaultRequest.request("/users");
    expect(response.status).toBe(200);
  });
});
