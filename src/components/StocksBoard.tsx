"use client";

import { CountUp } from "./CountUp";
import { formatPercent } from "@/lib/format";
import type { StockQuote } from "@/lib/stocks";

function formatPrice(value: number): string {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: value < 10 ? 4 : 2,
    minimumFractionDigits: value < 10 ? 4 : 0,
  });
}

function QuoteCell({ quote }: { quote: StockQuote }) {
  return (
    <div className="bg-surface p-3">
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
        {quote.label}
      </p>
      <p className="mt-0.5 text-base font-bold tabular-nums md:text-lg">
        <CountUp
          value={quote.price}
          format={(value) => formatPrice(value)}
        />
      </p>
      {quote.changePercent !== null ? (
        <p
          className={`text-xs font-semibold tabular-nums ${quote.changePercent >= 0 ? "text-up" : "text-down"}`}
        >
          <CountUp
            value={quote.changePercent}
            format={(value) => formatPercent(value)}
          />
        </p>
      ) : (
        <p className="text-xs text-muted">—</p>
      )}
    </div>
  );
}

export function StocksBoard({ quotes }: { quotes: StockQuote[] }) {
  return (
    <div className="grid grid-cols-2 gap-0.5 overflow-hidden rounded-lg border-2 border-ink bg-ink sm:grid-cols-3 lg:grid-cols-6">
      {quotes.map((quote) => (
        <QuoteCell key={quote.symbol} quote={quote} />
      ))}
    </div>
  );
}
