import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

interface MarketsResponse {
  id: string;
  name: string;
  symbol: string;
  price_change_percentage_24h: number | null;
}

async function getCoinMeta(
  id: string,
): Promise<{ name: string; symbol: string; change: number | null } | null> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&price_change_percentage=24h",
      { next: { revalidate: 3600 } },
    );
    if (response.ok) {
      const data: MarketsResponse[] = await response.json();
      const found = data.find((coin) => coin.id === id);
      if (found) {
        return {
          name: found.name,
          symbol: found.symbol.toUpperCase(),
          change: found.price_change_percentage_24h,
        };
      }
    }
  } catch {
    // Fall through to a generic image.
  }
  return null;
}

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const coin = await getCoinMeta(id);
  const name = coin?.name ?? id;
  const symbol = coin?.symbol ?? "";
  const change = coin?.change;
  const changeText =
    change !== null && change !== undefined
      ? `${change >= 0 ? "+" : ""}${change.toFixed(2)}% · 24h`
      : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0b0e12",
          color: "#e8eaed",
          padding: 64,
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 36, color: "#22c55e" }}>
          Paidin<span style={{ color: "#e8eaed" }}>Token</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 84, fontWeight: 700 }}>
            {name} {symbol && `(${symbol})`} Price Today
          </div>
          <div style={{ display: "flex", gap: 24, fontSize: 32, color: "#9aa4b2" }}>
            <span>Live price · market cap · supply · 1-year chart</span>
            {changeText && <span style={{ color: "#22c55e" }}>{changeText}</span>}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#9aa4b2" }}>
          www.paidintoken.com
        </div>
      </div>
    ),
    size,
  );
}
