import { buildURL, deepMerge, merge } from "../src/helpers/util";

describe("request utilities", () => {
  it("deeply merges nested configuration objects", () => {
    expect(
      deepMerge(
        { headers: { common: { Accept: "application/json" } } },
        { headers: { post: { Authorization: "token" } } },
      ),
    ).toEqual({
      headers: {
        common: { Accept: "application/json" },
        post: { Authorization: "token" },
      },
    });
  });

  it("merges flat values without mutating inputs", () => {
    const source = { timeout: 1000 };
    expect(merge(source, { baseURL: "/api" })).toEqual({ timeout: 1000, baseURL: "/api" });
    expect(source).toEqual({ timeout: 1000 });
  });

  it("serializes query parameters", () => {
    expect(buildURL("/users", { page: 2, active: true })).toBe("/users?page=2&active=true");
  });
});
