"use client";

import { useMarket } from "./MarketProvider";
import { formatUsd } from "@/lib/format";

function formatPrice(value: number | undefined): string {
  if (value === undefined) return "—";
  return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export function HeroPrice() {
  const { btc } = useMarket();

  const last = btc?.last;
  const high = btc?.high;
  const low = btc?.low;

  const range =
    high !== undefined && low !== undefined && high > low
      ? Math.min(100, Math.max(0, ((last ?? low) - low) / (high - low) * 100))
      : null;

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.12),transparent_60%)]"
      />
      <div className="relative mx-auto max-w-5xl px-4 py-10 md:py-14">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-up" />
          Live · updated every 60 seconds
        </p>

        <p className="mt-4 text-lg font-semibold md:text-xl">
          The Current Price of Bitcoin is…
        </p>

        <div className="mt-2 flex flex-wrap items-end gap-x-8 gap-y-4">
          <h1 className="text-5xl font-bold tabular-nums md:text-7xl">
            ${formatPrice(last)}
          </h1>

          <div className="flex gap-8 pb-1">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-up">
                24h High
              </p>
              <p className="text-lg font-semibold tabular-nums text-up">
                ${formatPrice(high)}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-down">
                24h Low
              </p>
              <p className="text-lg font-semibold tabular-nums text-down">
                ${formatPrice(low)}
              </p>
            </div>
          </div>
        </div>

        {range !== null && high !== undefined && low !== undefined && (
          <div className="mt-8 max-w-xl">
            <div className="relative h-1.5 rounded-full bg-line">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-down via-yellow-400 to-up"
                style={{ width: `${range}%` }}
              />
              <span
                className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-ink"
                style={{ left: `${range}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[11px] text-muted">
              <span>Day low</span>
              <span className="tabular-nums">
                {formatUsd(low)} — {formatUsd(high)}
              </span>
              <span>Day high</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
