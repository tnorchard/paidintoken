"use client";

import { useMemo, useState } from "react";
import type { ChartPoint } from "@/lib/coins";
import { formatUsd } from "@/lib/format";

const RANGES = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "1Y", days: 365 },
] as const;

const VIEW_W = 800;
const VIEW_H = 240;
const PAD = { top: 16, right: 8, bottom: 24, left: 8 };

function formatDate(t: number): string {
  return new Date(t).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PriceChart({ data }: { data: ChartPoint[] }) {
  const [rangeDays, setRangeDays] = useState<number>(30);

  const points = useMemo(() => {
    const sliced = data.slice(-rangeDays);
    if (sliced.length < 2) return null;

    const prices = sliced.map((p) => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const span = max - min || 1;

    const innerW = VIEW_W - PAD.left - PAD.right;
    const innerH = VIEW_H - PAD.top - PAD.bottom;

    const coords = sliced.map((p, i) => {
      const x = PAD.left + (i / (sliced.length - 1)) * innerW;
      const y = PAD.top + (1 - (p.price - min) / span) * innerH;
      return { ...p, x, y };
    });

    const linePath = coords
      .map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`)
      .join(" ");
    const areaPath = `${linePath} L${coords[coords.length - 1].x.toFixed(1)},${(VIEW_H - PAD.bottom).toFixed(1)} L${coords[0].x.toFixed(1)},${(VIEW_H - PAD.bottom).toFixed(1)} Z`;

    const changePercent =
      prices[0] > 0
        ? ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100
        : 0;

    return {
      coords,
      linePath,
      areaPath,
      min,
      max,
      first: sliced[0],
      last: sliced[sliced.length - 1],
      changePercent,
    };
  }, [data, rangeDays]);

  if (!points) {
    return (
      <div className="flex h-56 items-center justify-center rounded-lg border border-line bg-card text-sm text-muted">
        Chart data unavailable — check back soon.
      </div>
    );
  }

  const up = points.changePercent >= 0;

  return (
    <div className="rounded-lg border border-line bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex gap-1.5">
          {RANGES.map((range) => (
            <button
              key={range.label}
              type="button"
              onClick={() => setRangeDays(range.days)}
              className={`rounded px-2.5 py-1 text-xs font-bold transition ${
                rangeDays === range.days
                  ? "bg-ink text-surface"
                  : "text-muted hover:text-ink"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
        <p
          className={`text-sm font-bold tabular-nums ${up ? "text-up" : "text-down"}`}
        >
          {up ? "+" : ""}
          {points.changePercent.toFixed(2)}%{" "}
          <span className="font-normal text-muted">this range</span>
        </p>
      </div>

      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full"
        role="img"
        aria-label={`Price chart, ranging from ${formatUsd(points.min)} to ${formatUsd(points.max)}`}
        preserveAspectRatio="none"
        style={{ height: 240 }}
      >
        <defs>
          <linearGradient id="pit-area" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor={up ? "#22c55e" : "#ef4444"}
              stopOpacity="0.28"
            />
            <stop
              offset="100%"
              stopColor={up ? "#22c55e" : "#ef4444"}
              stopOpacity="0"
            />
          </linearGradient>
        </defs>
        <path d={points.areaPath} fill="url(#pit-area)" />
        <path
          d={points.linePath}
          fill="none"
          stroke={up ? "#22c55e" : "#ef4444"}
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx={points.coords[points.coords.length - 1].x}
          cy={points.coords[points.coords.length - 1].y}
          r="4"
          fill={up ? "#22c55e" : "#ef4444"}
        />
      </svg>

      <div className="mt-2 flex items-center justify-between text-xs text-muted">
        <span>
          {formatDate(points.first.t)} · {formatUsd(points.first.price)}
        </span>
        <span className="hidden sm:inline">
          Low {formatUsd(points.min)} · High {formatUsd(points.max)}
        </span>
        <span>
          {formatDate(points.last.t)} · {formatUsd(points.last.price)}
        </span>
      </div>
    </div>
  );
}
