import type { MetadataRoute } from "next";
import { glossary } from "@/data/glossary";

const BASE_URL = "https://www.paidintoken.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "hourly", priority: 1 },
    { url: `${BASE_URL}/og`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/news`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE_URL}/btc-to-usd`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.8 },
    { url: `${BASE_URL}/portfolio`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  const learnRoutes = glossary.map((entry) => ({
    url: `${BASE_URL}/learn/${entry.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  let coinRoutes: MetadataRoute.Sitemap = [];
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1",
      { next: { revalidate: 3600 } },
    );
    if (response.ok) {
      const data: Array<{ id: string }> = await response.json();
      coinRoutes = data.map((coin) => ({
        url: `${BASE_URL}/coins/${coin.id}`,
        lastModified: new Date(),
        changeFrequency: "hourly" as const,
        priority: 0.8,
      }));
    }
  } catch {
    // Sitemap still lists static routes if CoinGecko is unreachable.
  }

  return [...staticRoutes, ...learnRoutes, ...coinRoutes];
}
