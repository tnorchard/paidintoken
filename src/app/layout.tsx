import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import { WatchlistProvider } from "@/components/WatchlistProvider";
import "./globals.css";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  style: ["italic"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.paidintoken.com"),
  title: {
    default: "PaidinToken — Live Crypto Prices & News",
    template: "%s | PaidinToken",
  },
  description:
    "Live cryptocurrency prices, market stats, fear & greed index, gainers and losers, and the latest crypto news from CoinDesk, Cointelegraph, Decrypt, and The Block.",
  openGraph: {
    siteName: "PaidinToken",
    type: "website",
    url: "https://www.paidintoken.com",
  },
  twitter: {
    card: "summary_large_image",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "PaidinToken",
  url: "https://www.paidintoken.com",
  description:
    "Live cryptocurrency prices, market data, and crypto news — plus the original celebrity Bitcoin payment tracker.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${robotoMono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("pit-theme");document.documentElement.dataset.theme=t||"dark";}catch(e){document.documentElement.dataset.theme="dark";}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-surface text-ink antialiased">
        <WatchlistProvider>
          {children}
        </WatchlistProvider>
      </body>
    </html>
  );
}
