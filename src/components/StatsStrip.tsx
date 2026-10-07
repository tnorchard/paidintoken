import type { ReactNode } from "react";
import type { MarketStats } from "@/types";
import { formatCompactUsd, formatPercent } from "@/lib/format";

function fearGreedColor(value: number): string {
  if (value <= 24) return "text-down";
  if (value <= 44) return "text-orange-500";
  if (value <= 55) return "text-yellow-500";
  if (value <= 74) return "text-green-500";
  return "text-up";
}

function StatCell({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: ReactNode;
}) {
  return (
    <div className="border-line p-4 [&:not(:last-child)]:border-b sm:[&:not(:last-child)]:border-b-0 sm:[&:not(:last-child)]:border-r">
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold tabular-nums md:text-2xl">{value}</p>
      {sub}
    </div>
  );
}

export function StatsStrip({ stats }: { stats: MarketStats }) {
  const fg = stats.fearGreed;

  return (
    <section className="grid grid-cols-1 rounded-lg border border-line bg-card sm:grid-cols-2 lg:grid-cols-4">
      <StatCell
        label="Total Market Cap"
        value={
          stats.totalMarketCap !== null
            ? formatCompactUsd(stats.totalMarketCap)
            : "—"
        }
        sub={
          stats.marketCapChange24h !== null ? (
            <p
              className={`text-xs font-semibold tabular-nums ${stats.marketCapChange24h >= 0 ? "text-up" : "text-down"}`}
            >
              {formatPercent(stats.marketCapChange24h)} in 24h
            </p>
          ) : undefined
        }
      />

      <StatCell
        label="24h Volume"
        value={
          stats.totalVolume !== null ? formatCompactUsd(stats.totalVolume) : "—"
        }
      />

      <StatCell
        label="BTC Dominance"
        value={
          stats.btcDominance !== null
            ? `${stats.btcDominance.toFixed(1)}%`
            : "—"
        }
      />

      <div className="p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
          Fear &amp; Greed Index
        </p>
        {fg ? (
          <>
            <p className="mt-1 flex items-baseline gap-2">
              <span
                className={`text-xl font-bold tabular-nums md:text-2xl ${fearGreedColor(fg.value)}`}
              >
                {fg.value}
              </span>
              <span className="text-sm font-semibold">{fg.label}</span>
            </p>
            <div className="relative mt-2 h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500">
              <span
                className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card bg-white"
                style={{ left: `${fg.value}%` }}
                aria-hidden="true"
              />
            </div>
          </>
        ) : (
          <p className="mt-1 text-xl font-bold">—</p>
        )}
      </div>
    </section>
  );
}
