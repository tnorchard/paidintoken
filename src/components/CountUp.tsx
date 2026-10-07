"use client";

import { useEffect, useRef, useState } from "react";

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function CountUp({
  value,
  format,
  duration = 900,
}: {
  value: number | null;
  format: (value: number) => string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (value === null || !Number.isFinite(value)) return;

    const from = fromRef.current;
    const delta = value - from;
    if (Math.abs(delta) < 1e-9) {
      fromRef.current = value;
      return;
    }

    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const current = from + delta * easeOutCubic(t);
      fromRef.current = current;
      setDisplay(current);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
      else fromRef.current = value;
    };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  if (value === null || !Number.isFinite(value)) return <>—</>;
  return <>{format(display)}</>;
}
