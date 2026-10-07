export interface Athlete {
  name: string;
  numbits: number;
  sumpaid: number;
  date: string;
  pricebought: number;
  transaction: string;
}

export interface BitcoinPrice {
  last: number;
  high: number;
  low: number;
}

export interface AthleteRow extends Athlete {
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
  profitLossFormatted: string;
  priceAtPaymentFormatted: string;
  priceDifferenceFormatted: string;
}

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: number;
  marketCap: number;
  priceChange24hPercent: number | null;
  high24h: number | null;
  low24h: number | null;
}

export interface Mover {
  id: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: number;
  priceChange24hPercent: number | null;
}

export interface MarketData {
  coins: Coin[];
  gainers: Mover[];
  losers: Mover[];
  universe: Coin[];
}

export interface MarketStats {
  totalMarketCap: number | null;
  marketCapChange24h: number | null;
  totalVolume: number | null;
  btcDominance: number | null;
  ethDominance: number | null;
  activeCoins: number | null;
  exchangeMarkets: number | null;
  fearGreed: { value: number; label: string } | null;
  fearGreedHistory: number[];
}

export interface NewsItem {
  title: string;
  link: string;
  source: string;
  publishedAt: number;
  image?: string;
}
