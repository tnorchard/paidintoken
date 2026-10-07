import Link from "next/link";

interface FooterProps {
  showOgLink?: boolean;
}

const columns = [
  {
    title: "Markets",
    links: [
      { label: "Live Prices", href: "/#markets" },
      { label: "Bitcoin Price", href: "/coins/bitcoin" },
      { label: "Ethereum Price", href: "/coins/ethereum" },
      { label: "BTC to USD", href: "/btc-to-usd" },
      { label: "Portfolio Calculator", href: "/portfolio" },
    ],
  },
  {
    title: "News & Learn",
    links: [
      { label: "Latest News", href: "/news" },
      { label: "Crypto 101", href: "/#learn" },
      { label: "Paid in Token Guide", href: "/learn/paid-in-token" },
      { label: "Bitcoin Halving", href: "/learn/bitcoin-halving" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Site",
    links: [
      { label: "OG Tracker", href: "/og" },
      { label: "Markets", href: "/#markets" },
      { label: "Movers", href: "/#markets" },
      { label: "Newsletter source feeds", href: "/news" },
    ],
  },
] as const;

export function Footer({ showOgLink = true }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 w-full border-t border-line bg-card px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <nav
          aria-label="Footer"
          className="grid grid-cols-2 gap-6 sm:grid-cols-3"
        >
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                {column.title}
              </h3>
              <ul className="mt-2 space-y-1.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">
          <h4 className="text-sm font-medium">PaidinToken ™ {year}</h4>
          <div className="flex flex-wrap items-center gap-4">
            {showOgLink && (
              <Link href="/og" className="text-sm font-medium hover:text-accent">
                See the OG site →
              </Link>
            )}
            <a
              href="mailto:admin@paidintoken.com"
              className="contact-email text-sm font-medium hover:text-accent"
            >
              admin@paidintoken.com
            </a>
          </div>
        </div>
        <p className="mt-2 text-xs text-muted">
          Market data by CoinGecko · Sentiment by Alternative.me · Not
          financial advice.
        </p>
      </div>
    </footer>
  );
}
