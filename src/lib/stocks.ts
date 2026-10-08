import { get as httpsGet } from "node:https";

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

const SPARK_HOSTS = [
  "https://query1.finance.yahoo.com",
  "https://query2.finance.yahoo.com",
];

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

interface QuoteValues {
  price: number | null;
  changePercent: number | null;
}

function parseNum(value: string | undefined | null): number | null {
  if (!value) return null;
  const n = parseFloat(String(value).replace(/[,%\s]/g, ""));
  return Number.isFinite(n) ? n : null;
}

async function fetchSpark(host: string, symbols: string): Promise<Map<string, QuoteValues>> {
  const url = `${host}/v7/finance/spark?symbols=${symbols}&range=1d&interval=5m`;
  const response = await fetch(url, {
    headers: {
      "user-agent": BROWSER_UA,
      accept: "application/json,text/plain,*/*",
      "accept-language": "en-US,en;q=0.9",
    },
    signal: AbortSignal.timeout(8000),
    next: { revalidate: 300 },
  });
  if (!response.ok) throw new Error(`spark ${response.status}`);
  const data = (await response.json()) as SparkResponse;

  const out = new Map<string, QuoteValues>();
  for (const entry of data.spark?.result ?? []) {
    const meta = entry.response?.[0]?.meta;
    if (!entry.symbol || !meta) continue;
    out.set(entry.symbol, {
      price: typeof meta.regularMarketPrice === "number" ? meta.regularMarketPrice : null,
      changePercent:
        typeof meta.regularMarketChangePercent === "number"
          ? meta.regularMarketChangePercent
          : null,
    });
  }
  if (out.size === 0) throw new Error("spark empty");
  return out;
}

const CNBC_SYMBOLS: Record<string, string> = {
  "^GSPC": ".SPX",
  "^IXIC": ".IXIC",
  "^DJI": ".DJI",
  "^RUT": ".RUT",
  "^VIX": "VIX",
  NVDA: "NVDA",
  AAPL: "AAPL",
  MSFT: "MSFT",
  TSLA: "TSLA",
  AMZN: "AMZN",
  GOOGL: "GOOGL",
  META: "META",
  "EURUSD=X": "EUR=",
  "GBPUSD=X": "GBP=",
  "USDJPY=X": "JPY=",
};

async function fetchCnbc(): Promise<Map<string, QuoteValues>> {
  const symbols = Object.values(CNBC_SYMBOLS).join("|");
  const url =
    `https://quote.cnbc.com/quote-html-webservice/restQuote/symbolType/symbol` +
    `?symbols=${symbols}&requestMethod=itv&noform=1&partnerId=2&fund=1&exthrs=1&output=json`;
  const response = await fetch(url, {
    headers: { "user-agent": BROWSER_UA, accept: "application/json" },
    signal: AbortSignal.timeout(8000),
    next: { revalidate: 300 },
  });
  if (!response.ok) throw new Error(`cnbc ${response.status}`);
  const data = (await response.json()) as {
    FormattedQuoteResult?: {
      FormattedQuote?:
        | { symbol?: string; code?: number; last?: string; change_pct?: string }
        | { symbol?: string; code?: number; last?: string; change_pct?: string }[];
    };
  };

  const raw = data?.FormattedQuoteResult?.FormattedQuote;
  const rows = raw ? (Array.isArray(raw) ? raw : [raw]) : [];
  const byCnbc = new Map<string, QuoteValues>();
  for (const row of rows) {
    if (row.code !== 0 || !row.symbol || !row.last) continue;
    byCnbc.set(row.symbol, {
      price: parseNum(row.last),
      changePercent: parseNum(row.change_pct),
    });
  }
  if (byCnbc.size === 0) throw new Error("cnbc empty");

  const out = new Map<string, QuoteValues>();
  for (const [yahooSymbol, cnbcSymbol] of Object.entries(CNBC_SYMBOLS)) {
    const values = byCnbc.get(cnbcSymbol);
    if (values) out.set(yahooSymbol, values);
  }
  return out;
}

function tagAttr(tag: string, name: string): string | null {
  const match = tag.match(new RegExp(`${name}="([^"]*)"`));
  return match ? match[1] : null;
}

function fetchHtml(url: string, redirectsLeft = 2): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = httpsGet(
      url,
      {
        headers: {
          "user-agent": BROWSER_UA,
          accept: "text/html,application/xhtml+xml",
          "accept-language": "en-US,en;q=0.9",
        },
        timeout: 8000,
        maxHeaderSize: 1024 * 1024,
      },
      (res) => {
        const status = res.statusCode ?? 0;
        if (status >= 300 && status < 400 && res.headers.location) {
          res.resume();
          if (redirectsLeft <= 0) {
            reject(new Error("too many redirects"));
            return;
          }
          fetchHtml(new URL(res.headers.location, url).toString(), redirectsLeft - 1).then(
            resolve,
            reject,
          );
          return;
        }
        if (status !== 200) {
          res.resume();
          reject(new Error(`html ${status}`));
          return;
        }
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
        res.on("error", reject);
      },
    );
    req.on("error", reject);
    req.on("timeout", () => req.destroy(new Error("html timeout")));
  });
}

async function scrapeYahooQuote(symbol: string): Promise<QuoteValues> {
  const url = `https://finance.yahoo.com/quote/${encodeURIComponent(symbol)}/`;
  const html = await fetchHtml(url);

  const values: QuoteValues = { price: null, changePercent: null };
  const tags = html.match(/<fin-streamer\b[^>]*>/g) ?? [];
  for (const tag of tags) {
    if (tagAttr(tag, "data-symbol") !== symbol) continue;
    const field = tagAttr(tag, "data-field");
    const value = tagAttr(tag, "data-value");
    if (field === "regularMarketPrice") values.price = parseNum(value);
    if (field === "regularMarketChangePercent") values.changePercent = parseNum(value);
  }

  if (values.price === null) {
    const header = html.match(
      /data-testid="quote-sticky-hdr"[\s\S]{0,2000}?<\/section>/,
    )?.[0];
    if (header) {
      const priceMatch = header.match(
        /<span[^>]*class="[^"]*\bbase\b[^"]*"[^>]*>\s*([-\d.,]+)/,
      );
      const changeMatch = header.match(
        /class="[^"]*\bchange\b[^"]*"[^>]*>\s*([-+]?\d+(?:\.\d+)?)\s*%/,
      );
      values.price = parseNum(priceMatch?.[1]);
      values.changePercent = parseNum(changeMatch?.[1]);
    }
  }

  if (values.price === null) throw new Error(`no price for ${symbol}`);
  return values;
}

const SCRAPE_SYMBOLS = ["GC=F", "SI=F", "CL=F"];

function mergeMissing(
  target: Map<string, QuoteValues>,
  source: Map<string, QuoteValues>,
): void {
  for (const [symbol, values] of source) {
    const existing = target.get(symbol);
    if (!existing) {
      target.set(symbol, values);
    } else {
      if (existing.price === null) existing.price = values.price;
      if (existing.changePercent === null) existing.changePercent = values.changePercent;
    }
  }
}

function hasPrice(values: QuoteValues | undefined): boolean {
  return values !== undefined && values.price !== null;
}

export async function getStockQuotes(): Promise<StockQuote[]> {
  const symbols = QUOTE_UNIVERSE.map((quote) => quote.symbol).join(",");
  const merged = new Map<string, QuoteValues>();

  for (const host of SPARK_HOSTS) {
    try {
      mergeMissing(merged, await fetchSpark(host, symbols));
      break;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }
  }

  const needsFallback = QUOTE_UNIVERSE.some(
    ({ symbol }) => !hasPrice(merged.get(symbol)),
  );

  if (needsFallback) {
    try {
      mergeMissing(merged, await fetchCnbc());
    } catch {
      // CNBC unavailable — next fallback may still cover these symbols
    }

    const stillMissing = QUOTE_UNIVERSE.filter(
      ({ symbol }) => !hasPrice(merged.get(symbol)),
    ).map(({ symbol }) => symbol);

    if (stillMissing.length > 0) {
      const scraped = await Promise.allSettled(
        stillMissing
          .filter((symbol) => SCRAPE_SYMBOLS.includes(symbol))
          .map(async (symbol) => [symbol, await scrapeYahooQuote(symbol)] as const),
      );
      for (const result of scraped) {
        if (result.status === "fulfilled") {
          const [symbol, values] = result.value;
          merged.set(symbol, values);
        }
      }
    }
  }

  return QUOTE_UNIVERSE.map(({ symbol, label }) => {
    const values = merged.get(symbol);
    return {
      symbol,
      label,
      price: values?.price ?? null,
      changePercent: values?.changePercent ?? null,
    };
  });
}
