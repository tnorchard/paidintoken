import type { MarketStats } from "@/types";

const COINGECKO_GLOBAL = "https://api.coingecko.com/api/v3/global";
const FEAR_GREED = "https://api.alternative.me/fng/?limit=1";

interface GeckoGlobal {
  data: {
    total_market_cap: { usd: number };
    total_volume: { usd: number };
    market_cap_change_percentage_24h_usd: number;
    market_cap_percentage: { btc: number };
  };
}

interface FearGreedResponse {
  data: Array<{
    value: string;
    value_classification: string;
  }>;
}

export async function getMarketStats(): Promise<MarketStats> {
  const [globalResult, fearGreedResult] = await Promise.allSettled([
    fetch(COINGECKO_GLOBAL, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8000),
    }),
    fetch(FEAR_GREED, {
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(8000),
    }),
  ]);

  let totalMarketCap: number | null = null;
  let marketCapChange24h: number | null = null;
  let totalVolume: number | null = null;
  let btcDominance: number | null = null;
  let fearGreed: MarketStats["fearGreed"] = null;

  if (globalResult.status === "fulfilled" && globalResult.value.ok) {
    const json: GeckoGlobal = await globalResult.value.json();
    totalMarketCap = json.data.total_market_cap.usd;
    totalVolume = json.data.total_volume.usd;
    marketCapChange24h = json.data.market_cap_change_percentage_24h_usd;
    btcDominance = json.data.market_cap_percentage.btc;
  }

  if (fearGreedResult.status === "fulfilled" && fearGreedResult.value.ok) {
    const json: FearGreedResponse = await fearGreedResult.value.json();
    const entry = json.data?.[0];
    if (entry) {
      fearGreed = {
        value: Number(entry.value),
        label: entry.value_classification,
      };
    }
  }

  return {
    totalMarketCap,
    marketCapChange24h,
    totalVolume,
    btcDominance,
    fearGreed,
  };
}
