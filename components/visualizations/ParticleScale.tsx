"use client";

import { useEffect, useRef, useState } from "react";
import { observeVisibility } from "@/lib/motion/visibility";

/**
 * Campaign-scale signature animation, rendered to one <canvas>:
 *   a few campaign particles appear → more stream in from the edges →
 *   they organize into "10,000+" (campaigns) → break apart →
 *   reconfigure into "1M+" (creatives & placements) → loop.
 * Particles not needed for a figure drift as a faint field. DPR is capped,
 * count scales with viewport, and the loop runs only while visible.
 */
const STAGES = [
  { text: "10,000+", label: "Campaigns" },
  { text: "1M+", label: "Creatives & placements" },
] as const;

type Phase = "seed" | "influx" | "form0" | "break" | "form1";
type P = { x: number; y: number; vx: number; vy: number; tx: number; ty: number; a: number; ta: number; born: number; red: boolean };

export function ParticleScale() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState<0 | 1 | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let particles: P[] = [];
    let targets: { x: number; y: number }[][] = [];
    let raf = 0;
    let running = false;
    let ready = false;
    let disposed = false;
    let wantRun = false;
    let phase: Phase = "seed";
    let phaseAt = 0;
    let clock = 0;
    let last = 0;
    let seed = 11;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };

    const sample = (text: string) => {
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const o = off.getContext("2d")!;
      const family = getComputedStyle(document.body).fontFamily;
      o.font = `500 100px ${family}`;
      const m = o.measureText(text).width;
      const size = Math.min(h * 0.78, (w * 0.9 * 100) / m);
      o.font = `500 ${size}px ${family}`;
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.fillText(text, w / 2, h / 2);
      const data = o.getImageData(0, 0, w, h).data;
      // Sample every 5px. Mobile previously sampled every 4px; 5px cuts its particle count by ~36%.
      const gap = 5;
      const pts: { x: number; y: number }[] = [];
      for (let y = 0; y < h; y += gap) for (let x = 0; x < w; x += gap) if (data[(y * w + x) * 4 + 3] > 140) pts.push({ x, y });
      // Shuffle so particles fill the figure evenly rather than scanline by scanline.
      for (let i = pts.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        [pts[i], pts[j]] = [pts[j], pts[i]];
      }
      return pts;
    };

    const scatterTarget = (pt: P, spread = 1) => {
      pt.tx = w / 2 + (rnd() - 0.5) * w * spread;
      pt.ty = h / 2 + (rnd() - 0.5) * h * spread;
    };

    let stageAfterBreak: Phase = "form1";

    const setPhase = (p: Phase) => {
      phase = p;
      phaseAt = clock;
      if (p === "form0" || p === "form1") {
        const idx = p === "form0" ? 0 : 1;
        const t = targets[idx];
        particles.forEach((pt, i) => {
          if (i < t.length) {
            pt.tx = t[i].x + (rnd() - 0.5);
            pt.ty = t[i].y + (rnd() - 0.5);
            pt.ta = 0.55 + rnd() * 0.45;
          } else {
            // Surplus particles become a faint ambient field.
            scatterTarget(pt, 1.05);
            pt.ta = 0.1;
          }
        });
        setStage(idx);
      } else if (p === "break") {
        particles.forEach((pt) => {
          const dx = pt.x - w / 2;
          const dy = pt.y - h / 2;
          const d = Math.hypot(dx, dy) || 1;
          pt.vx += (dx / d) * (2 + rnd() * 4);
          pt.vy += (dy / d) * (2 + rnd() * 4);
          scatterTarget(pt, 1.1);
          pt.ta = 0.35;
        });
        setStage(null);
      }
    };

    const setup = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(280, Math.floor(rect.width));
      h = Math.floor(rect.height);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed = 11;
      targets = STAGES.map((s) => sample(s.text));
      const count = targets[0].length;
      particles = Array.from({ length: count }, (_, i) => {
        const early = i < 48;
        // Early particles seed near the centre; the rest enter from the edges.
        const edge = Math.floor(rnd() * 4);
        const x = early ? w / 2 + (rnd() - 0.5) * w * 0.5 : edge === 0 ? -8 : edge === 1 ? w + 8 : rnd() * w;
        const y = early ? h / 2 + (rnd() - 0.5) * h * 0.6 : edge === 2 ? -8 : edge === 3 ? h + 8 : rnd() * h;
        const pt: P = { x, y, vx: 0, vy: 0, tx: x, ty: y, a: 0, ta: 0.8, born: early ? rnd() * 700 : 700 + rnd() * 1500, red: rnd() < 0.07 };
        scatterTarget(pt, 0.9);
        return pt;
      });
      clock = 0;
      setPhase("seed");
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const pt of particles) {
        if (pt.a < 0.02) continue;
        ctx.fillStyle = pt.red ? `rgba(234,62,58,${pt.a})` : `rgba(255,255,255,${pt.a * 0.9})`;
        ctx.fillRect(pt.x, pt.y, 1.8, 1.8);
      }
    };

    const step = (dtMs: number) => {
      clock += dtMs;
      const e = clock - phaseAt;
      if (phase === "seed" && e > 700) setPhase("influx");
      else if (phase === "influx" && e > 1600) setPhase("form0");
      else if (phase === "form0" && e > 3200) setPhase("break");
      else if (phase === "break" && e > 900) setPhase(stageAfterBreak);
      else if (phase === "form1" && e > 3400) {
        stageAfterBreak = "form0";
        setPhase("break");
      }
      if (phase === "form0" && e < 20) stageAfterBreak = "form1";

      const k = phase === "form0" || phase === "form1" ? 0.07 : 0.012;
      for (const pt of particles) {
        if (clock < pt.born) continue;
        pt.vx = (pt.vx + (pt.tx - pt.x) * k) * 0.8;
        pt.vy = (pt.vy + (pt.ty - pt.y) * k) * 0.8;
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.a += (pt.ta - pt.a) * 0.06;
      }
    };
    const tick = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      step(dt);
      draw();
      if (running) raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running || reduce || !ready) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const showStatic = () => {
      // Reduced motion: the first figure, fully formed, no movement.
      const t = targets[0];
      particles.forEach((pt, i) => {
        pt.x = t[i % t.length].x;
        pt.y = t[i % t.length].y;
        pt.a = 0.8;
      });
      draw();
      setStage(0);
    };

    // Lazy init: glyph sampling and particle allocation happen only once the
    // section first comes into view (and the webfont is ready).
    let fontsReady = false;
    const init = () => {
      if (ready || disposed || !fontsReady || !wantRun) return;
      setup();
      ready = true;
      if (reduce) showStatic();
      else start();
    };
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
      fontsReady = true;
      init();
    });

    const offVisibility = observeVisibility(
      wrap,
      (visible) => {
        wantRun = visible;
        if (!ready) return init();
        if (visible) start();
        else stop();
      },
      { rootMargin: "200px 0px" },
    );

    let resizeTimer: ReturnType<typeof setTimeout>;
    let lastW = wrap.getBoundingClientRect().width;
    const ro = new ResizeObserver(() => {
      const nw = wrap.getBoundingClientRect().width;
      if (Math.abs(nw - lastW) < 2) return;
      lastW = nw;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!ready) return;
        setup();
        if (reduce) showStatic();
      }, 150);
    });
    ro.observe(wrap);

    return () => {
      disposed = true;
      stop();
      offVisibility();
      ro.disconnect();
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <div>
      <div ref={wrapRef} className="relative h-[190px] w-full sm:h-[280px] lg:h-[360px]">
        <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />
        <p className="sr-only">10,000+ campaigns handled and 1M+ creatives and placements handled.</p>
      </div>
      <div className="mt-8 grid grid-cols-2 border-t border-line-dark" aria-hidden="true">
        {STAGES.map((s, i) => (
          <div key={s.label} className={`flex flex-col items-center gap-2 pt-5 transition-opacity duration-700 ${stage === i ? "opacity-100" : "opacity-35"}`}>
            <span className="flex items-center gap-2 font-mono text-[1.03rem] text-white tabular sm:text-[1.1rem]">
              <span className={`size-1.5 rounded-full transition-colors duration-700 ${stage === i ? "bg-signal" : "bg-mute"}`} />
              {s.text}
            </span>
            <span className="eyebrow text-center !text-[0.68rem] text-fog sm:!text-[0.77rem]">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
