import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false",
      { next: { revalidate: 60 } },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Bitcoin price");
    }

    const data = await response.json();
    const last = data.market_data.current_price.usd;
    const high = data.market_data.high_24h.usd;
    const low = data.market_data.low_24h.usd;

    return NextResponse.json({ last, high, low });
  } catch {
    const fallback = await import("@/data/fallback-price.json");
    return NextResponse.json(fallback.default);
  }
}
