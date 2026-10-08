"use client";

import { useMarket } from "./MarketProvider";
import { CountUp } from "./CountUp";
import { StatCell, fearGreedColor } from "./StatCell";
import { formatCompactUsd, formatPercent, formatUsd } from "@/lib/format";
import type { MarketStats } from "@/types";

function formatPrice(value: number | undefined): string {
  if (value === undefined) return "—";
  return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function FearGreedCard({
  stats,
}: {
  stats: MarketStats;
}) {
  const fg = stats.fearGreed;

  return (
    <div className="bg-card p-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
        Fear &amp; Greed Index
      </p>
      {fg ? (
        <>
          <p className="mt-1 flex items-baseline gap-2">
            <span
              className={`text-xl font-bold tabular-nums md:text-2xl ${fearGreedColor(fg.value)}`}
            >
              <CountUp
                value={fg.value}
                format={(value) => Math.round(value).toString()}
              />
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
          {stats.fearGreedHistory.length > 1 && (
            <div className="mt-2">
              <div
                className="flex h-6 items-end gap-px"
                role="img"
                aria-label={`Fear and greed over the last ${stats.fearGreedHistory.length} days`}
              >
                {stats.fearGreedHistory.map((value, index) => (
                  <span
                    key={index}
                    title={`Day ${index + 1}: ${value}`}
                    className={`w-full min-w-[2px] rounded-t-sm ${fearGreedColor(value)}`}
                    style={{ height: `${Math.max(8, value)}%` }}
                  />
                ))}
              </div>
              <p className="mt-1 text-[10px] text-muted">
                Last {stats.fearGreedHistory.length} days
              </p>
            </div>
          )}
        </>
      ) : (
        <p className="mt-1 text-xl font-bold">—</p>
      )}
    </div>
  );
}

export function HeroPrice({ stats }: { stats: MarketStats }) {
  const { btc } = useMarket();

  const last = btc?.last;
  const high = btc?.high;
  const low = btc?.low;

  const range =
    high !== undefined && low !== undefined && high > low
      ? Math.min(
          100,
          Math.max(0, (((last ?? low) - low) / (high - low)) * 100),
        )
      : null;

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="relative mx-auto max-w-5xl px-4 py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-10">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-up" />
              Live · updated every 60 seconds
            </p>

            <p className="mt-4 text-lg font-semibold md:text-xl">
              The Current Price of Bitcoin is…
            </p>

            <div className="mt-2 flex flex-wrap items-end gap-x-8 gap-y-4">
              <h1 className="text-5xl font-bold tabular-nums md:text-7xl">
                <CountUp
                  value={last ?? null}
                  format={(value) => `$${formatPrice(value)}`}
                />
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

          <div className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-lg border border-line bg-line">
            <StatCell
              label="Total Crypto Market Cap"
              value={
                <CountUp
                  value={stats.totalMarketCap}
                  format={formatCompactUsd}
                />
              }
              sub={
                stats.marketCapChange24h !== null ? (
                  <p
                    className={`text-xs font-semibold tabular-nums ${stats.marketCapChange24h >= 0 ? "text-up" : "text-down"}`}
                  >
                    {formatPercent(stats.marketCapChange24h)} in 24h · all
                    coins
                  </p>
                ) : (
                  <p className="text-xs text-muted">All coins &amp; tokens</p>
                )
              }
            />

            <StatCell
              label="24h Trading Volume"
              value={
                <CountUp value={stats.totalVolume} format={formatCompactUsd} />
              }
              sub={<p className="text-xs text-muted">Across all exchanges</p>}
            />

            <FearGreedCard stats={stats} />

            <StatCell
              label="Total Cap 24h Change"
              value={
                <span
                  className={
                    (stats.marketCapChange24h ?? 0) >= 0
                      ? "text-up"
                      : "text-down"
                  }
                >
                  <CountUp
                    value={stats.marketCapChange24h}
                    format={(value) => formatPercent(value)}
                  />
                </span>
              }
              sub={<p className="text-xs text-muted">All coins combined</p>}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
