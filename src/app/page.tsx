import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { MarketProvider } from "@/components/MarketProvider";
import { Ticker } from "@/components/Ticker";
import { HeroPrice } from "@/components/HeroPrice";
import { StatsStrip } from "@/components/StatsStrip";
import { MarketBoard } from "@/components/MarketBoard";
import { MoversBoard } from "@/components/MoversBoard";
import { NewsCarousel } from "@/components/NewsCarousel";
import { GlossaryGrid } from "@/components/GlossaryGrid";
import { OgTeaser } from "@/components/OgTeaser";
import { Footer } from "@/components/Footer";
import { getNews } from "@/lib/news";
import { getMarketStats } from "@/lib/stats";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "PaidinToken — Live Crypto Prices & News",
  description:
    "Live cryptocurrency prices, market stats, fear & greed index, gainers and losers, and the latest crypto news from CoinDesk, Cointelegraph, Decrypt, and The Block.",
};

function SectionHeading({
  id,
  title,
  note,
}: {
  id?: string;
  title: string;
  note?: string;
}) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-4">
      <h2
        id={id}
        className="text-lg font-bold uppercase tracking-wider"
      >
        {title}
      </h2>
      {note && <p className="hidden text-xs text-muted sm:block">{note}</p>}
    </div>
  );
}

export default async function Home() {
  const [news, stats] = await Promise.all([getNews(), getMarketStats()]);

  return (
    <>
      <SiteHeader />
      <MarketProvider>
        <Ticker />
        <HeroPrice />

        <main className="flex-1 space-y-12 py-10">
          <section className="mx-auto max-w-5xl px-4">
            <StatsStrip stats={stats} />
          </section>

          <section id="markets" className="mx-auto max-w-5xl px-4">
            <SectionHeading
              title="Market Prices"
              note="LIVE · updates every 60s"
            />
            <MarketBoard />
          </section>

          <section className="mx-auto max-w-5xl px-4">
            <SectionHeading
              title="Movers"
              note="Biggest 24h swings in the top 100"
            />
            <MoversBoard />
          </section>

          <section id="news" className="mx-auto max-w-5xl px-4">
            <SectionHeading
              title="Latest Crypto News"
              note="CoinDesk · Cointelegraph · Decrypt · The Block"
            />
            <NewsCarousel items={news} />
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
        </main>
      </MarketProvider>
      <Footer />
    </>
  );
}
