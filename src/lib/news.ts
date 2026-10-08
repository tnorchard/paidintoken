import { XMLParser } from "fast-xml-parser";
import type { NewsItem } from "@/types";

const CRYPTO_FEEDS = [
  { source: "CoinDesk", url: "https://www.coindesk.com/arc/outboundfeeds/rss/" },
  { source: "Cointelegraph", url: "https://cointelegraph.com/rss" },
  { source: "Decrypt", url: "https://decrypt.co/feed" },
  { source: "The Block", url: "https://www.theblock.co/rss.xml" },
] as const;

const FINANCE_FEEDS = [
  {
    source: "CNBC",
    url: "https://www.cnbc.com/id/100003114/device/rss/rss.html",
  },
  {
    source: "MarketWatch",
    url: "https://feeds.content.dowjones.io/public/rss/mw_topstories",
  },
  {
    source: "WSJ Markets",
    url: "https://feeds.a.dj.com/rss/RSSMarketsMain.xml",
  },
] as const;

const VENTURE_FEEDS = [
  {
    source: "TechCrunch AI",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
  },
  {
    source: "TechCrunch VC",
    url: "https://techcrunch.com/category/venture/feed/",
  },
  {
    source: "VentureBeat",
    url: "https://venturebeat.com/feed/",
  },
] as const;

const FEEDS = [
  ...CRYPTO_FEEDS.map((feed) => ({ ...feed, category: "crypto" as const })),
  ...FINANCE_FEEDS.map((feed) => ({ ...feed, category: "finance" as const })),
  ...VENTURE_FEEDS.map((feed) => ({ ...feed, category: "venture" as const })),
];

export interface NewsBundle {
  crypto: NewsItem[];
  finance: NewsItem[];
  venture: NewsItem[];
}

const MAX_ITEMS_PER_FEED = 15;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  processEntities: true,
});

interface MediaNode {
  "@_url"?: string;
  "@_type"?: string;
  "@_medium"?: string;
}

interface RawItem {
  title?: string;
  link?: string;
  pubDate?: string;
  date?: string;
  enclosure?: MediaNode | MediaNode[];
  "media:content"?: MediaNode | MediaNode[];
  "media:thumbnail"?: MediaNode | MediaNode[];
  "content:encoded"?: string;
}

function decodeEntities(value: string): string {
  return value
    .replace(
      /&#x([0-9a-fA-F]+);/g,
      (_, hex) => String.fromCodePoint(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

function cleanText(value: string): string {
  return decodeEntities(
    value
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function firstNode(
  node: MediaNode | MediaNode[] | undefined,
): MediaNode | undefined {
  if (!node) return undefined;
  return Array.isArray(node) ? node[0] : node;
}

function isImageUrl(url: string | undefined): url is string {
  if (!url) return false;
  return /^https?:\/\//i.test(url);
}

function imageFromContentHtml(html: string | undefined): string | undefined {
  if (!html) return undefined;
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : undefined;
}

function extractImage(item: RawItem): string | undefined {
  const mediaContent = firstNode(item["media:content"]);
  if (
    mediaContent &&
    (mediaContent["@_medium"] === "image" ||
      mediaContent["@_type"]?.startsWith("image")) &&
    isImageUrl(mediaContent["@_url"])
  ) {
    return mediaContent["@_url"];
  }

  const thumbnail = firstNode(item["media:thumbnail"]);
  if (isImageUrl(thumbnail?.["@_url"])) return thumbnail["@_url"];

  const enclosure = firstNode(item.enclosure);
  if (
    enclosure &&
    enclosure["@_type"]?.startsWith("image") &&
    isImageUrl(enclosure["@_url"])
  ) {
    return enclosure["@_url"];
  }

  if (mediaContent && isImageUrl(mediaContent["@_url"])) {
    return mediaContent["@_url"];
  }

  const fromHtml = imageFromContentHtml(item["content:encoded"]);
  if (isImageUrl(fromHtml)) return fromHtml;

  return undefined;
}

function normalizeItem(
  item: RawItem,
  source: string,
  category: "crypto" | "finance" | "venture",
): NewsItem | null {
  if (!item.title || !item.link) return null;

  const publishedAt = Date.parse(item.pubDate ?? item.date ?? "");
  const link = typeof item.link === "string" ? item.link.trim() : "";

  if (!link) return null;

  return {
    title: cleanText(String(item.title)),
    link,
    source,
    category,
    publishedAt: Number.isNaN(publishedAt) ? 0 : publishedAt,
    image: extractImage(item),
  };
}

async function fetchFeed(feed: (typeof FEEDS)[number]): Promise<NewsItem[]> {
  const response = await fetch(feed.url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      accept: "application/rss+xml,application/xml,text/xml,*/*",
    },
    signal: AbortSignal.timeout(8000),
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${feed.source}: ${response.status}`);
  }

  const xml = await response.text();
  const doc = parser.parse(xml) as {
    rss?: { channel?: { item?: RawItem | RawItem[] } };
  };

  const channel = doc?.rss?.channel;
  if (!channel) return [];

  const rawItems = channel.item
    ? Array.isArray(channel.item)
      ? channel.item
      : [channel.item]
    : [];

  return rawItems
    .slice(0, MAX_ITEMS_PER_FEED)
    .map((item) => normalizeItem(item, feed.source, feed.category))
    .filter((item): item is NewsItem => item !== null);
}

const MAX_ENRICHMENTS = 12;
const ENRICH_CONCURRENCY = 6;

async function extractOgImage(url: string): Promise<string | undefined> {
  try {
    const response = await fetch(url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        accept: "text/html,application/xhtml+xml,*/*",
      },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 86400 },
    });
    if (!response.ok) return undefined;

    const html = await response.text();
    const match =
      html.match(
        /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      ) ??
      html.match(
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      );
    if (!match) return undefined;

    const image = decodeEntities(match[1]).trim();
    if (!/^https?:\/\//i.test(image)) return undefined;

    return image.replace("w=1920&h=1080", "w=640&h=360");
  } catch {
    return undefined;
  }
}

async function enrichMissingImages(items: NewsItem[]): Promise<void> {
  const missing = items.filter((item) => !item.image).slice(0, MAX_ENRICHMENTS);

  for (let i = 0; i < missing.length; i += ENRICH_CONCURRENCY) {
    const batch = missing.slice(i, i + ENRICH_CONCURRENCY);
    await Promise.all(
      batch.map(async (item) => {
        const image = await extractOgImage(item.link);
        if (image) item.image = image;
      }),
    );
  }
}

export async function getNews(perCategory = 10): Promise<NewsBundle> {
  const results = await Promise.allSettled(FEEDS.map(fetchFeed));

  const seen = new Set<string>();
  const crypto: NewsItem[] = [];
  const finance: NewsItem[] = [];
  const venture: NewsItem[] = [];

  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const item of result.value) {
      if (seen.has(item.link)) continue;
      seen.add(item.link);
      if (item.category === "finance") finance.push(item);
      else if (item.category === "venture") venture.push(item);
      else crypto.push(item);
    }
  }

  const newestFirst = (a: NewsItem, b: NewsItem) =>
    b.publishedAt - a.publishedAt;
  crypto.sort(newestFirst);
  finance.sort(newestFirst);
  venture.sort(newestFirst);

  const bundle: NewsBundle = {
    crypto: crypto.slice(0, perCategory),
    finance: finance.slice(0, perCategory),
    venture: venture.slice(0, perCategory),
  };

  await enrichMissingImages([
    ...bundle.crypto,
    ...bundle.finance,
    ...bundle.venture,
  ]);

  return bundle;
}
