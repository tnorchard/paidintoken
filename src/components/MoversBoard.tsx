"use client";

import Image from "next/image";
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
    <li className="flex items-center justify-between gap-3 border-b border-line py-2.5 last:border-b-0">
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
        {[0, 1, 2, 3, 4].map((index) => (
          <MoverRow key={items?.[index]?.id ?? index} mover={items?.[index]} />
        ))}
      </ul>
    </div>
  );
}

export function MoversBoard() {
  const { markets } = useMarket();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <MoversPanel
        title="Top Gainers · 24h"
        items={markets?.gainers}
        accentClass="text-up"
      />
      <MoversPanel
        title="Top Losers · 24h"
        items={markets?.losers}
        accentClass="text-down"
      />
    </div>
  );
}
