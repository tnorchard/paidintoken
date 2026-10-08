import type { Metadata } from "next";
import type { ReactNode } from "react";
import { MarketProvider } from "@/components/MarketProvider";
import { Ticker } from "@/components/Ticker";
import { HeroPrice } from "@/components/HeroPrice";
import { StatsStrip } from "@/components/StatsStrip";
import { MarketBoard } from "@/components/MarketBoard";
import { MoversBoard } from "@/components/MoversBoard";
import { NewsCarousel } from "@/components/NewsCarousel";
import { GlossaryGrid } from "@/components/GlossaryGrid";
import { OgTeaser } from "@/components/OgTeaser";
import { WatchlistStrip } from "@/components/WatchlistStrip";
import { HalvingCountdown } from "@/components/HalvingCountdown";
import { FaqTeaser } from "@/components/FaqTeaser";
import { PriceChart } from "@/components/PriceChart";
import { MarketCapNote } from "@/components/MarketCapNote";
import { StocksBoard } from "@/components/StocksBoard";
import { MarketClocks } from "@/components/MarketClocks";
import { VcRounds } from "@/components/VcRounds";
import { getNews } from "@/lib/news";
import { getMarketStats } from "@/lib/stats";
import { getCoinChart } from "@/lib/coins";
import { getStockQuotes } from "@/lib/stocks";
import { getVentureRounds } from "@/lib/vc";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "PaidinToken — Live Crypto Prices & News",
  description:
    "Live cryptocurrency prices, market stats, fear & greed index, gainers and losers, plus crypto and finance news from CoinDesk, Cointelegraph, CNBC, and MarketWatch.",
  alternates: { canonical: "/" },
};

function SectionHeading({
  id,
  title,
  note,
}: {
  id?: string;
  title: string;
  note?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-4">
      <h2
        id={id}
        className="text-lg font-bold uppercase tracking-wider"
      >
        {title}
      </h2>
      {note && <div className="hidden text-xs text-muted sm:block">{note}</div>}
    </div>
  );
}

export default async function Home() {
  const [news, stats, btcChart, stockQuotes, ventureRounds] =
    await Promise.all([
      getNews(),
      getMarketStats(),
      getCoinChart("bitcoin"),
      getStockQuotes(),
      getVentureRounds(),
    ]);

  return (
    <MarketProvider>
      <Ticker />
      <HeroPrice stats={stats} />

      <main className="flex-1 space-y-12 py-10">
        <section id="news" className="space-y-1 px-4">
          <SectionHeading
            title="Latest News"
            note="CoinDesk · Cointelegraph · CNBC · MarketWatch"
          />
          <NewsCarousel label="Crypto News" items={news.crypto} />
          <NewsCarousel label="Finance News" items={news.finance} />
        </section>

        <section className="mx-auto max-w-5xl px-4">
          <SectionHeading
            title="Price Chart"
            note="Pick a coin · hover for prices"
          />
          <PriceChart data={btcChart} selectable initialId="bitcoin" />
        </section>

        <section id="markets" className="mx-auto max-w-5xl px-4">
          <SectionHeading
            title="Market Prices"
            note={<MarketCapNote stats={stats} />}
          />
          <WatchlistStrip />
          <MarketBoard />
          <p className="mt-3 text-xs text-muted">
            Tap ☆ to build a watchlist · open any coin for charts and supply
          </p>
        </section>

        <section className="mx-auto max-w-5xl px-4">
          <SectionHeading
            title="Movers"
            note="Biggest 24h swings in the top 100"
          />
          <MoversBoard />
        </section>

        <section className="mx-auto max-w-5xl px-4">
          <StatsStrip stats={stats} />
        </section>

        <section className="mx-auto max-w-5xl px-4">
          <SectionHeading
            title="Stocks & Markets"
            note="Indices · megacaps · commodities · FX"
          />
          <StocksBoard quotes={stockQuotes} />
          <p className="mt-4 mb-2 text-xs font-bold uppercase tracking-wider text-muted">
            Market Clocks
          </p>
          <MarketClocks />
        </section>

        <section className="mx-auto max-w-5xl px-4">
          <SectionHeading
            title="Bitcoin Halving"
            note="Supply cuts every ~4 years"
          />
          <HalvingCountdown />
        </section>

        <section className="mx-auto max-w-5xl px-4">
          <FaqTeaser />
        </section>

        <section id="learn" className="mx-auto max-w-5xl px-4">
          <SectionHeading
            title="Crypto 101"
            note="Tap a card to learn the lingo"
          />
          <GlossaryGrid />
        </section>

        <section className="mx-auto max-w-5xl px-4">
          <OgTeaser />
        </section>

        <section className="mx-auto max-w-5xl px-4">
          <SectionHeading
            title="Venture Capital"
            note="Recent rounds parsed from TechCrunch Venture"
          />
          <VcRounds rounds={ventureRounds} />
        </section>

        <section id="venture-news" className="space-y-1 px-4">
          <SectionHeading
            title="AI & VC News"
            note="TechCrunch · VentureBeat"
          />
          <NewsCarousel items={news.venture} />
        </section>
      </main>
    </MarketProvider>
  );
}
