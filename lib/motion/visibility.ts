/**
 * Shared visibility system. One IntersectionObserver per distinct
 * (rootMargin, threshold) pair, shared by every component that asks, instead
 * of one observer per component instance.
 */
type Callback = (visible: boolean) => void;
type Pool = { io: IntersectionObserver; callbacks: Map<Element, Set<Callback>>; state: WeakMap<Element, boolean> };

const pools = new Map<string, Pool>();

export type VisibilityOptions = { rootMargin?: string; threshold?: number };

function getPool({ rootMargin = "0px", threshold = 0 }: VisibilityOptions): Pool {
  const key = `${rootMargin}|${threshold}`;
  let pool = pools.get(key);
  if (!pool) {
    const callbacks = new Map<Element, Set<Callback>>();
    const state = new WeakMap<Element, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          state.set(e.target, e.isIntersecting);
          callbacks.get(e.target)?.forEach((cb) => cb(e.isIntersecting));
        }
      },
      { rootMargin, threshold },
    );
    pool = { io, callbacks, state };
    pools.set(key, pool);
  }
  return pool;
}

/** Observe an element; returns an unsubscribe function. */
export function observeVisibility(el: Element, cb: Callback, options: VisibilityOptions = {}) {
  const pool = getPool(options);
  let set = pool.callbacks.get(el);
  if (!set) {
    set = new Set();
    pool.callbacks.set(el, set);
    pool.io.observe(el);
  }
  set.add(cb);
  // A late subscriber to an element that is already observed gets the last known state immediately.
  const known = pool.state.get(el);
  if (known !== undefined) queueMicrotask(() => pool.callbacks.get(el)?.has(cb) && cb(known));
  return () => {
    const s = pool.callbacks.get(el);
    if (!s) return;
    s.delete(cb);
    if (s.size === 0) {
      pool.callbacks.delete(el);
      pool.io.unobserve(el);
    }
  };
}
