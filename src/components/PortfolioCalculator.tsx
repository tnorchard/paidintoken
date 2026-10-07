"use client";

import { useEffect, useState } from "react";
import { useMarket } from "./MarketProvider";
import { changeClass, formatPercent, formatUsd } from "@/lib/format";

const STORAGE_KEY = "pit-portfolio";

interface Holding {
  id: string;
  qty: string;
  cost: string;
}

function readStorage(): Holding[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function PortfolioCalculator() {
  const { markets } = useMarket();
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setHoldings(readStorage());
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings));
    } catch {
      // Storage unavailable — portfolio lasts for this session only.
    }
  }, [holdings, loaded]);

  const universe = markets?.universe ?? [];

  const rows = holdings.map((holding, index) => {
    const coin = universe.find((entry) => entry.id === holding.id);
    const qty = Number.parseFloat(holding.qty) || 0;
    const cost = Number.parseFloat(holding.cost) || 0;
    const price = coin?.currentPrice ?? 0;
    const value = qty * price;
    const pl = cost > 0 ? value - cost : null;
    const plPercent = cost > 0 ? (pl! / cost) * 100 : null;
    return { holding, index, coin, qty, price, value, pl, plPercent };
  });

  const totalValue = rows.reduce((sum, row) => sum + row.value, 0);
  const totalCost = rows.reduce((sum, row) => {
    const cost = Number.parseFloat(row.holding.cost) || 0;
    return sum + cost;
  }, 0);
  const totalPl = totalCost > 0 ? totalValue - totalCost : null;
  const totalPlPercent = totalCost > 0 ? (totalPl! / totalCost) * 100 : null;

  const update = (index: number, patch: Partial<Holding>) => {
    setHoldings((prev) =>
      prev.map((holding, i) => (i === index ? { ...holding, ...patch } : holding)),
    );
  };

  return (
    <div className="rounded-lg border border-line bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wider text-muted">
          Holdings
        </p>
        <button
          type="button"
          onClick={() =>
            setHoldings((prev) => [...prev, { id: "", qty: "", cost: "" }])
          }
          className="rounded border border-line px-2.5 py-1 text-xs font-semibold transition hover:border-accent hover:text-accent"
        >
          + Add holding
        </button>
      </div>

      {rows.length === 0 && (
        <p className="mt-4 text-sm text-muted">
          {universe.length === 0
            ? "Loading live prices…"
            : "No holdings yet — add your first coin."}
        </p>
      )}

      {rows.length > 0 && (
        <ul className="mt-3 space-y-2">
          {rows.map((row) => (
            <li
              key={row.index}
              className="flex flex-wrap items-center gap-2 rounded border border-line p-2"
            >
              <select
                value={row.holding.id}
                onChange={(event) => update(row.index, { id: event.target.value })}
                aria-label="Coin"
                className="rounded border border-line bg-surface px-2 py-1.5 text-sm font-semibold outline-none"
              >
                <option value="">Select coin</option>
                {universe.map((coin) => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                placeholder="Quantity"
                value={row.holding.qty}
                onChange={(event) => update(row.index, { qty: event.target.value })}
                aria-label="Quantity"
                className="w-28 rounded border border-line bg-surface px-2 py-1.5 text-sm tabular-nums outline-none"
              />

              <input
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                placeholder="Cost (USD)"
                value={row.holding.cost}
                onChange={(event) => update(row.index, { cost: event.target.value })}
                aria-label="Total cost in USD"
                className="w-32 rounded border border-line bg-surface px-2 py-1.5 text-sm tabular-nums outline-none"
              />

              <span className="ml-auto flex items-baseline gap-3 text-sm tabular-nums">
                <span className="font-semibold">
                  {row.coin ? formatUsd(row.value) : "—"}
                </span>
                {row.pl !== null && (
                  <span className={`font-semibold ${changeClass(row.pl)}`}>
                    {row.pl >= 0 ? "+" : ""}
                    {formatUsd(row.pl)} ({formatPercent(row.plPercent)})
                  </span>
                )}
              </span>

              <button
                type="button"
                onClick={() =>
                  setHoldings((prev) => prev.filter((_, i) => i !== row.index))
                }
                aria-label="Remove holding"
                className="text-muted transition hover:text-down"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 border-t border-line pt-3">
        <p className="text-xs font-bold uppercase tracking-wider text-muted">
          Portfolio total
        </p>
        <p className="text-2xl font-bold tabular-nums">
          {formatUsd(totalValue)}
          {totalPl !== null && (
            <span
              className={`ml-3 text-sm font-semibold ${changeClass(totalPl)}`}
            >
              {totalPl >= 0 ? "+" : ""}
              {formatUsd(totalPl)} ({formatPercent(totalPlPercent)})
            </span>
          )}
        </p>
      </div>
      <p className="mt-2 text-xs text-muted">
        Saved in your browser only · prices refresh every 60 seconds
      </p>
    </div>
  );
}
