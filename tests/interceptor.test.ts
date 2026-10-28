import InterceptorManager from "../src/InterceptorManager";
import type { InterceptorRecord } from "../src/types";

describe("InterceptorManager", () => {
  it("registers, iterates, and ejects handlers", () => {
    const manager = new InterceptorManager<number>();
    const fulfilled = vi.fn((value: number) => value + 1);
    const id = manager.use(fulfilled);
    const handlers: InterceptorRecord<number>[] = [];

    manager.forEach((handler) => handlers.push(handler));
    expect(handlers).toHaveLength(1);
    expect(handlers[0].fulfilled?.(1)).toBe(2);

    manager.eject(id);
    manager.forEach((handler) => handlers.push(handler));
    expect(handlers).toHaveLength(1);
  });

  it("keeps rejected handlers and execution order", () => {
    const manager = new InterceptorManager<string>();
    const order: string[] = [];
    manager.use((value) => {
      order.push(`first:${value}`);
      return value;
    });
    manager.use(
      (value) => {
        order.push(`second:${value}`);
        return value;
      },
      (error: unknown) => {
        order.push(`rejected:${String(error)}`);
      },
    );

    const collected: InterceptorRecord<string>[] = [];
    manager.forEach((handler) => collected.push(handler));
    expect(collected).toHaveLength(2);
    collected.forEach((handler) => handler.fulfilled?.("v"));
    collected[1].rejected?.("boom");
    expect(order).toEqual(["first:v", "second:v", "rejected:boom"]);
  });
});
