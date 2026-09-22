/**
 * Trafficomm motion tokens — mirrored as CSS custom properties in globals.css
 * (`--dur-*`, `--ease-*`). Use these, not ad-hoc numbers, so motion reads as
 * one system across pages.
 *
 * Semantics
 * - signal:     a red point carrying work along a path. Linear, constant speed.
 * - node:       a stage/platform becoming active. Ring + fill, fast.
 * - line:       a connector drawing in (stroke-dashoffset / scaleX).
 * - reveal:     content entering once on scroll. Fade + 18px rise.
 * - settle:     a metric arriving. Fade + 10px rise, then baseline draws. No counting.
 * - progress:   workflow stage advancing (queued → in progress → complete).
 * - hover:      pointer/focus feedback. ≤ 200ms, colour/2–4px translate only.
 */
export const duration = {
  instant: 120,
  fast: 200,
  base: 400,
  slow: 700,
  reveal: 900,
  /** Time a signal spends travelling between two workflow stages. */
  signalStep: 1400,
  /** Short burst when a platform/stage is activated by the user. */
  burst: 900,
} as const;

export const ease = {
  /** Entrances, settles, node activation. */
  out: "cubic-bezier(0.16, 1, 0.3, 1)",
  /** Hover / UI state changes. */
  standard: "cubic-bezier(0.2, 0, 0, 1)",
  /** Signals: constant speed reads as a data stream. */
  linear: "linear",
} as const;

export const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
