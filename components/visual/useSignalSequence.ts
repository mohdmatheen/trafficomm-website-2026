"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInView, usePrefersReducedMotion } from "@/components/motion/useInView";
import { duration } from "@/lib/motion/tokens";

/**
 * Drives one explanatory sequence: a Trafficomm signal advancing through N
 * stages. The sequence plays once when the component is ~35% in view, then
 * stops on the final stage and stays interactive.
 *
 * Rules this encodes (see the visual storytelling brief):
 * - Reduced motion (and server render): the final stage is active immediately,
 *   so the complete state is always the default. Nothing is hidden by motion.
 * - Selecting a stage pins it and ends the auto sequence — no fighting the user.
 * - The loop never repeats on re-scroll.
 * - `restOn` decides where the sequence settles. It defaults to the final
 *   stage; a visual passes its entry or overview index instead so the page
 *   comes to rest at the beginning of the story, not the end.
 */
export function useSignalSequence(count: number, stepMs: number = duration.signalStep, restOn?: number) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.35 });
  const reduced = usePrefersReducedMotion();
  // Complete state is the default: SSR, no-JS and reduced motion all show it.
  const [active, setActive] = useState(count - 1);
  const [playing, setPlaying] = useState(false);
  const pinned = useRef(false);
  const played = useRef(false);

  useEffect(() => {
    if (reduced || played.current || !inView || pinned.current) return;
    played.current = true;
    setPlaying(true);
    setActive(0);
    let i = 0;
    let rest: ReturnType<typeof setTimeout> | undefined;
    const id = setInterval(() => {
      if (pinned.current) {
        clearInterval(id);
        setPlaying(false);
        return;
      }
      i += 1;
      setActive(i);
      if (i >= count - 1) {
        clearInterval(id);
        setPlaying(false);
        if (restOn !== undefined && restOn !== count - 1) {
          rest = setTimeout(() => {
            if (!pinned.current) setActive(restOn);
          }, stepMs);
        }
      }
    }, stepMs);
    return () => {
      clearInterval(id);
      if (rest) clearTimeout(rest);
    };
  }, [inView, reduced, count, stepMs, restOn]);

  /** User selection: pins the stage and stops the sequence. */
  const select = useCallback((i: number) => {
    pinned.current = true;
    played.current = true;
    setPlaying(false);
    setActive(i);
  }, []);

  return { ref, active, playing, select, reduced };
}
