export interface StockQuote {
  symbol: string;
  label: string;
  price: number | null;
  changePercent: number | null;
}

const QUOTE_UNIVERSE: { symbol: string; label: string }[] = [
  { symbol: "^GSPC", label: "S&P 500" },
  { symbol: "^IXIC", label: "Nasdaq" },
  { symbol: "^DJI", label: "Dow Jones" },
  { symbol: "^RUT", label: "Russell 2000" },
  { symbol: "^VIX", label: "VIX" },
  { symbol: "NVDA", label: "NVIDIA" },
  { symbol: "AAPL", label: "Apple" },
  { symbol: "MSFT", label: "Microsoft" },
  { symbol: "TSLA", label: "Tesla" },
  { symbol: "AMZN", label: "Amazon" },
  { symbol: "GOOGL", label: "Alphabet" },
  { symbol: "META", label: "Meta" },
  { symbol: "GC=F", label: "Gold" },
  { symbol: "SI=F", label: "Silver" },
  { symbol: "CL=F", label: "Crude Oil" },
  { symbol: "EURUSD=X", label: "EUR / USD" },
  { symbol: "GBPUSD=X", label: "GBP / USD" },
  { symbol: "USDJPY=X", label: "USD / JPY" },
];

interface SparkMeta {
  regularMarketPrice?: number;
  regularMarketChangePercent?: number;
}

interface SparkResponse {
  spark?: {
    result?: {
      symbol?: string;
      response?: { meta?: SparkMeta }[];
    }[];
  };
}

function emptyQuotes(): StockQuote[] {
  return QUOTE_UNIVERSE.map(({ symbol, label }) => ({
    symbol,
    label,
    price: null,
    changePercent: null,
  }));
}

const SPARK_HOSTS = [
  "https://query1.finance.yahoo.com",
  "https://query2.finance.yahoo.com",
];

async function fetchSpark(host: string, symbols: string): Promise<SparkResponse> {
  const url = `${host}/v7/finance/spark?symbols=${symbols}&range=1d&interval=5m`;
  const response = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      accept: "application/json,text/plain,*/*",
      "accept-language": "en-US,en;q=0.9",
    },
    signal: AbortSignal.timeout(8000),
    next: { revalidate: 300 },
  });
  if (!response.ok) throw new Error(`spark ${response.status}`);
  return (await response.json()) as SparkResponse;
}

export async function getStockQuotes(): Promise<StockQuote[]> {
  const symbols = QUOTE_UNIVERSE.map((quote) => quote.symbol).join(",");

  let data: SparkResponse | null = null;
  for (const host of SPARK_HOSTS) {
    try {
      data = await fetchSpark(host, symbols);
      break;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }
  }
  if (!data) return emptyQuotes();

  const bySymbol = new Map<string, SparkMeta>();
  for (const entry of data.spark?.result ?? []) {
    const meta = entry.response?.[0]?.meta;
    if (entry.symbol && meta) bySymbol.set(entry.symbol, meta);
  }
  if (bySymbol.size === 0) return emptyQuotes();

  return QUOTE_UNIVERSE.map(({ symbol, label }) => {
    const meta = bySymbol.get(symbol);
    const price = meta?.regularMarketPrice;
    const change = meta?.regularMarketChangePercent;
    return {
      symbol,
      label,
      price: typeof price === "number" ? price : null,
      changePercent: typeof change === "number" ? change : null,
    };
  });
}
