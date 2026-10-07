import Link from "next/link";

const teasers = [
  {
    q: "How often do prices update?",
    a: "Every 60 seconds. Prices come from CoinGecko through cached endpoints so the site stays fast even under heavy traffic.",
  },
  {
    q: "Where does the news come from?",
    a: "Official RSS feeds of CoinDesk, Cointelegraph, Decrypt, and The Block — new items show up within five minutes and always link back to the original article.",
  },
  {
    q: "Is my watchlist stored on a server?",
    a: "No. Watchlists and portfolios live in your browser's local storage only. Clearing site data resets them.",
  },
  {
    q: "What is BTC dominance?",
    a: "Bitcoin's market cap divided by the total crypto market cap, as a percentage. Rising dominance means bitcoin is outperforming altcoins.",
  },
];

export function FaqTeaser() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {teasers.map((item) => (
        <details
          key={item.q}
          className="group rounded-lg border border-line bg-card p-4 transition hover:border-accent"
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-sm font-bold [&::-webkit-details-marker]:hidden">
            {item.q}
            <span
              aria-hidden="true"
              className="text-lg font-normal text-accent transition group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-2 text-sm leading-relaxed text-muted">{item.a}</p>
        </details>
      ))}
      <p className="text-sm text-muted md:col-span-2">
        12 questions answered in the{" "}
        <Link href="/faq" className="font-semibold text-ink hover:text-accent">
          full FAQ →
        </Link>
      </p>
    </div>
  );
}
