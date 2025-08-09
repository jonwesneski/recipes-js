import { type StateCreator } from 'zustand';

type StoreValueSetter<State> = {
  (
    _partial:
      | State
      | Partial<State>
      | ((_state: State) => State | Partial<State>),
    _replace?: false,
  ): void;
  (_state: State | ((_state: State) => State), _replace: true): void;
};

export type Middleware<State> = (
  _action: string,
  _set: StoreValueSetter<State>,
  _get: () => State,
) => void;

export function applyMiddleware<State extends object>({
  store,
  beforeMiddlware,
  afterMiddlware,
}: {
  store: StateCreator<State>;
  beforeMiddlware?: Middleware<State>;
  afterMiddlware?: Middleware<State>;
}): StateCreator<State> {
  return (set, get, storeApi) => {
    /** Wrap each store action with middleware: beforeMiddleware runs before, afterMiddleware runs after the action executes. */
    function storeWrapper<P extends unknown[], R>(
      fn: (..._args: P) => R, // The original function
    ): (..._args: P) => R {
      return (...args: P): R => {
        beforeMiddlware?.(fn.name, set, get);
        const result = fn(...args);
        afterMiddlware?.(fn.name, set, get);
        return result;
      };
    }

    const initializedStore = store(set, get, storeApi);

    for (const key in initializedStore) {
      if (Object.prototype.hasOwnProperty.call(initializedStore, key)) {
        if (typeof initializedStore[key] === 'function') {
          initializedStore[key] = storeWrapper(
            initializedStore[key] as (..._args: unknown[]) => unknown,
          ) as State[Extract<keyof State, string>];
        }
      }
    }
    return initializedStore;
  };
}
