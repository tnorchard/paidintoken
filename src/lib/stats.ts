import type { MarketStats } from "@/types";

const COINGECKO_GLOBAL = "https://api.coingecko.com/api/v3/global";
const FEAR_GREED = "https://api.alternative.me/fng/?limit=30";

interface GeckoGlobal {
  data: {
    active_cryptocurrencies: number;
    markets: number;
    total_market_cap: { usd: number };
    total_volume: { usd: number };
    market_cap_change_percentage_24h_usd: number;
    market_cap_percentage: { btc: number; eth?: number };
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
  let ethDominance: number | null = null;
  let activeCoins: number | null = null;
  let exchangeMarkets: number | null = null;
  let fearGreed: MarketStats["fearGreed"] = null;
  let fearGreedHistory: number[] = [];

  if (globalResult.status === "fulfilled" && globalResult.value.ok) {
    const json: GeckoGlobal = await globalResult.value.json();
    totalMarketCap = json.data.total_market_cap.usd;
    totalVolume = json.data.total_volume.usd;
    marketCapChange24h = json.data.market_cap_change_percentage_24h_usd;
    btcDominance = json.data.market_cap_percentage.btc;
    ethDominance = json.data.market_cap_percentage.eth ?? null;
    activeCoins = json.data.active_cryptocurrencies ?? null;
    exchangeMarkets = json.data.markets ?? null;
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
    fearGreedHistory = [...(json.data ?? [])]
      .map((item) => Number(item.value))
      .filter((value) => Number.isFinite(value))
      .reverse();
  }

  return {
    totalMarketCap,
    marketCapChange24h,
    totalVolume,
    btcDominance,
    ethDominance,
    activeCoins,
    exchangeMarkets,
    fearGreed,
    fearGreedHistory,
  };
}
