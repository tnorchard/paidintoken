import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCoin, getCoinChart } from "@/lib/coins";
import { changeClass, formatCompactUsd, formatPercent, formatUsd } from "@/lib/format";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PriceChart } from "@/components/PriceChart";
import { StarButton } from "@/components/StarButton";
import { type FaqItem, FaqBlock } from "@/components/FaqBlock";

export const revalidate = 3600;

interface CoinPageProps {
  params: Promise<{ id: string }>;
}

function titleCase(id: string): string {
  return id
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: CoinPageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getCoin(id);
  if (result.status === "not-found") return { title: "Coin not found" };
  if (result.status === "unavailable") {
    return { title: `${titleCase(id)} Price — PaidinToken` };
  }

  const coin = result.coin;
  return {
    title: `${coin.name} (${coin.symbol.toUpperCase()}) Price Today`,
    description: `Live ${coin.name} price: ${formatUsd(coin.currentPrice)}. Market cap ${formatCompactUsd(coin.marketCap)}, 24h volume, all-time high, supply and a one-year price chart. Data updates every 60 seconds.`,
    alternates: { canonical: `/coins/${coin.id}` },
    openGraph: {
      title: `${coin.name} Price Today`,
      description: `${coin.name} live price and market stats on PaidinToken.`,
      url: `/coins/${coin.id}`,
    },
  };
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="border-line p-4 [&:not(:last-child)]:border-b sm:[&:not(:last-child)]:border-b-0 sm:[&:not(:last-child)]:border-r">
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className={`mt-1 text-lg font-bold tabular-nums ${accent ?? ""}`}>
        {value}
      </p>
    </div>
  );
}

export default async function CoinPage({ params }: CoinPageProps) {
  const { id } = await params;
  const result = await getCoin(id);
  if (result.status === "not-found") notFound();
  if (result.status === "unavailable") {
    // Never cache a 404 for a valid coin — fail the render so it retries.
    throw new Error(`Coin data unavailable: ${id}`);
  }
  const coin = result.coin;

  const chart = await getCoinChart(coin.id);

  const supply = coin.circulatingSupply ?? 0;
  const supplyLabel = supply.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
  const maxLabel = coin.maxSupply
    ? coin.maxSupply.toLocaleString("en-US", { maximumFractionDigits: 0 })
    : "Uncapped";

  const symbol = coin.symbol.toUpperCase();
  const descriptionSnippet =
    coin.description.length > 300
      ? `${coin.description.slice(0, 300).trimEnd()}…`
      : coin.description;

  const faqItems: FaqItem[] = [
    {
      q: `What is ${coin.name}?`,
      a:
        descriptionSnippet ||
        `${coin.name} (${symbol}) is a cryptocurrency ranked #${coin.marketCapRank ?? "—"} by market capitalization.`,
    },
    {
      q: `How is the ${coin.name} price calculated?`,
      a: `PaidinToken shows the ${symbol} price CoinGecko computes as a volume-weighted average across hundreds of exchanges. It refreshes on this page every 60 seconds.`,
    },
    {
      q: `What is ${symbol}'s circulating supply?`,
      a: coin.circulatingSupply !== null
        ? `${supplyLabel} ${symbol} are in circulation${coin.maxSupply !== null ? `, out of a maximum supply of ${maxLabel}` : ", with no hard cap on total supply"}. Circulating supply multiplied by price equals the market cap shown above.`
        : `Circulating supply data for ${symbol} is currently unavailable from the data provider. Market cap is shown instead.`,
    },
    {
      q: `Where can I buy ${coin.name}?`,
      a: `${coin.name} is listed on most major exchanges and decentralized swaps; availability depends on your region. Compare fees and liquidity before trading.`,
    },
    {
      q: `Should I invest in ${coin.name}?`,
      a: `PaidinToken does not provide financial advice. This page presents market data only — always do your own research and consider your own circumstances before buying any cryptocurrency.`,
    },
  ];

  return (
    <>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Breadcrumbs
          items={[
            { label: "Coins", href: "/#markets" },
            { label: coin.name },
          ]}
        />

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {coin.image && (
              <Image
                src={coin.image}
                alt={`${coin.name} logo`}
                width={44}
                height={44}
                className="h-11 w-11 shrink-0"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">
                {coin.name}{" "}
                <span className="text-base font-semibold text-muted">
                  {coin.symbol.toUpperCase()}
                </span>
              </h1>
              <p className="text-xs text-muted">
                {coin.marketCapRank ? `Rank #${coin.marketCapRank} · ` : ""}
                Data updates every 60s
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StarButton coinId={coin.id} />
            <p className="text-3xl font-bold tabular-nums md:text-4xl">
              {formatUsd(coin.currentPrice)}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold">
          <span className={changeClass(coin.change24h)}>
            24h {formatPercent(coin.change24h)}
          </span>
          <span className={changeClass(coin.change7d)}>
            7d {formatPercent(coin.change7d)}
          </span>
          <span className={changeClass(coin.change30d)}>
            30d {formatPercent(coin.change30d)}
          </span>
        </div>

        <div className="mt-6">
          <PriceChart data={chart} />
        </div>

        <section className="mt-6 grid grid-cols-1 rounded-lg border border-line bg-card sm:grid-cols-2 lg:grid-cols-3">
          <Stat
            label="Market Cap"
            value={formatCompactUsd(coin.marketCap)}
          />
          <Stat
            label="24h Trading Volume"
            value={formatCompactUsd(coin.totalVolume)}
          />
          <Stat
            label="24h High / Low"
            value={`${coin.high24h !== null ? formatUsd(coin.high24h) : "—"} / ${coin.low24h !== null ? formatUsd(coin.low24h) : "—"}`}
          />
          <Stat label="All-Time High" value={coin.ath !== null ? formatUsd(coin.ath) : "—"} />
          <Stat label="All-Time Low" value={coin.atl !== null ? formatUsd(coin.atl) : "—"} />
          <Stat
            label="Circulating Supply"
            value={`${supplyLabel} ${coin.symbol.toUpperCase()}`}
          />
          <Stat label="Total Supply" value={coin.totalSupply !== null ? coin.totalSupply.toLocaleString("en-US", { maximumFractionDigits: 0 }) : "—"} />
          <Stat label="Max Supply" value={maxLabel} />
          <Stat
            label="Genesis Date"
            value={coin.genesisDate ?? "—"}
          />
        </section>

        {coin.description && (
          <section className="mt-8">
            <h2 className="text-lg font-bold uppercase tracking-wider">
              About {coin.name}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
              {coin.description}
            </p>
          </section>
        )}

        <FaqBlock items={faqItems} title={`FAQ · ${coin.name}`} />

        <section className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-card p-4 text-sm">
          <p className="text-muted">
            Track every coin from the{" "}
            <Link href="/#markets" className="font-semibold text-ink hover:text-accent">
              market prices board
            </Link>
            .
          </p>
          <a
            href="https://www.coingecko.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted hover:text-accent"
          >
            Market data via CoinGecko
          </a>
        </section>
      </main>
    </>
  );
}
