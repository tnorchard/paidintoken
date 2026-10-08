"use client";

import { CountUp } from "./CountUp";
import { formatCompactUsd, formatPercent } from "@/lib/format";
import type { MarketStats } from "@/types";

export function MarketCapNote({ stats }: { stats: MarketStats }) {
  const change = stats.marketCapChange24h;

  return (
    <div className="text-right">
      <p className="text-xs text-muted">LIVE · updates every 60s</p>
      <p className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
        Total Crypto Market Cap
      </p>
      <p className="mt-0.5 flex flex-wrap items-baseline justify-end gap-x-2">
        <span className="text-base font-bold text-ink tabular-nums md:text-lg">
          <CountUp value={stats.totalMarketCap} format={formatCompactUsd} />
        </span>
        {change !== null && (
          <span
            className={`text-xs font-semibold tabular-nums ${change >= 0 ? "text-up" : "text-down"}`}
          >
            {formatPercent(change)} in 24h · all coins
          </span>
        )}
      </p>
    </div>
  );
}
