"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChartPoint } from "@/lib/coins";
import { formatCompactUsd, formatUsd } from "@/lib/format";
import { useMarket } from "./MarketProvider";

const RANGES = [
  { label: "7D", days: 7, phrase: "past 7 days" },
  { label: "30D", days: 30, phrase: "past 30 days" },
  { label: "90D", days: 90, phrase: "past 90 days" },
  { label: "1Y", days: 365, phrase: "past year" },
] as const;

const HEIGHT = 280;
const PAD = { top: 14, right: 14, bottom: 30, left: 58 };

function axisPrice(value: number): string {
  return value < 1 ? formatUsd(value) : formatCompactUsd(value);
}

function shortDate(t: number, withYear: boolean): string {
  return new Date(t).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(withYear ? { year: "numeric" } : {}),
  });
}

function fullDate(t: number): string {
  return new Date(t).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PriceChart({
  data,
  selectable = false,
  initialId,
}: {
  data: ChartPoint[];
  selectable?: boolean;
  initialId?: string;
}) {
  const { markets } = useMarket();
  const universe = markets?.universe ?? [];

  const [coinId, setCoinId] = useState(initialId ?? "bitcoin");
  const [fetched, setFetched] = useState<{
    id: string;
    points: ChartPoint[];
  } | null>(null);
  const [fetching, setFetching] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [rangeDays, setRangeDays] = useState<number>(30);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [width, setWidth] = useState(800);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef(0);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.width ?? 0;
      if (next > 0) setWidth(next);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  function selectCoin(id: string) {
    setCoinId(id);
    if (!selectable) return;
    if (id === initialId || fetched?.id === id) return;

    const request = ++requestRef.current;
    setFetching(true);
    setFetchFailed(false);

    fetch(`/api/chart/${id}`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((json: { points?: ChartPoint[] }) => {
        if (requestRef.current !== request) return;
        if (Array.isArray(json.points) && json.points.length > 0) {
          setFetched({ id, points: json.points });
        } else {
          setFetchFailed(true);
        }
      })
      .catch(() => {
        if (requestRef.current === request) setFetchFailed(true);
      })
      .finally(() => {
        if (requestRef.current === request) setFetching(false);
      });
  }

  const series = useMemo(() => {
    if (!selectable) return data;
    if (coinId === initialId) return data;
    if (fetched?.id === coinId) return fetched.points;
    return null;
  }, [selectable, data, coinId, initialId, fetched]);

  const activeRange = RANGES.find((range) => range.days === rangeDays) ?? RANGES[1];
  const selectedCoin = universe.find((coin) => coin.id === coinId);

  const view = useMemo(() => {
    if (!series || series.length < 2) return null;

    const sliced = series.slice(-rangeDays);
    if (sliced.length < 2) return null;

    const prices = sliced.map((point) => point.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const span = max - min || 1;

    const innerW = Math.max(10, width - PAD.left - PAD.right);
    const innerH = HEIGHT - PAD.top - PAD.bottom;

    const coords = sliced.map((point, index) => ({
      ...point,
      x: PAD.left + (index / (sliced.length - 1)) * innerW,
      y: PAD.top + (1 - (point.price - min) / span) * innerH,
    }));

    const linePath = coords
      .map((point, index) =>
        `${index === 0 ? "M" : "L"}${point.x.toFixed(1)},${point.y.toFixed(1)}`,
      )
      .join(" ");
    const areaPath = `${linePath} L${coords[coords.length - 1].x.toFixed(1)},${(HEIGHT - PAD.bottom).toFixed(1)} L${coords[0].x.toFixed(1)},${(HEIGHT - PAD.bottom).toFixed(1)} Z`;

    const changePercent =
      prices[0] > 0
        ? ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100
        : 0;

    const yTicks = [0, 1, 2, 3].map((step) => {
      const ratio = step / 3;
      return {
        y: PAD.top + (1 - ratio) * innerH,
        value: min + ratio * span,
      };
    });

    const withYear = rangeDays > 90;
    const xTickIndexes = [0, 1, 2, 3].map((step) =>
      Math.round((step / 3) * (coords.length - 1)),
    );
    const xTicks = [...new Set(xTickIndexes)].map((index) => ({
      x: coords[index].x,
      label: shortDate(coords[index].t, withYear),
      anchor:
        index === 0
          ? ("start" as const)
          : index === coords.length - 1
            ? ("end" as const)
            : ("middle" as const),
    }));

    return {
      coords,
      linePath,
      areaPath,
      changePercent,
      min,
      max,
      first: sliced[0],
      last: sliced[sliced.length - 1],
      yTicks,
      xTicks,
      lastX: coords[coords.length - 1].x,
      lastY: coords[coords.length - 1].y,
    };
  }, [series, rangeDays, width]);

  const hoverPoint =
    view && hoverIndex !== null && hoverIndex < view.coords.length
      ? view.coords[hoverIndex]
      : null;

  function handlePointerMove(
    event: React.PointerEvent<SVGSVGElement>,
  ) {
    if (!view) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    let nearest = 0;
    let best = Infinity;
    view.coords.forEach((point, index) => {
      const distance = Math.abs(point.x - x);
      if (distance < best) {
        best = distance;
        nearest = index;
      }
    });
    setHoverIndex(nearest);
  }

  const chartColor = view && view.changePercent >= 0 ? "#22c55e" : "#ef4444";

  return (
    <div className="rounded-lg border border-line bg-card p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {selectable && universe.length > 0 && (
            <select
              aria-label="Select coin for chart"
              value={coinId}
              onChange={(event) => selectCoin(event.target.value)}
              className="rounded border border-line bg-surface px-2 py-1 text-xs font-bold outline-none focus:border-accent"
            >
              {universe.map((coin) => (
                <option key={coin.id} value={coin.id}>
                  {coin.name} ({coin.symbol.toUpperCase()})
                </option>
              ))}
            </select>
          )}
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
          {selectedCoin && (
            <span className="text-xs text-muted">
              {selectedCoin.symbol.toUpperCase()}
            </span>
          )}
        </div>
        {view && (
          <p
            className={`text-sm font-bold tabular-nums ${view.changePercent >= 0 ? "text-up" : "text-down"}`}
          >
            {view.changePercent >= 0 ? "+" : ""}
            {view.changePercent.toFixed(2)}%{" "}
            <span className="font-normal text-muted">{activeRange.phrase}</span>
          </p>
        )}
      </div>

      <div ref={wrapperRef} className="relative">
        {!series && (
          <div className="flex h-[280px] items-center justify-center text-sm text-muted">
            {fetchFailed
              ? "Chart unavailable — pick another coin."
              : "Loading chart…"}
          </div>
        )}

        {series && !view && (
          <div className="flex h-[280px] items-center justify-center text-sm text-muted">
            Not enough data for this range.
          </div>
        )}

        {view && (
          <div className={fetching ? "opacity-50 transition" : "transition"}>
            <svg
              width={width}
              height={HEIGHT}
              role="img"
              aria-label={`Price chart, low ${formatUsd(view.min)}, high ${formatUsd(view.max)}`}
              onPointerMove={handlePointerMove}
              onPointerLeave={() => setHoverIndex(null)}
              className="block touch-pan-y"
            >
              <defs>
                <linearGradient id="pit-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity="0.28" />
                  <stop offset="100%" stopColor={chartColor} stopOpacity="0" />
                </linearGradient>
              </defs>

              {view.yTicks.map((tick) => (
                <g key={tick.y}>
                  <line
                    x1={PAD.left}
                    x2={width - PAD.right}
                    y1={tick.y}
                    y2={tick.y}
                    className="stroke-line"
                    strokeWidth="1"
                  />
                  <text
                    x={PAD.left - 8}
                    y={tick.y}
                    textAnchor="end"
                    dominantBaseline="middle"
                    className="fill-muted"
                    fontSize="11"
                  >
                    {axisPrice(tick.value)}
                  </text>
                </g>
              ))}

              <path d={view.areaPath} fill="url(#pit-area)" />
              <path
                d={view.linePath}
                fill="none"
                stroke={chartColor}
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <circle cx={view.lastX} cy={view.lastY} r="3.5" fill={chartColor} />

              {view.xTicks.map((tick) => (
                <text
                  key={`${tick.x}-${tick.label}`}
                  x={tick.x}
                  y={HEIGHT - 8}
                  textAnchor={tick.anchor}
                  className="fill-muted"
                  fontSize="11"
                >
                  {tick.label}
                </text>
              ))}

              {hoverPoint && (
                <g>
                  <line
                    x1={hoverPoint.x}
                    x2={hoverPoint.x}
                    y1={PAD.top}
                    y2={HEIGHT - PAD.bottom}
                    className="stroke-muted"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <circle
                    cx={hoverPoint.x}
                    cy={hoverPoint.y}
                    r="4"
                    fill={chartColor}
                    className="stroke-card"
                    strokeWidth="2"
                  />
                </g>
              )}
            </svg>

            {hoverPoint && (
              <div
                className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded border border-line bg-surface px-2 py-1 text-xs shadow"
                style={{
                  left: Math.min(Math.max(hoverPoint.x, 70), width - 70),
                  top: Math.max(hoverPoint.y - 10, 4),
                }}
              >
                <span className="font-bold tabular-nums">
                  {formatUsd(hoverPoint.price)}
                </span>
                <span className="ml-1.5 text-muted">{fullDate(hoverPoint.t)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {view && (
        <div className="mt-2 flex items-center justify-between text-xs text-muted">
          <span>
            {shortDate(view.first.t, true)} · {formatUsd(view.first.price)}
          </span>
          <span className="hidden sm:inline">
            Low {formatUsd(view.min)} · High {formatUsd(view.max)}
          </span>
          <span>
            {shortDate(view.last.t, true)} · {formatUsd(view.last.price)}
          </span>
        </div>
      )}
    </div>
  );
}
