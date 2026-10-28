import type {
  FulfilledHandler,
  InterceptorManager as InterceptorManagerInterface,
  InterceptorRecord,
  RejectedHandler,
} from "./types";

export default class InterceptorManager<V> implements InterceptorManagerInterface<V> {
  handlers: Array<InterceptorRecord<V> | null> = [];

  use(fulfilled?: FulfilledHandler<V> | null, rejected?: RejectedHandler | null): number {
    this.handlers.push({
      fulfilled: fulfilled ?? undefined,
      rejected: rejected ?? undefined,
    });
    return this.handlers.length - 1;
  }

  eject(id: number): void {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  forEach(fn: (interceptor: InterceptorRecord<V>) => void): void {
    this.handlers.forEach((interceptor) => {
      if (interceptor !== null) {
        fn(interceptor);
      }
    });
  }
}
