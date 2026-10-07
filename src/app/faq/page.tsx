import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Crypto FAQ — Prices, News & How PaidinToken Works",
  description:
    "Answers to frequently asked questions about PaidinToken: how live crypto prices update, where our news comes from, how the Fear & Greed Index works, and how people get paid in bitcoin.",
  alternates: { canonical: "/faq" },
};

const faqs = [
  {
    q: "What is PaidinToken?",
    a: "PaidinToken is a free crypto data dashboard that combines live prices, market statistics, and news from major crypto publications in one clean interface. It also hosts the original celebrity Bitcoin payment tracker that gave the site its name.",
  },
  {
    q: "How often do the prices update?",
    a: "Prices refresh every 60 seconds. The site polls its own cached data endpoints, which in turn fetch from CoinGecko at most once per minute — so data stays fresh without hammering the API, no matter how many visitors are on the site.",
  },
  {
    q: "Where does the news come from?",
    a: "News headlines and images are pulled from official RSS feeds of CoinDesk, Cointelegraph, Decrypt, and The Block. New items appear on the site within five minutes of publication, and every story links back to the original article.",
  },
  {
    q: "How is the Fear & Greed Index calculated?",
    a: "The index is provided by Alternative.me and scores market sentiment from 0 (extreme fear) to 100 (extreme greed). It combines volatility, market momentum, social media activity, surveys, and dominance into a single daily number.",
  },
  {
    q: "What is BTC dominance?",
    a: "BTC dominance is bitcoin's market capitalization divided by the total crypto market capitalization, shown as a percentage. When it rises, bitcoin is outperforming the rest of the market; when it falls, altcoins are gaining share.",
  },
  {
    q: "What is the OG tracker?",
    a: "The OG tracker is the original PaidinToken page: a table of celebrities and athletes — Russell Okung, Mayor Eric Adams, Aaron Rodgers and others — who were paid in or converted earnings to bitcoin. It shows how much they received and what those holdings are worth today.",
  },
  {
    q: "Do I need an account to use PaidinToken?",
    a: "No. Every feature — prices, charts, news, the watchlist, and the portfolio calculator — works without signing up. There is no account system and no paywall.",
  },
  {
    q: "Is my watchlist or portfolio data stored on your servers?",
    a: "No. Watchlists and portfolio holdings are saved in your browser's local storage only. They never leave your device, which is also why they don't sync between browsers — clearing site data resets them.",
  },
  {
    q: "What is a bitcoin halving?",
    a: "A halving is a programmed event roughly every four years that cuts the reward for mining new bitcoin blocks in half, reducing new supply. The next halving is expected around April 2028, dropping the block reward from 3.125 to 1.5625 BTC.",
  },
  {
    q: "How do people get paid in bitcoin?",
    a: "Workers can route part or all of their salary through payment processors that convert fiat to bitcoin instantly, negotiate crypto directly with employers, or invoice clients in stablecoins or BTC. The original tracker documents public examples of exactly this.",
  },
  {
    q: "What is the difference between market cap and trading volume?",
    a: "Market cap is the total value of all coins in circulation (price × supply) and measures size. Trading volume is the value traded over 24 hours and measures activity. A coin can have a huge market cap but low volume, which usually signals weak liquidity.",
  },
  {
    q: "Where does the market data come from?",
    a: "All price and market statistics are sourced from CoinGecko's free public API, with sentiment data from Alternative.me. CoinGecko aggregates data from hundreds of exchanges, and PaidinToken caches it briefly to stay fast and within rate limits.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export default function FaqPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Breadcrumbs items={[{ label: "FAQ" }]} />

      <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
      <p className="mt-2 text-sm text-muted">
        Everything about how PaidinToken&apos;s live prices, news feed, and stats
        work — plus the crypto basics behind them.
      </p>

      <div className="mt-6 space-y-3">
        {faqs.map((faq) => (
          <details
            key={faq.q}
            className="group rounded-lg border border-line bg-card p-4 transition hover:border-accent"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-sm font-bold [&::-webkit-details-marker]:hidden">
              {faq.q}
              <span
                aria-hidden="true"
                className="text-lg font-normal text-accent transition group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-muted">{faq.a}</p>
          </details>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted">
        Still curious? Browse{" "}
        <Link href="/news" className="font-semibold text-ink hover:text-accent">
          the latest crypto news
        </Link>{" "}
        or explore the{" "}
        <Link href="/learn/paid-in-token" className="font-semibold text-ink hover:text-accent">
          Paid in Token guide
        </Link>
        .
      </p>
    </main>
  );
}
