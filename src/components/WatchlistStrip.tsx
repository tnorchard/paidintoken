"use client";

import Link from "next/link";
import { useMarket } from "./MarketProvider";
import { useWatchlist } from "./WatchlistProvider";
import { changeClass, formatPercent, formatUsd } from "@/lib/format";

export function WatchlistStrip() {
  const { ids } = useWatchlist();
  const { markets } = useMarket();

  if (ids.length === 0 || !markets) return null;

  const coins = ids
    .map((id) => markets.universe.find((coin) => coin.id === id))
    .filter((coin) => coin !== undefined);

  if (coins.length === 0) return null;

  return (
    <div className="mb-4 overflow-x-auto rounded-lg border border-accent/50 bg-card p-3">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted">
        ★ Your Watchlist
      </p>
      <ul className="flex flex-wrap gap-2">
        {coins.map((coin) => (
          <li key={coin.id}>
            <Link
              href={`/coins/${coin.id}`}
              className="flex items-center gap-2 rounded border border-line px-2.5 py-1.5 text-sm transition hover:border-accent"
            >
              <span className="font-semibold">{coin.symbol.toUpperCase()}</span>
              <span className="tabular-nums">{formatUsd(coin.currentPrice)}</span>
              <span
                className={`text-xs font-semibold tabular-nums ${changeClass(coin.priceChange24hPercent)}`}
              >
                {formatPercent(coin.priceChange24hPercent)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
