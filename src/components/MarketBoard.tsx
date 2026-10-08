"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMarket } from "./MarketProvider";
import { StarButton } from "./StarButton";
import { changeClass, formatCompactUsd, formatPercent, formatUsd } from "@/lib/format";
import type { Coin } from "@/types";

type SortKey = "rank" | "name" | "price" | "change" | "cap" | "high";
type SortState = { key: SortKey; dir: "asc" | "desc" };

function PlaceholderRow({ rank }: { rank: number }) {
  return (
    <tr className="border-b border-line">
      <td className="py-2.5 pr-4 text-muted">{rank}</td>
      <td className="py-2.5 pr-4 text-muted">—</td>
      <td className="py-2.5 pr-4 text-right text-muted">—</td>
      <td className="py-2.5 pr-4 text-right text-muted">—</td>
      <td className="hidden py-2.5 pr-4 text-right text-muted md:table-cell">
        —
      </td>
      <td className="hidden py-2.5 text-right text-muted md:table-cell">—</td>
      <td className="py-2.5 text-right text-muted">☆</td>
    </tr>
  );
}

function SortableHeader({
  label,
  sortKey,
  current,
  onSort,
  className = "",
}: {
  label: React.ReactNode;
  sortKey: SortKey;
  current: SortState | null;
  onSort: (key: SortKey) => void;
  className?: string;
}) {
  const active = current?.key === sortKey;
  const ariaSort = active
    ? current.dir === "asc"
      ? "ascending"
      : "descending"
    : "none";

  return (
    <th scope="col" aria-sort={ariaSort} className={className}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`flex w-full items-center gap-1 uppercase tracking-wider transition hover:text-accent ${
          active ? "text-ink" : "text-muted hover:text-accent"
        }`}
      >
        <span>{label}</span>
        <span
          aria-hidden="true"
          className={`text-[9px] ${active ? "opacity-100" : "opacity-40"}`}
        >
          {active && current.dir === "asc" ? "▲" : "▼"}
        </span>
        <span className="sr-only">
          {active && current.dir === "asc"
            ? " (sorted ascending, activate to sort descending)"
            : " (activate to sort)"}
        </span>
      </button>
    </th>
  );
}

function sortValue(
  coin: Coin,
  key: SortKey,
  rankMap: Map<string, number>,
): number | string | null {
  switch (key) {
    case "rank":
      return rankMap.get(coin.id) ?? null;
    case "name":
      return coin.name.toLowerCase();
    case "price":
      return coin.currentPrice;
    case "change":
      return coin.priceChange24hPercent;
    case "cap":
      return coin.marketCap;
    case "high":
      return coin.high24h;
  }
}

export function MarketBoard() {
  const { markets } = useMarket();
  const [expanded, setExpanded] = useState(false);
  const [sort, setSort] = useState<SortState | null>(null);

  const rankMap = useMemo(
    () =>
      new Map<string, number>(
        (markets?.universe ?? []).map((coin, index) => [coin.id, index + 1]),
      ),
    [markets],
  );

  const sourceCoins = !markets
    ? null
    : expanded
      ? markets.universe
      : markets.coins;

  const coins = useMemo(() => {
    if (!sourceCoins || !sort) return sourceCoins;
    const factor = sort.dir === "asc" ? 1 : -1;
    return [...sourceCoins].sort((a, b) => {
      const va = sortValue(a, sort.key, rankMap);
      const vb = sortValue(b, sort.key, rankMap);
      if (va === null && vb === null) return 0;
      if (va === null) return 1;
      if (vb === null) return -1;
      if (typeof va === "string" || typeof vb === "string") {
        return String(va).localeCompare(String(vb)) * factor;
      }
      return (va - vb) * factor;
    });
  }, [sourceCoins, sort, rankMap]);

  const toggleSort = (key: SortKey) => {
    setSort((prev) => {
      if (prev?.key === key) {
        return { key, dir: prev.dir === "asc" ? "desc" : "asc" };
      }
      return { key, dir: key === "rank" || key === "name" ? "asc" : "desc" };
    });
  };

  const universeSize = markets?.universe.length ?? 0;

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <caption className="sr-only">
            Top cryptocurrencies by market cap with live USD prices — tap
            column headers to sort
          </caption>
          <thead>
            <tr className="border-b-2 border-ink text-left text-xs font-medium uppercase tracking-wider">
              <SortableHeader
                label="#"
                sortKey="rank"
                current={sort}
                onSort={toggleSort}
                className="py-2 pr-4"
              />
              <SortableHeader
                label="Coin"
                sortKey="name"
                current={sort}
                onSort={toggleSort}
                className="py-2 pr-4"
              />
              <SortableHeader
                label="Price"
                sortKey="price"
                current={sort}
                onSort={toggleSort}
                className="py-2 pr-4 text-right"
              />
              <SortableHeader
                label="24h"
                sortKey="change"
                current={sort}
                onSort={toggleSort}
                className="py-2 pr-4 text-right"
              />
              <SortableHeader
                label="Market Cap"
                sortKey="cap"
                current={sort}
                onSort={toggleSort}
                className="hidden py-2 pr-4 text-right md:table-cell"
              />
              <SortableHeader
                label="24h High / Low"
                sortKey="high"
                current={sort}
                onSort={toggleSort}
                className="hidden py-2 pr-4 text-right md:table-cell"
              />
              <th scope="col" className="py-2 text-right font-medium">
                <span className="sr-only">Watchlist</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {coins === null
              ? [1, 2, 3, 4].map((rank) => (
                  <PlaceholderRow key={rank} rank={rank} />
                ))
              : coins.map((coin, index) => (
                  <tr
                    key={coin.id}
                    className="border-b border-line transition hover:bg-card"
                  >
                    <td className="py-2.5 pr-4 text-muted tabular-nums">
                      {rankMap.get(coin.id) ?? index + 1}
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className="flex items-center gap-2">
                        <Image
                          src={coin.image}
                          alt=""
                          width={20}
                          height={20}
                          className="shrink-0"
                        />
                        <Link
                          href={`/coins/${coin.id}`}
                          className="font-medium hover:text-accent"
                        >
                          {coin.name}
                        </Link>
                        <span className="text-xs uppercase text-muted">
                          {coin.symbol}
                        </span>
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-right tabular-nums">
                      {formatUsd(coin.currentPrice)}
                    </td>
                    <td
                      className={`py-2.5 pr-4 text-right font-medium tabular-nums ${changeClass(coin.priceChange24hPercent)}`}
                    >
                      {formatPercent(coin.priceChange24hPercent)}
                    </td>
                    <td className="hidden py-2.5 pr-4 text-right tabular-nums md:table-cell">
                      {formatCompactUsd(coin.marketCap)}
                    </td>
                    <td className="hidden py-2.5 pr-4 text-right text-muted tabular-nums md:table-cell">
                      {coin.high24h !== null ? formatUsd(coin.high24h) : "—"}
                      {" / "}
                      {coin.low24h !== null ? formatUsd(coin.low24h) : "—"}
                    </td>
                    <td className="py-2.5 text-right">
                      <StarButton coinId={coin.id} />
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {markets && universeSize > markets.coins.length && (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            className="rounded border border-line bg-card px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-muted transition hover:border-accent hover:text-ink"
          >
            {expanded ? "Show top 12 ▴" : `Show all ${universeSize} coins ▾`}
          </button>
        </div>
      )}
    </div>
  );
}
