import { NextResponse } from "next/server";
import type { Coin, Mover } from "@/types";

export const revalidate = 60;

interface GeckoMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number | null;
  high_24h: number | null;
  low_24h: number | null;
}

const MARKETS_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h";

const BOARD_SIZE = 12;
const MOVERS_SIZE = 5;

export async function GET() {
  try {
    const response = await fetch(MARKETS_URL, { next: { revalidate: 60 } });

    if (!response.ok) {
      throw new Error("Failed to fetch markets");
    }

    const data: GeckoMarket[] = await response.json();

    const mapCoin = (coin: GeckoMarket): Coin => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      currentPrice: coin.current_price,
      marketCap: coin.market_cap,
      priceChange24hPercent: coin.price_change_percentage_24h,
      high24h: coin.high_24h,
      low24h: coin.low_24h,
    });

    const coins: Coin[] = data.slice(0, BOARD_SIZE).map(mapCoin);
    const universe: Coin[] = data.map(mapCoin);

    const ranked = data
      .filter(
        (coin) =>
          coin.price_change_percentage_24h !== null &&
          Number.isFinite(coin.price_change_percentage_24h),
      )
      .map(
        (coin): Mover => ({
          id: coin.id,
          symbol: coin.symbol,
          name: coin.name,
          image: coin.image,
          currentPrice: coin.current_price,
          priceChange24hPercent: coin.price_change_percentage_24h,
        }),
      );

    const byChangeDesc = [...ranked].sort(
      (a, b) =>
        (b.priceChange24hPercent ?? 0) - (a.priceChange24hPercent ?? 0),
    );

    const gainers = byChangeDesc.slice(0, MOVERS_SIZE);
    const losers = byChangeDesc.slice(-MOVERS_SIZE).reverse();

    return NextResponse.json({ coins, gainers, losers, universe });
  } catch {
    return NextResponse.json(
      { coins: [], gainers: [], losers: [], universe: [] },
      { status: 503 },
    );
  }
}
