"use client";

import type { MarketStats } from "@/types";
import { CountUp } from "./CountUp";
import { StatCell } from "./StatCell";

function formatCount(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

export function StatsStrip({ stats }: { stats: MarketStats }) {
  return (
    <section className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
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

      <StatCell
        label="ETH Dominance"
        value={
          <CountUp
            value={stats.ethDominance}
            format={(value) => `${value.toFixed(1)}%`}
          />
        }
        sub={<p className="text-xs text-muted">Ethereum&apos;s share of the cap</p>}
      />

      <StatCell
        label="Active Cryptocurrencies"
        value={
          <CountUp
            value={stats.activeCoins}
            format={(value) => formatCount(value)}
          />
        }
        sub={<p className="text-xs text-muted">Coins tracked worldwide</p>}
      />

      <StatCell
        label="Markets & Exchanges"
        value={
          <CountUp
            value={stats.exchangeMarkets}
            format={(value) => formatCount(value)}
          />
        }
        sub={<p className="text-xs text-muted">Venues pricing crypto</p>}
      />
    </section>
  );
}
