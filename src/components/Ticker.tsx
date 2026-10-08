"use client";

import { useMarket } from "./MarketProvider";
import { changeClass, formatPercent, formatUsd } from "@/lib/format";

function TickerItem({
  symbol,
  price,
  change,
}: {
  symbol: string;
  price: number;
  change: number | null;
}) {
  return (
    <span className="inline-flex items-baseline gap-2 px-5 py-2 text-sm">
      <span className="font-bold">{symbol.toUpperCase()}</span>
      <span className="tabular-nums">{formatUsd(price)}</span>
      <span className={`tabular-nums text-xs ${changeClass(change)}`}>
        {formatPercent(change)}
      </span>
    </span>
  );
}

export function Ticker() {
  const { markets } = useMarket();

  if (!markets || markets.coins.length === 0) {
    return (
      <div className="pit-marquee overflow-hidden border-b-2 border-ink">
        <div className="flex whitespace-nowrap">
          <span className="px-5 py-2 text-sm text-muted">
            Loading live prices…
          </span>
        </div>
      </div>
    );
  }

  const items = markets.coins;

  return (
    <div
      className="pit-marquee overflow-hidden border-b-2 border-ink"
      aria-hidden="true"
    >
      <div className="pit-marquee-track flex w-max whitespace-nowrap">
        {items.map((coin) => (
          <TickerItem
            key={`a-${coin.id}`}
            symbol={coin.symbol}
            price={coin.currentPrice}
            change={coin.priceChange24hPercent}
          />
        ))}
        {items.map((coin) => (
          <TickerItem
            key={`b-${coin.id}`}
            symbol={coin.symbol}
            price={coin.currentPrice}
            change={coin.priceChange24hPercent}
          />
        ))}
      </div>
    </div>
  );
}
