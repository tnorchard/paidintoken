import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MarketProvider } from "@/components/MarketProvider";
import { PortfolioCalculator } from "@/components/PortfolioCalculator";

export const metadata: Metadata = {
  title: "Crypto Portfolio Calculator — Track Holdings & P/L",
  description:
    "Free crypto portfolio calculator: add your coin quantities and total cost, see live values, profit and loss, and a portfolio total that updates every 60 seconds. Saved in your browser only.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <Breadcrumbs items={[{ label: "Portfolio Calculator" }]} />

      <h1 className="text-3xl font-bold">Crypto Portfolio Calculator</h1>
      <p className="mt-2 text-sm text-muted">
        Add each holding with its quantity and total cost — live values, unrealized P/L, and your portfolio total update every 60 seconds. Nothing is uploaded; everything stays in this browser.
      </p>

      <div className="mt-6">
        <MarketProvider>
          <PortfolioCalculator />
        </MarketProvider>
      </div>

      <section className="mt-8 space-y-3 text-sm leading-relaxed text-muted">
        <p>
          Cost basis is the total you paid for a position in US dollars — enter
          what you actually spent, not the per-coin price, and the calculator
          handles the rest.           Profit and loss are unrealized until you sell.
        </p>
        <p>
          For single conversions — how much is 0.05 BTC in dollars — use the{" "}
          <Link href="/btc-to-usd" className="font-semibold text-ink hover:text-accent">
            BTC to USD converter
          </Link>
          , or open any coin from{" "}
          <Link href="/#markets" className="font-semibold text-ink hover:text-accent">
            the market board
          </Link>{" "}
          for charts and supply data.
        </p>
      </section>
    </main>
  );
}
