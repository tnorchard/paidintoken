"use client";

import { useState, type ReactNode } from "react";
import type { MarketStats } from "@/types";
import { CountUp } from "./CountUp";
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
  value: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <div className="bg-card p-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold tabular-nums md:text-2xl">{value}</p>
      {sub}
    </div>
  );
}

export function StatsStrip({ stats }: { stats: MarketStats }) {
  const [expanded, setExpanded] = useState(false);
  const fg = stats.fearGreed;

  return (
    <div>
      <section className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        <StatCell
          label="Total Crypto Market Cap"
          value={
            <CountUp value={stats.totalMarketCap} format={formatCompactUsd} />
          }
          sub={
            stats.marketCapChange24h !== null ? (
              <p
                className={`text-xs font-semibold tabular-nums ${stats.marketCapChange24h >= 0 ? "text-up" : "text-down"}`}
              >
                {formatPercent(stats.marketCapChange24h)} in 24h · all coins
              </p>
            ) : (
              <p className="text-xs text-muted">All coins &amp; tokens</p>
            )
          }
        />

        <StatCell
          label="24h Trading Volume"
          value={<CountUp value={stats.totalVolume} format={formatCompactUsd} />}
          sub={<p className="text-xs text-muted">Across all exchanges</p>}
        />

        <StatCell
          label="BTC Dominance"
          value={
            <CountUp
              value={stats.btcDominance}
              format={(value) => `${value.toFixed(1)}%`}
            />
          }
          sub={<p className="text-xs text-muted">Share of total crypto cap</p>}
        />

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

        {expanded && (
          <>
            <StatCell
              label="ETH Dominance"
              value={
                <CountUp
                  value={stats.ethDominance}
                  format={(value) => `${value.toFixed(1)}%`}
                />
              }
              sub={
                <p className="text-xs text-muted">Ethereum&apos;s share of the cap</p>
              }
            />
            <StatCell
              label="Active Cryptocurrencies"
              value={
                <CountUp
                  value={stats.activeCoins}
                  format={(value) =>
                    Math.round(value).toLocaleString("en-US")
                  }
                />
              }
              sub={<p className="text-xs text-muted">Coins tracked worldwide</p>}
            />
            <StatCell
              label="Markets & Exchanges"
              value={
                <CountUp
                  value={stats.exchangeMarkets}
                  format={(value) =>
                    Math.round(value).toLocaleString("en-US")
                  }
                />
              }
              sub={<p className="text-xs text-muted">Venues pricing crypto</p>}
            />
            <StatCell
              label="Total Cap 24h Change"
              value={
                <span
                  className={
                    (stats.marketCapChange24h ?? 0) >= 0 ? "text-up" : "text-down"
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
          </>
        )}
      </section>

      <div className="mt-2 flex justify-center">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="rounded border border-line bg-card px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-muted transition hover:border-accent hover:text-ink"
        >
          {expanded ? "Show less stats ▴" : "Show more stats ▾"}
        </button>
      </div>
    </div>
  );
}
