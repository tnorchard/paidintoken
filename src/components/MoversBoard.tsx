"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMarket } from "./MarketProvider";
import type { Mover } from "@/types";
import { changeClass, formatPercent, formatUsd } from "@/lib/format";

function MoverRow({ mover }: { mover: Mover | undefined }) {
  if (!mover) {
    return (
      <li className="flex items-center justify-between py-2 text-sm text-muted">
        <span>—</span>
        <span>—</span>
      </li>
    );
  }

  return (
    <li className="border-b border-line last:border-b-0">
      <Link
        href={`/coins/${mover.id}`}
        className="flex items-center justify-between gap-3 py-2.5 hover:text-accent"
      >
        <span className="flex min-w-0 items-center gap-2">
          <Image
            src={mover.image}
            alt=""
            width={18}
            height={18}
            className="shrink-0"
          />
          <span className="truncate text-sm font-medium">{mover.name}</span>
          <span className="text-xs uppercase text-muted">{mover.symbol}</span>
        </span>
        <span className="flex shrink-0 items-baseline gap-3 text-sm tabular-nums">
          <span>{formatUsd(mover.currentPrice)}</span>
          <span
            className={`w-20 text-right font-semibold ${changeClass(mover.priceChange24hPercent)}`}
          >
            {formatPercent(mover.priceChange24hPercent)}
          </span>
        </span>
      </Link>
    </li>
  );
}

function MoversPanel({
  title,
  items,
  accentClass,
}: {
  title: string;
  items: Mover[] | undefined;
  accentClass: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-line bg-card p-4 transition hover:border-accent">
      <h3
        className={`mb-2 text-sm font-bold uppercase tracking-wider ${accentClass}`}
      >
        {title}
      </h3>
      <ul>
        {items
          ? items.map((mover) => <MoverRow key={mover.id} mover={mover} />)
          : [0, 1, 2, 3, 4].map((index) => (
              <MoverRow key={index} mover={undefined} />
            ))}
      </ul>
    </div>
  );
}

const COLLAPSED_SIZE = 5;
const EXPANDED_SIZE = 10;

export function MoversBoard() {
  const { markets } = useMarket();
  const [expanded, setExpanded] = useState(false);

  const ranked = useMemo(() => {
    const universe = markets?.universe ?? [];
    return universe
      .filter(
        (coin) =>
          coin.priceChange24hPercent !== null &&
          Number.isFinite(coin.priceChange24hPercent),
      )
      .sort(
        (a, b) =>
          (b.priceChange24hPercent ?? 0) - (a.priceChange24hPercent ?? 0),
      );
  }, [markets]);

  const size = expanded ? EXPANDED_SIZE : COLLAPSED_SIZE;

  const gainers = expanded
    ? ranked.slice(0, size)
    : (markets?.gainers ?? undefined);
  const losers = expanded
    ? ranked.slice(-size).reverse()
    : (markets?.losers ?? undefined);

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        <MoversPanel
          title={`Top Gainers · 24h${expanded ? ` · Top ${EXPANDED_SIZE}` : ""}`}
          items={gainers}
          accentClass="text-up"
        />
        <MoversPanel
          title={`Top Losers · 24h${expanded ? ` · Top ${EXPANDED_SIZE}` : ""}`}
          items={losers}
          accentClass="text-down"
        />
      </div>

      {markets && (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            className="rounded border border-line bg-card px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-muted transition hover:border-accent hover:text-ink"
          >
            {expanded ? "Show less movers ▴" : `Show top ${EXPANDED_SIZE} movers ▾`}
          </button>
        </div>
      )}
    </div>
  );
}
