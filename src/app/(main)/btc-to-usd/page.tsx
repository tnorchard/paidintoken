import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BtcCalculator } from "@/components/BtcCalculator";
import { FaqBlock } from "@/components/FaqBlock";
import { getBitcoinPrice } from "@/lib/bitcoin";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Bitcoin to USD Converter — Live BTC to Dollars",
  description:
    "Convert Bitcoin to US dollars at live rates. Instant BTC to USD calculator plus a conversion table for 0.001, 0.01, 0.1, 1, 10 and 100 BTC — updated every 60 seconds.",
  alternates: { canonical: "/btc-to-usd" },
};

const TABLE_AMOUNTS = [0.001, 0.01, 0.1, 0.5, 1, 5, 10, 50, 100];

const FAQ_ITEMS = [
  {
    q: "Where does this exchange rate come from?",
    a: "CoinGecko's volume-weighted average of bitcoin across hundreds of exchanges. PaidinToken refreshes it every 60 seconds, so it tracks the live market rather than a fixed daily rate.",
  },
  {
    q: "Why is my exchange's price slightly different?",
    a: "Every venue quotes its own price, and exchanges add a spread and fees on top of the market rate. Differences of a fraction of a percent are normal; larger gaps usually mean illiquid markets.",
  },
  {
    q: "How do I convert US dollars back to bitcoin?",
    a: "Divide the dollar amount by the BTC price shown above — for example, $500 at a $80,000 bitcoin price is 0.00625 BTC. The calculator above does this math for any amount.",
  },
  {
    q: "Does PaidinToken charge a fee for converting?",
    a: "No. This is a free reference tool — no bitcoin changes hands here, and no account is required. Any actual conversion happens on the exchange or wallet you use.",
  },
];

export default async function BtcToUsdPage() {
  const btc = await getBitcoinPrice();
  const price = btc?.last ?? 0;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <Breadcrumbs items={[{ label: "BTC to USD" }]} />

      <h1 className="text-3xl font-bold">Bitcoin to USD Converter</h1>
      <p className="mt-2 text-sm text-muted">
        Live exchange rate:{" "}
        <span className="font-bold text-ink tabular-nums">
          1 BTC ={" "}
          {price > 0
            ? price.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })
            : "—"}
        </span>
      </p>

      <div className="mt-6">
        {price > 0 ? (
          <BtcCalculator btcPrice={price} />
        ) : (
          <div className="rounded-lg border border-line bg-card p-5 text-sm text-muted">
            Live rate unavailable — refresh in a moment.
          </div>
        )}
      </div>

      {price > 0 && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-line bg-card">
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <caption className="sr-only">
              Common Bitcoin amounts converted to US dollars
            </caption>
            <thead>
              <tr className="border-b-2 border-ink text-left text-xs uppercase tracking-wider">
                <th scope="col" className="p-3 font-medium">
                  Bitcoin (BTC)
                </th>
                <th scope="col" className="p-3 text-right font-medium">
                  US Dollars (USD)
                </th>
              </tr>
            </thead>
            <tbody>
              {TABLE_AMOUNTS.map((amount) => (
                <tr
                  key={amount}
                  className="border-b border-line last:border-b-0"
                >
                  <td className="p-3 font-semibold tabular-nums">
                    {amount.toLocaleString("en-US")} BTC
                  </td>
                  <td className="p-3 text-right font-semibold tabular-nums">
                    {(amount * price).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <section className="mt-8 space-y-3 text-sm leading-relaxed text-muted">
        <p>
          Bitcoin has no official exchange rate — its dollar price is the
          volume-weighted average across hundreds of exchanges, which is why
          quotes can differ by a few dollars between venues at any given
          moment. The rate on this page comes from CoinGecko and refreshes
          every 60 seconds.
        </p>
        <p>
          For context: bitcoin has ranged from under $1 in its early years to
          six-figure all-time highs, so any conversion table is a snapshot —
          multiply by today&apos;s rate rather than remembering an old one.
          When you need a precise figure for a real transaction, compare the
          rate your exchange or payment processor offers, since spreads and
          fees sit on top of the market price.
        </p>
        <p>
          Looking to track a whole portfolio instead of a single conversion?
          Try the{" "}
          <Link
            href="/portfolio"
            className="font-semibold text-ink hover:text-accent"
          >
            portfolio calculator
          </Link>
          , or see{" "}
          <Link
            href="/coins/bitcoin"
            className="font-semibold text-ink hover:text-accent"
          >
            Bitcoin&apos;s full price page
          </Link>{" "}
          with charts, supply, and all-time highs.
        </p>
      </section>
      <FaqBlock items={FAQ_ITEMS} title="FAQ · BTC to USD" />
    </main>
  );
}
