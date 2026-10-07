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
  const descriptionExtra =
    coin.description.length > 650
      ? `${coin.description.slice(300, 650).trimEnd()}…`
      : null;

  const dailyPrices = chart.map((point) => point.price);
  const priceYesterday =
    dailyPrices.length >= 2 ? dailyPrices[dailyPrices.length - 2] : null;
  const price30dAgo =
    dailyPrices.length >= 31 ? dailyPrices[dailyPrices.length - 31] : null;
  const changeVs30d =
    price30dAgo && price30dAgo > 0
      ? ((coin.currentPrice - price30dAgo) / price30dAgo) * 100
      : null;
  const athGap =
    coin.ath && coin.ath > 0
      ? ((coin.ath - coin.currentPrice) / coin.ath) * 100
      : null;
  const atlGap =
    coin.atl && coin.atl > 0
      ? ((coin.currentPrice - coin.atl) / coin.atl) * 100
      : null;
  const longDate = (value: string | null) =>
    value
      ? new Date(value).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : null;

  const faqItems: FaqItem[] = [
    {
      q: `What is the price of ${coin.name} today?`,
      a: `${coin.name} (${symbol}) trades at ${formatUsd(coin.currentPrice)} in US dollars right now. The price refreshes every 60 seconds${
        coin.high24h !== null && coin.low24h !== null
          ? `, with a 24-hour range between ${formatUsd(coin.low24h)} and ${formatUsd(coin.high24h)}`
          : ""
      }.`,
    },
    {
      q: `Is ${coin.name} up or down today?`,
      a: `${symbol} is ${coin.change24h !== null && coin.change24h >= 0 ? "up" : "down"} ${
        coin.change24h !== null ? Math.abs(coin.change24h).toFixed(2) : "?"
      }% over the last 24 hours${
        coin.change7d !== null
          ? `, ${coin.change7d >= 0 ? "up" : "down"} ${Math.abs(coin.change7d).toFixed(2)}% over 7 days`
          : ""
      }${
        coin.change30d !== null
          ? `, and ${coin.change30d >= 0 ? "up" : "down"} ${Math.abs(coin.change30d).toFixed(2)}% over 30 days`
          : ""
      }.`,
    },
    {
      q: `What is ${coin.name}?`,
      a:
        descriptionSnippet ||
        `${coin.name} (${symbol}) is a cryptocurrency ranked #${coin.marketCapRank ?? "—"} by market capitalization.`,
    },
    {
      q: `What is ${coin.name} used for?`,
      a:
        descriptionExtra ||
        `${coin.name} is a digital asset that trades against dollars and other cryptocurrencies on hundreds of exchanges — its live price, supply, and volume are tracked on this page.`,
    },
    {
      q: `What is ${coin.name}'s market rank?`,
      a:
        coin.marketCapRank !== null
          ? `${coin.name} is ranked #${coin.marketCapRank} by market capitalization, with a total value of ${formatCompactUsd(coin.marketCap)}.`
          : `A current market-cap rank for ${coin.name} is not available from the data provider right now.`,
    },
    {
      q: `What is ${coin.name}'s market cap?`,
      a: `The market capitalization of ${symbol} is ${formatCompactUsd(coin.marketCap)} — the live price multiplied by a circulating supply of ${supplyLabel} ${symbol}.`,
    },
    {
      q: `What is ${coin.name}'s 24-hour trading volume?`,
      a: `${formatCompactUsd(coin.totalVolume)} worth of ${symbol} changed hands across all exchanges in the last 24 hours.`,
    },
    {
      q: `How many ${coin.name} coins are there?`,
      a:
        coin.circulatingSupply !== null
          ? `${supplyLabel} ${symbol} are in circulation${
              coin.totalSupply !== null
                ? `, with a total supply of ${coin.totalSupply.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
                : ""
            }${
              coin.maxSupply !== null
                ? ` and a maximum supply of ${maxLabel}`
                : ", and no hard cap on issuance"
            }.`
          : `Circulating supply data for ${symbol} is currently unavailable; market cap is shown instead.`,
    },
    {
      q: `What was ${coin.name}'s all-time high?`,
      a:
        coin.ath !== null
          ? `${symbol} reached its all-time high of ${formatUsd(coin.ath)}${coin.athDate ? ` on ${longDate(coin.athDate)}` : ""}. That record sits ${Math.abs(athGap ?? 0).toFixed(1)}% ${athGap !== null && athGap >= 0 ? "above" : "below"} today's price.`
          : `All-time high data for ${symbol} is not available right now.`,
    },
    {
      q: `What was ${coin.name}'s all-time low?`,
      a:
        coin.atl !== null
          ? `${symbol} has traded as low as ${formatUsd(coin.atl)}. Today's price is ${Math.abs(atlGap ?? 0).toFixed(1)}% above that floor.`
          : `All-time low data for ${symbol} is not available right now.`,
    },
    {
      q: `What was ${coin.name}'s price 30 days ago?`,
      a:
        price30dAgo !== null && changeVs30d !== null
          ? `Thirty days ago ${symbol} traded around ${formatUsd(price30dAgo)} — a ${changeVs30d >= 0 ? "gain" : "drop"} of ${Math.abs(changeVs30d).toFixed(1)}% since then.`
          : `Historical price data for ${symbol} is still loading — the chart above shows the last year of daily closes.`,
    },
    {
      q: `What was ${coin.name}'s price yesterday?`,
      a:
        priceYesterday !== null
          ? `Yesterday's daily close for ${symbol} was about ${formatUsd(priceYesterday)}, versus ${formatUsd(coin.currentPrice)} today.`
          : `Yesterday's close for ${symbol} is not available right now.`,
    },
    {
      q: `When was ${coin.name} created?`,
      a: coin.genesisDate
        ? `${coin.name} launched on ${coin.genesisDate}.`
        : `The data provider does not list a genesis date for ${symbol}.`,
    },
    {
      q: `How is the ${coin.name} price calculated?`,
      a: `PaidinToken shows the ${symbol} price CoinGecko computes as a volume-weighted average across hundreds of exchanges. It refreshes on this page every 60 seconds.`,
    },
    {
      q: `Where can I buy ${coin.name}?`,
      a: `${coin.name} is listed on most major exchanges and decentralized swaps; availability depends on your region. Compare fees and liquidity before trading.`,
    },
    {
      q: `Should I invest in ${coin.name}?`,
      a: `PaidinToken does not provide financial advice. This page presents market data only — always do your own research and consider your own circumstances before buying any cryptocurrency.`,
    },
    {
      q: `How high can ${coin.name} go?`,
      a: `Nobody can predict prices. For context, ${symbol}'s all-time high is ${coin.ath !== null ? formatUsd(coin.ath) : "unknown"} while it trades at ${formatUsd(coin.currentPrice)} today — treat any price prediction with skepticism.`,
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
