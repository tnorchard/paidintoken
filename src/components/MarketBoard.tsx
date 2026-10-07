"use client";

import Image from "next/image";
import Link from "next/link";
import { useMarket } from "./MarketProvider";
import { StarButton } from "./StarButton";
import { changeClass, formatCompactUsd, formatPercent, formatUsd } from "@/lib/format";

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
      <td className="hidden py-2.5 pr-4 text-right text-muted md:table-cell">—</td>
      <td className="py-2.5 text-right text-muted">☆</td>
    </tr>
  );
}

export function MarketBoard() {
  const { markets } = useMarket();
  const coins = markets?.coins ?? null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <caption className="sr-only">
          Top cryptocurrencies by market cap with live USD prices
        </caption>
        <thead>
          <tr className="border-b-2 border-ink text-left text-xs uppercase tracking-wider">
            <th scope="col" className="py-2 pr-4 font-medium">
              #
            </th>
            <th scope="col" className="py-2 pr-4 font-medium">
              Coin
            </th>
            <th scope="col" className="py-2 pr-4 text-right font-medium">
              Price
            </th>
            <th scope="col" className="py-2 pr-4 text-right font-medium">
              24h
            </th>
            <th
              scope="col"
              className="hidden py-2 pr-4 text-right font-medium md:table-cell"
            >
              Market Cap
            </th>
            <th
              scope="col"
              className="hidden py-2 pr-4 text-right font-medium md:table-cell"
            >
              24h High / Low
            </th>
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
                  <td className="py-2.5 pr-4 text-muted">{index + 1}</td>
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
  );
}
