/** Tiny className joiner — avoids a dependency for conditional classes. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
