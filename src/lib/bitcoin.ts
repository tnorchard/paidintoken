import type { BitcoinPrice } from "@/types";

export async function getBitcoinPrice(): Promise<BitcoinPrice | null> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false",
      { next: { revalidate: 300 }, signal: AbortSignal.timeout(8000) },
    );
    if (!response.ok) throw new Error("Failed to fetch Bitcoin price");

    const data = await response.json();
    return {
      last: data.market_data.current_price.usd,
      high: data.market_data.high_24h.usd,
      low: data.market_data.low_24h.usd,
    };
  } catch {
    try {
      const fallback = await import("@/data/fallback-price.json");
      return fallback.default as BitcoinPrice;
    } catch {
      return null;
    }
  }
}
