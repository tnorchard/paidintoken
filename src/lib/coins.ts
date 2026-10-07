export interface CoinDetail {
  id: string;
  name: string;
  symbol: string;
  image: string;
  description: string;
  genesisDate: string | null;
  homepage: string | null;
  marketCapRank: number | null;
  currentPrice: number;
  marketCap: number;
  totalVolume: number;
  high24h: number | null;
  low24h: number | null;
  ath: number | null;
  athDate: string | null;
  atl: number | null;
  circulatingSupply: number | null;
  totalSupply: number | null;
  maxSupply: number | null;
  change24h: number | null;
  change7d: number | null;
  change30d: number | null;
}

export interface ChartPoint {
  t: number;
  price: number;
}

interface GeckoCoinDetail {
  id: string;
  name: string;
  symbol: string;
  image: string | { thumb?: string; small?: string; large?: string };
  genesis_date: string | null;
  market_cap_rank: number | null;
  description: { en?: string };
  links: { homepage?: Array<string | null> };
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    high_24h: { usd: number | null };
    low_24h: { usd: number | null };
    ath: { usd: number | null };
    ath_date: { usd: string | null };
    atl: { usd: number | null };
    circulating_supply: number | null;
    total_supply: number | null;
    max_supply: number | null;
    price_change_percentage_24h: number | null;
    price_change_percentage_7d: number | null;
    price_change_percentage_30d: number | null;
  };
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export type CoinResult =
  | { status: "ok"; coin: CoinDetail }
  | { status: "not-found" }
  | { status: "unavailable" };

export async function getCoin(id: string): Promise<CoinResult> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(id)}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
      { next: { revalidate: 600 }, signal: AbortSignal.timeout(10000) },
    );
    if (response.status === 404) return { status: "not-found" };
    if (!response.ok) return { status: "unavailable" };

    const data: GeckoCoinDetail = await response.json();
    const m = data.market_data;
    const homepage = data.links.homepage?.find((url) => url && url.length > 0);
    const image =
      typeof data.image === "string"
        ? data.image
        : (data.image.large ?? data.image.small ?? data.image.thumb ?? "");

    return {
      status: "ok",
      coin: {
        id: data.id,
        name: data.name,
        symbol: data.symbol,
        image,
        description: stripHtml(data.description.en ?? ""),
        genesisDate: data.genesis_date,
        homepage: homepage ?? null,
        marketCapRank: data.market_cap_rank,
        currentPrice: m.current_price.usd,
        marketCap: m.market_cap.usd,
        totalVolume: m.total_volume.usd,
        high24h: m.high_24h.usd,
        low24h: m.low_24h.usd,
        ath: m.ath.usd,
        athDate: m.ath_date.usd,
        atl: m.atl.usd,
        circulatingSupply: m.circulating_supply,
        totalSupply: m.total_supply,
        maxSupply: m.max_supply,
        change24h: m.price_change_percentage_24h,
        change7d: m.price_change_percentage_7d,
        change30d: m.price_change_percentage_30d,
      },
    };
  } catch {
    return { status: "unavailable" };
  }
}

export async function getCoinChart(id: string): Promise<ChartPoint[]> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(id)}/market_chart?vs_currency=usd&days=365`,
      { next: { revalidate: 3600 }, signal: AbortSignal.timeout(10000) },
    );
    if (!response.ok) return [];

    const data: { prices: Array<[number, number]> } = await response.json();
    return data.prices.map(([t, price]) => ({ t, price }));
  } catch {
    return [];
  }
}
